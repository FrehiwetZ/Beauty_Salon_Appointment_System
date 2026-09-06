export interface SystemStats {
  totalUsers: number;
  totalStaff: number;
  totalAppointments: number;
  totalRevenue: number;
  activeSessions?: number;
  serverUptime?: string;
}

export const mockAdminStats: SystemStats = {
  totalUsers: 1245,
  totalStaff: 12,
  totalAppointments: 340,
  totalRevenue: 45200,
  activeSessions: 42,
  serverUptime: '99.9%',
};

