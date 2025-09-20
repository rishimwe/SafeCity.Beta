import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertSmsAlert } from "@shared/schema";

export function useSendSmsAlert(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertData: Omit<InsertSmsAlert, 'incidentId'> & { contactInfo?: string }) => {
      const response = await apiRequest('POST', `/api/incidents/${incidentId}/sms-alerts`, alertData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents', incidentId, 'sms-alerts'] });
    },
  });
}