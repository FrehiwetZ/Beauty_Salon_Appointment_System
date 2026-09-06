import { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageOption, SUPPORTED_LANGUAGES } from './i18n/types';
import { translations } from './i18n/translations';
import {
  localizeService as rawLocalizeService,
  localizeStaff as rawLocalizeStaff,
  localizePost as rawLocalizePost,
  localizeCategory as rawLocalizeCategory,
  matchServiceCategory,
} from './i18n/localize';
import { Service } from '../features/services/types/service';
import { Staff } from '../features/staff/types/staff';
import { NewsPost } from '../features/News/types/news';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageOption[];
  localizeService: (service: Service | null | undefined) => { name: string; description: string; category: string };
  localizeStaff: (staff: Staff | null | undefined) => { position: string; bio: string; specialty: string };
  localizePost: (post: NewsPost | null | undefined) => { title: string; content: string };
  localizeCategory: (category: string) => string;
  matchServiceCategory: (category: string | null | undefined, selectedCategory: string, serviceName?: string) => boolean;
}

const STORAGE_KEY = 'salon_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
        return saved as Language;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for language preference', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to save language preference to localStorage', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, defaultText?: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let translation = langDict[key] || translations.en[key] || defaultText || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal));
      });
    }

    return translation;
  };

  const localizeService = (service: Service | null | undefined) => rawLocalizeService(service, language);
  const localizeStaff = (staff: Staff | null | undefined) => rawLocalizeStaff(staff, language);
  const localizePost = (post: NewsPost | null | undefined) => rawLocalizePost(post, language);
  const localizeCategory = (category: string) => rawLocalizeCategory(category, language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: SUPPORTED_LANGUAGES,
        localizeService,
        localizeStaff,
        localizePost,
        localizeCategory,
        matchServiceCategory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
