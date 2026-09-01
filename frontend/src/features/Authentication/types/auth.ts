export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN' | 'STAFF';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
