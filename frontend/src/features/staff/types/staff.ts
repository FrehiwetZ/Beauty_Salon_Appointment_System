export interface Staff {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  averageRating?: number;
  deactivationReason?: string | null;
  deactivatedUntil?: string | null;

  // Backward compatibility with mock/legacy data
  name?: string;
  position?: string;
  positionAm?: string | null;
  positionOm?: string | null;
  specialty?: string;
  specialtyAm?: string | null;
  specialtyOm?: string | null;
  bio?: string | null;
  bioAm?: string | null;
  bioOm?: string | null;
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
    bioAm?: string | null;
    bioOm?: string | null;
    position?: string | null;
    positionAm?: string | null;
    positionOm?: string | null;
    imageUrl?: string | null;
    isActive?: boolean;
    deactivationReason?: string | null;
    deactivatedUntil?: string | null;
    services?: Array<{
      staffId: string;
      serviceId: string;
      service?: {
        id: string;
        name: string;
        nameAm?: string | null;
        nameOm?: string | null;
        description?: string | null;
        descriptionAm?: string | null;
        descriptionOm?: string | null;
        category?: string | null;
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