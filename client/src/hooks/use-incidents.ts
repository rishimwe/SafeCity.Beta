import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Incident, InsertIncident, Comment, InsertComment } from "@shared/schema";
import type { IncidentFilters } from "@/lib/types";

export function useIncidents(filters: IncidentFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters.types.length > 0) {
    queryParams.set('types', filters.types.join(','));
  }
  if (filters.timeFilter) {
    queryParams.set('timeFilter', filters.timeFilter);
  }
  if (filters.severity.length > 0) {
    queryParams.set('severity', filters.severity.join(','));
  }
  if (filters.searchQuery) {
    queryParams.set('searchQuery', filters.searchQuery);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/incidents?${queryString}` : '/api/incidents';

  return useQuery<Incident[]>({
    queryKey: [url],
  });
}

export function useIncident(id: string) {
  return useQuery<Incident>({
    queryKey: ['/api/incidents', id],
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (incident: InsertIncident) => {
      const response = await apiRequest('POST', '/api/incidents', incident);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
    },
  });
}

export function useIncidentComments(incidentId: string) {
  return useQuery<Comment[]>({
    queryKey: ['/api/incidents', incidentId, 'comments'],
    enabled: !!incidentId,
  });
}

export function useCreateComment(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: Omit<InsertComment, 'incidentId'>) => {
      const response = await apiRequest('POST', `/api/incidents/${incidentId}/comments`, comment);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents', incidentId, 'comments'] });
    },
  });
}

export function useIncidentRating(incidentId: string) {
  return useQuery<{ average: number; count: number }>({
    queryKey: ['/api/incidents', incidentId, 'ratings'],
    enabled: !!incidentId,
  });
}

export function useCreateRating(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating: { rating: number }) => {
      const response = await apiRequest('POST', `/api/incidents/${incidentId}/ratings`, rating);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents', incidentId, 'ratings'] });
    },
  });
}
