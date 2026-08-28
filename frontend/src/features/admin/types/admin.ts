export interface SystemStats {
  totalUsers: number;
  totalRevenue: number;
  activeSessions: number;
  serverUptime: string;
}

export const mockAdminStats: SystemStats = {
  totalUsers: 1245,
  totalRevenue: 45200,
  activeSessions: 42,
  serverUptime: '99.9%',
};
