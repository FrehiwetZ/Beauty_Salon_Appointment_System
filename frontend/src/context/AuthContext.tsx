import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthUser } from '../features/Authentication/types/auth';
import { useNavigation } from './NavigationContext';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { setPage } = useNavigation();

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser({
              id: response.data.id,
              email: response.data.email,
              name: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
              role: response.data.role,
            });
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    hydrate();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setUser({
      id: userData.id,
      email: userData.email,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      role: userData.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPage('login');
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
