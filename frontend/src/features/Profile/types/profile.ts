export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  preferences: {
    newsletter: boolean;
    smsAlerts: boolean;
  };
}
