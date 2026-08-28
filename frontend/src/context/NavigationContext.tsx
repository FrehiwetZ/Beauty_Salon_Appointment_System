import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  page: string;
  setPage: (page: string) => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (page: string | null) => void;
  selectedServiceId: number | string | null;
  setSelectedServiceId: (id: number | string | null) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  page: 'dashboard',
  setPage: () => {},
  redirectAfterLogin: null,
  setRedirectAfterLogin: () => {},
  selectedServiceId: null,
  setSelectedServiceId: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState('dashboard');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | string | null>(null);
  
  return (
    <NavigationContext.Provider value={{ page, setPage, redirectAfterLogin, setRedirectAfterLogin, selectedServiceId, setSelectedServiceId }}>
      {children}
    </NavigationContext.Provider>
  );
};
