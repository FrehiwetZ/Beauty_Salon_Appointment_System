import { DashboardStats, Activity } from '../types/dashboard';

export const mockDashboardStats: DashboardStats = {
  totalAppointments: 142,
  upcomingAppointments: 5,
  completedServices: 120,
  activeIntegrations: 3,
};

export const mockRecentActivity: Activity[] = [
  {
    id: 'act-1',
    description: 'New appointment booked with Sarah.',
    date: '2026-08-13T10:00:00Z',
    type: 'appointment',
  },
  {
    id: 'act-2',
    description: 'Service Haircut completed.',
    date: '2026-08-12T14:30:00Z',
    type: 'service',
  },
  {
    id: 'act-3',
    description: 'Google Calendar integration synced.',
    date: '2026-08-11T09:15:00Z',
    type: 'integration',
  },
  {
    id: 'act-4',
    description: 'System updated successfully.',
    date: '2026-08-10T23:00:00Z',
    type: 'system',
  },
];
