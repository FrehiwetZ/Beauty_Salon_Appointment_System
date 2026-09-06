export type Language = 'en' | 'am' | 'om';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'am',
    label: 'Amharic',
    nativeLabel: 'አማርኛ',
    flag: '🇪🇹',
  },
  {
    code: 'om',
    label: 'Afaan Oromoo',
    nativeLabel: 'Afaan Oromoo',
    flag: '🌳',
  },
];
