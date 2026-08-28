export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedServices: number;
  activeIntegrations: number;
}

export interface Activity {
  id: string;
  description: string;
  date: string;
  type: 'appointment' | 'service' | 'integration' | 'system';
}
