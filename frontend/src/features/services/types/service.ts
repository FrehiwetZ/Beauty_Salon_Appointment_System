export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: string | number;
  durationMinutes?: number;
  category?: string | null;
  nameAm?: string | null;
  nameOm?: string | null;
  descriptionAm?: string | null;
  descriptionOm?: string | null;
  categoryAm?: string | null;
  categoryOm?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;

}