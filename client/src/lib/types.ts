export interface IncidentFilters {
  types: string[];
  timeFilter: string;
  severity: string[];
  searchQuery: string;
}

export interface IncidentTypeConfig {
  key: string;
  label: string;
  color: string;
  icon: string;
}

export const INCIDENT_TYPES: IncidentTypeConfig[] = [
  { key: 'theft', label: 'Vol', color: 'hsl(4, 90%, 58%)', icon: 'fas fa-mask' },
  { key: 'danger', label: 'Lieu dangereux', color: 'hsl(36, 100%, 50%)', icon: 'fas fa-exclamation-triangle' },
  { key: 'harassment', label: 'Harcèlement', color: 'hsl(291, 64%, 42%)', icon: 'fas fa-user-times' },
  { key: 'other', label: 'Autre', color: 'hsl(0, 0%, 46%)', icon: 'fas fa-ellipsis-h' },
];

export const SEVERITY_LEVELS = [
  { key: 'low', label: 'Faible', color: 'hsl(122, 39%, 49%)' },
  { key: 'medium', label: 'Modéré', color: 'hsl(36, 100%, 50%)' },
  { key: 'high', label: 'Élevé', color: 'hsl(4, 90%, 58%)' },
];

export const TIME_FILTERS = [
  { key: '24h', label: 'Dernières 24h' },
  { key: 'week', label: 'Cette semaine' },
  { key: 'month', label: 'Ce mois' },
  { key: 'all', label: 'Tout' },
];
