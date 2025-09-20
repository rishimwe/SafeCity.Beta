import type { Incident } from "@shared/schema";

export interface RiskArea {
  latitude: number;
  longitude: number;
  radius: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentCount: number;
  severityScore: number;
}

// Calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get severity score for an incident
function getSeverityScore(severity: string): number {
  switch (severity) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 1;
  }
}

// Cluster nearby incidents and calculate risk areas
export function calculateRiskAreas(incidents: Incident[], clusterRadius = 0.3): RiskArea[] {
  if (!incidents.length) return [];

  const clusters: { incidents: Incident[]; center: { lat: number; lon: number } }[] = [];
  const processed = new Set<string>();

  incidents.forEach(incident => {
    if (processed.has(incident.id)) return;

    const incidentLat = parseFloat(incident.latitude);
    const incidentLon = parseFloat(incident.longitude);
    
    // Find nearby incidents within cluster radius
    const nearbyIncidents = incidents.filter(other => {
      if (processed.has(other.id) || other.id === incident.id) return false;
      
      const otherLat = parseFloat(other.latitude);
      const otherLon = parseFloat(other.longitude);
      const distance = calculateDistance(incidentLat, incidentLon, otherLat, otherLon);
      
      return distance <= clusterRadius;
    });

    // Add current incident and nearby incidents to cluster
    const clusterIncidents = [incident, ...nearbyIncidents];
    
    // Mark all incidents in this cluster as processed
    clusterIncidents.forEach(inc => processed.add(inc.id));

    // Calculate cluster center
    const centerLat = clusterIncidents.reduce((sum, inc) => sum + parseFloat(inc.latitude), 0) / clusterIncidents.length;
    const centerLon = clusterIncidents.reduce((sum, inc) => sum + parseFloat(inc.longitude), 0) / clusterIncidents.length;

    clusters.push({
      incidents: clusterIncidents,
      center: { lat: centerLat, lon: centerLon }
    });
  });

  // Convert clusters to risk areas
  return clusters.map(cluster => {
    const incidentCount = cluster.incidents.length;
    const totalSeverityScore = cluster.incidents.reduce((sum, inc) => sum + getSeverityScore(inc.severity), 0);
    const averageSeverityScore = totalSeverityScore / incidentCount;

    // Calculate risk level based on incident count and severity
    let riskLevel: RiskArea['riskLevel'];
    let radius: number;

    if (incidentCount >= 5 || averageSeverityScore >= 2.5) {
      riskLevel = 'critical';
      radius = 150; // meters
    } else if (incidentCount >= 3 || averageSeverityScore >= 2) {
      riskLevel = 'high';
      radius = 100;
    } else if (incidentCount >= 2 || averageSeverityScore >= 1.5) {
      riskLevel = 'medium';
      radius = 75;
    } else {
      riskLevel = 'low';
      radius = 50;
    }

    return {
      latitude: cluster.center.lat,
      longitude: cluster.center.lon,
      radius,
      riskLevel,
      incidentCount,
      severityScore: averageSeverityScore,
    };
  });
}

// Get color for risk level
export function getRiskColor(riskLevel: RiskArea['riskLevel']): string {
  switch (riskLevel) {
    case 'critical': return '#dc2626'; // red-600
    case 'high': return '#ea580c'; // orange-600
    case 'medium': return '#ca8a04'; // yellow-600
    case 'low': return '#16a34a'; // green-600
    default: return '#6b7280'; // gray-500
  }
}

// Get opacity for risk level
export function getRiskOpacity(riskLevel: RiskArea['riskLevel']): number {
  switch (riskLevel) {
    case 'critical': return 0.4;
    case 'high': return 0.3;
    case 'medium': return 0.25;
    case 'low': return 0.2;
    default: return 0.1;
  }
}