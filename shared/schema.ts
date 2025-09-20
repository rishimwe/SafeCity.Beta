import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, index, doublePrecision, boolean, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Legacy columns - will be migrated to user_profiles and alert_preferences
  reputation: integer("reputation"),
  followers: integer("followers"),
  posts: integer("posts"),
  phoneNumber: integer("phone_number"), // Integer type to match existing DB
  realTimeLocationLat: text("real_time_location_lat"),
  realTimeLocationLong: varchar("real_time_loaction_long"), // Keep varchar type and original typo to match DB
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'theft', 'danger', 'harassment', 'other'
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  severity: text("severity").notNull(), // 'low', 'medium', 'high'
  date: text("date").notNull(),
  time: text("time").notNull(),
  zoneType: varchar("zone_type").default("residential"), // 'touristic', 'residential', 'business', 'suburbs', 'nightlife'
  isAnonymous: integer("is_anonymous").notNull().default(0), // 0 = false, 1 = true
  reportedBy: varchar("reported_by"),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentId: varchar("incident_id").notNull().references(() => incidents.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentId: varchar("incident_id").notNull().references(() => incidents.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  userId: varchar("user_id"),
});

// SMS Alerts table
export const smsAlerts = pgTable("sms_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentId: varchar("incident_id").references(() => incidents.id).notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  message: text("message").notNull(),
  messageType: varchar("message_type").notNull(), // 'thief_spotted', 'object_found'
  sentAt: timestamp("sent_at").defaultNow(),
  status: varchar("status").default("pending"), // 'pending', 'sent', 'failed'
}, (table) => [index("sms_alerts_incident_id_idx").on(table.incidentId)]);

// User profiles for Butterfly AI predictions
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userType: varchar("user_type").notNull(), // 'Local', 'Expat', 'Tourist'
  engagementRate: doublePrecision("engagement_rate").default(0.5),
  numFriends: integer("num_friends").default(0),
  connections: integer("connections").default(0),
  homeLatitude: doublePrecision("home_latitude"),
  homeLongitude: doublePrecision("home_longitude"),
  preferredRadius: integer("preferred_radius").default(5), // in km
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [unique().on(table.userId), index("user_profiles_user_id_idx").on(table.userId)]);

// Alert preferences for intelligent notifications
export const alertPreferences = pgTable("alert_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phoneNumber: varchar("phone_number"),
  enableSmartAlerts: boolean("enable_smart_alerts").default(true),
  minConfidenceThreshold: doublePrecision("min_confidence_threshold").default(0.7),
  incidentTypes: text("incident_types").array().default(sql`'{"theft","danger","harassment"}'`), // Array of incident types to monitor
  maxDistance: integer("max_distance").default(10), // Maximum distance in km
  quietHoursStart: integer("quiet_hours_start").default(23), // 23:00
  quietHoursEnd: integer("quiet_hours_end").default(7), // 07:00
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [unique().on(table.userId), index("alert_preferences_user_id_idx").on(table.userId)]);

// Store prediction scores for incidents
export const predictionScores = pgTable("prediction_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  incidentId: varchar("incident_id").notNull().references(() => incidents.id, { onDelete: "cascade" }),
  rawProbability: doublePrecision("raw_probability").notNull(),
  decision: varchar("decision").notNull(), // 'Utile' or 'Inutile'
  confidenceScore: doublePrecision("confidence_score").notNull(),
  distanceKm: doublePrecision("distance_km").notNull(),
  daysSinceIncident: integer("days_since_incident").notNull(),
  hourOfDay: integer("hour_of_day").notNull(),
  urgencyScore: doublePrecision("urgency_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [index("prediction_scores_user_id_idx").on(table.userId), index("prediction_scores_incident_id_idx").on(table.incidentId)]);

// Insert schemas
export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
});

export const insertSmsAlertSchema = createInsertSchema(smsAlerts).omit({
  id: true,
  sentAt: true,
  status: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertPreferencesSchema = createInsertSchema(alertPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPredictionScoreSchema = createInsertSchema(predictionScores).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

export type SmsAlert = typeof smsAlerts.$inferSelect;
export type InsertSmsAlert = z.infer<typeof insertSmsAlertSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type AlertPreferences = typeof alertPreferences.$inferSelect;
export type InsertAlertPreferences = z.infer<typeof insertAlertPreferencesSchema>;

export type PredictionScore = typeof predictionScores.$inferSelect;
export type InsertPredictionScore = z.infer<typeof insertPredictionScoreSchema>;

// Relations - defined at the end
export const incidentsRelations = relations(incidents, ({ many }) => ({
  comments: many(comments),
  ratings: many(ratings),
  smsAlerts: many(smsAlerts),
  predictionScores: many(predictionScores),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  incident: one(incidents, {
    fields: [comments.incidentId],
    references: [incidents.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  incident: one(incidents, {
    fields: [ratings.incidentId],
    references: [incidents.id],
  }),
}));

export const smsAlertsRelations = relations(smsAlerts, ({ one }) => ({
  incident: one(incidents, {
    fields: [smsAlerts.incidentId],
    references: [incidents.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const alertPreferencesRelations = relations(alertPreferences, ({ one }) => ({
  user: one(users, {
    fields: [alertPreferences.userId],
    references: [users.id],
  }),
}));

export const predictionScoresRelations = relations(predictionScores, ({ one }) => ({
  user: one(users, {
    fields: [predictionScores.userId],
    references: [users.id],
  }),
  incident: one(incidents, {
    fields: [predictionScores.incidentId],
    references: [incidents.id],
  }),
}));