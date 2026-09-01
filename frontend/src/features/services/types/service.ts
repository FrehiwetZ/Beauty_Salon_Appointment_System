export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: string | number;
  durationMinutes?: number;
  category?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}