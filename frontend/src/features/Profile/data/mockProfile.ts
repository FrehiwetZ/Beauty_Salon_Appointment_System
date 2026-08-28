import { UserProfile } from '../types/profile';

export const mockProfile: UserProfile = {
  id: 'usr-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Beauty Lane, Glamour City, GC 12345',
  preferences: {
    newsletter: true,
    smsAlerts: false,
  },
};
