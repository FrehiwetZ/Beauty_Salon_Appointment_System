export interface NewsAuthor {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  titleAm?: string | null;
  titleOm?: string | null;
  content: string;
  contentAm?: string | null;
  contentOm?: string | null;

  date?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  imageUrl?: string | null;
  status?: string;
  authorId?: string;
  author?: NewsAuthor | null;
}

