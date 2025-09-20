import {
  users,
  incidents,
  comments,
  ratings,
  smsAlerts,
  userProfiles,
  alertPreferences,
  predictionScores,
  type User,
  type UpsertUser,
  type Incident,
  type InsertIncident,
  type Comment,
  type InsertComment,
  type Rating,
  type InsertRating,
  type SmsAlert,
  type InsertSmsAlert,
  type UserProfile,
  type InsertUserProfile,
  type AlertPreferences,
  type InsertAlertPreferences,
  type PredictionScore,
  type InsertPredictionScore,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or, gte } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getIncidents(filters?: {
    types?: string[];
    timeFilter?: string;
    severity?: string[];
    searchQuery?: string;
  }): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  
  getCommentsByIncidentId(incidentId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  getRatingsByIncidentId(incidentId: string): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  getAverageRating(incidentId: string): Promise<{ average: number; count: number }>;

  // SMS Alert operations
  createSmsAlert(smsAlert: InsertSmsAlert): Promise<SmsAlert>;
  getSmsAlertsByIncidentId(incidentId: string): Promise<SmsAlert[]>;
  updateSmsAlertStatus(id: string, status: string): Promise<void>;
  
  // Butterfly AI operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  getAlertPreferences(userId: string): Promise<AlertPreferences | undefined>;
  upsertAlertPreferences(preferences: InsertAlertPreferences): Promise<AlertPreferences>;
  
  createPredictionScore(score: InsertPredictionScore): Promise<PredictionScore>;
  getPredictionScoresByUserId(userId: string): Promise<PredictionScore[]>;
  getPredictionScore(userId: string, incidentId: string): Promise<PredictionScore | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Initialize sample data if needed
  async initializeSampleData() {
    const existingIncidents = await db.select().from(incidents).limit(1);
    if (existingIncidents.length > 0) {
      return; // Sample data already exists
    }

    // Sample incidents in Lisbon
    const sampleIncidents = [
      {
        type: 'theft',
        title: 'Vol de smartphone',
        description: 'Vol de smartphone vers 14h30. Deux personnes à moto ont arraché le téléphone des mains d\'une touriste près de l\'arrêt de tram.',
        location: 'Rua Augusta, 123, Baixa, Lisboa',
        latitude: '38.7133',
        longitude: '-9.1393',
        severity: 'high',
        date: '2025-08-02',
        time: '14:30',
        isAnonymous: 0,
        reportedBy: null,
      },
      {
        type: 'danger',
        title: 'Zone mal éclairée',
        description: 'Cette rue est très mal éclairée le soir, ce qui peut être dangereux pour les piétons.',
        location: 'Bairro Alto, Lisboa',
        latitude: '38.7183',
        longitude: '-9.1343',
        severity: 'medium',
        date: '2025-08-02',
        time: '09:15',
        isAnonymous: 1,
        reportedBy: null,
      },
      {
        type: 'theft',
        title: 'Pickpocket dans le tram',
        description: 'Pickpocket observé dans le tram 28, attention aux sacs et portefeuilles.',
        location: 'Ligne 28, Lisboa',
        latitude: '38.7203',
        longitude: '-9.1443',
        severity: 'medium',
        date: '2025-08-01',
        time: '16:45',
        isAnonymous: 0,
        reportedBy: null,
      },
    ];

    const insertedIncidents = await db.insert(incidents).values(sampleIncidents).returning();

    // Sample comments
    const firstIncidentId = insertedIncidents[0].id;
    const sampleComments = [
      {
        incidentId: firstIncidentId,
        content: 'J\'ai vu la même chose hier au même endroit. Il faut vraiment faire attention dans cette zone.',
        authorName: 'Maria S.',
      },
      {
        incidentId: firstIncidentId,
        content: 'Merci pour le signalement, je vais éviter cette zone.',
        authorName: 'João P.',
      },
    ];

    await db.insert(comments).values(sampleComments);

    // Sample ratings
    const sampleRatings = [
      {
        incidentId: firstIncidentId,
        rating: 5,
        userId: null,
      },
      {
        incidentId: firstIncidentId,
        rating: 4,
        userId: null,
      },
      {
        incidentId: firstIncidentId,
        rating: 4,
        userId: null,
      },
    ];

    await db.insert(ratings).values(sampleRatings);
  }

  async getIncidents(filters?: {
    types?: string[];
    timeFilter?: string;
    severity?: string[];
    searchQuery?: string;
  }): Promise<Incident[]> {
    const conditions = [];

    if (filters) {
      if (filters.types && filters.types.length > 0) {
        conditions.push(or(...filters.types.map(type => eq(incidents.type, type))));
      }

      if (filters.severity && filters.severity.length > 0) {
        conditions.push(or(...filters.severity.map(severity => eq(incidents.severity, severity))));
      }

      if (filters.searchQuery) {
        const searchTerm = `%${filters.searchQuery}%`;
        conditions.push(
          or(
            ilike(incidents.title, searchTerm),
            ilike(incidents.description, searchTerm),
            ilike(incidents.location, searchTerm)
          )
        );
      }

      if (filters.timeFilter && filters.timeFilter !== 'all') {
        const now = new Date();
        let filterDate = new Date();
        
        switch (filters.timeFilter) {
          case '24h':
            filterDate.setHours(now.getHours() - 24);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        conditions.push(gte(incidents.createdAt, filterDate));
      }
    }

    let query = db.select().from(incidents);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(incidents.createdAt));
    return result;
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident;
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const [incident] = await db.insert(incidents).values(insertIncident).returning();
    return incident;
  }

  async getCommentsByIncidentId(incidentId: string): Promise<Comment[]> {
    const result = await db
      .select()
      .from(comments)
      .where(eq(comments.incidentId, incidentId))
      .orderBy(comments.createdAt);
    return result;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }

  async getRatingsByIncidentId(incidentId: string): Promise<Rating[]> {
    const result = await db
      .select()
      .from(ratings)
      .where(eq(ratings.incidentId, incidentId));
    return result;
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db.insert(ratings).values(insertRating).returning();
    return rating;
  }

  async getAverageRating(incidentId: string): Promise<{ average: number; count: number }> {
    const incidentRatings = await this.getRatingsByIncidentId(incidentId);
    if (incidentRatings.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const sum = incidentRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / incidentRatings.length;
    
    return { average: Math.round(average * 10) / 10, count: incidentRatings.length };
  }

  // SMS Alert operations
  async createSmsAlert(smsAlert: InsertSmsAlert): Promise<SmsAlert> {
    const [alert] = await db.insert(smsAlerts).values(smsAlert).returning();
    return alert;
  }

  async getSmsAlertsByIncidentId(incidentId: string): Promise<SmsAlert[]> {
    const result = await db
      .select()
      .from(smsAlerts)
      .where(eq(smsAlerts.incidentId, incidentId))
      .orderBy(desc(smsAlerts.sentAt));
    return result;
  }

  async updateSmsAlertStatus(id: string, status: string): Promise<void> {
    await db
      .update(smsAlerts)
      .set({ status })
      .where(eq(smsAlerts.id, id));
  }

  // Butterfly AI operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profileData: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(profileData)
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          ...profileData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return profile;
  }

  async getAlertPreferences(userId: string): Promise<AlertPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(alertPreferences)
      .where(eq(alertPreferences.userId, userId));
    return preferences;
  }

  async upsertAlertPreferences(preferencesData: InsertAlertPreferences): Promise<AlertPreferences> {
    const [preferences] = await db
      .insert(alertPreferences)
      .values(preferencesData)
      .onConflictDoUpdate({
        target: alertPreferences.userId,
        set: {
          ...preferencesData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return preferences;
  }

  async createPredictionScore(scoreData: InsertPredictionScore): Promise<PredictionScore> {
    const [score] = await db.insert(predictionScores).values(scoreData).returning();
    return score;
  }

  async getPredictionScoresByUserId(userId: string): Promise<PredictionScore[]> {
    const result = await db
      .select()
      .from(predictionScores)
      .where(eq(predictionScores.userId, userId))
      .orderBy(desc(predictionScores.createdAt));
    return result;
  }

  async getPredictionScore(userId: string, incidentId: string): Promise<PredictionScore | undefined> {
    const [score] = await db
      .select()
      .from(predictionScores)
      .where(
        and(
          eq(predictionScores.userId, userId),
          eq(predictionScores.incidentId, incidentId)
        )
      );
    return score;
  }
}

export const storage = new DatabaseStorage();

// Initialize sample data on startup
storage.initializeSampleData().catch(console.error);
