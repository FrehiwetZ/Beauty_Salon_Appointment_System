export interface Staff {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  averageRating?: number;

  // Backward compatibility with mock/legacy data
  name?: string;
  position?: string;
  specialty?: string;
  experience?: string;
  category?: string;
  image?: string | null;
  imageUrl?: string | null;

  user?: {
    id?: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };

  staffProfile?: {
    id: string;
    userId: string;
    bio?: string | null;
    position?: string | null;
    imageUrl?: string | null;
    isActive?: boolean;
    services?: Array<{
      staffId: string;
      serviceId: string;
      service?: {
        id: string;
        name: string;
        price: number;
        durationMinutes: number;
      };
    }>;
    ratings?: any[];
  };
  services?: Array<{
    serviceId: string;
  }>;
}