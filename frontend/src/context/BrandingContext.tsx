import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export const DEFAULT_SALON_NAME = 'BEAUTY SALON';
export const DEFAULT_TAGLINE = '“Your Beauty, Your Time.”';

interface BrandingContextType {
  salonName: string;
  tagline: string;
  loading: boolean;
  updateBranding: (name: string, quote: string) => Promise<{ success: boolean; message?: string }>;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [salonName, setSalonName] = useState<string>(() => {
    return localStorage.getItem('salon_brand_name') || DEFAULT_SALON_NAME;
  });
  const [tagline, setTagline] = useState<string>(() => {
    return localStorage.getItem('salon_brand_tagline') || DEFAULT_TAGLINE;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize document title with current branding
  useEffect(() => {
    const title = `${salonName} | ${tagline}`;
    document.title = title;
  }, [salonName, tagline]);

  const refreshBranding = async () => {
    try {
      const res = await api.get('/site/settings');
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const fetchedName = data.salonName?.trim() || DEFAULT_SALON_NAME;
        const fetchedTagline = data.tagline?.trim() || DEFAULT_TAGLINE;

        setSalonName(fetchedName);
        setTagline(fetchedTagline);

        localStorage.setItem('salon_brand_name', fetchedName);
        localStorage.setItem('salon_brand_tagline', fetchedTagline);
      }
    } catch (err) {
      console.error('Failed to load branding settings, using defaults/cached values', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBranding();
  }, []);

  const updateBranding = async (newName: string, newTagline: string) => {
    const sanitizedName = newName.trim() || DEFAULT_SALON_NAME;
    const sanitizedTagline = newTagline.trim() || DEFAULT_TAGLINE;

    try {
      const res = await api.patch('/site/settings', {
        salonName: sanitizedName,
        tagline: sanitizedTagline
      });

      if (res.data?.success) {
        const updated = res.data.data;
        const finalName = updated.salonName?.trim() || sanitizedName;
        const finalTagline = updated.tagline?.trim() || sanitizedTagline;

        setSalonName(finalName);
        setTagline(finalTagline);

        localStorage.setItem('salon_brand_name', finalName);
        localStorage.setItem('salon_brand_tagline', finalTagline);

        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Failed to update branding.' };
    } catch (err: any) {
      console.error('Error saving branding settings:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'An error occurred while saving branding settings.'
      };
    }
  };

  return (
    <BrandingContext.Provider
      value={{
        salonName,
        tagline,
        loading,
        updateBranding,
        refreshBranding
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};
