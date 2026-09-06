import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../context/i18n/types';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'auth' | 'mobile' | 'pill';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'navbar', className = '' }) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Auth Card or Segmented variant (easy 1-click switcher for Login/Register)
  if (variant === 'auth') {
    return (
      <div className={`flex items-center justify-center gap-1.5 p-1 bg-pink-50/80 rounded-xl border border-pink-100 ${className}`}>
        {availableLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-pink-700 shadow-xs border border-pink-200/60 scale-[1.02]'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-white/60'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Mobile Drawer variant
  if (variant === 'mobile') {
    return (
      <div className={`space-y-1 py-2 ${className}`}>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
          Select Language / ቋንቋ
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {availableLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <span className="text-base mb-0.5">{lang.flag}</span>
                <span className="truncate w-full text-center">{lang.nativeLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default Navbar Dropdown
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200/70 transition-all cursor-pointer hover:shadow-xs focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium text-gray-800">{currentLang.nativeLabel}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl border border-pink-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {availableLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-pink-50 text-pink-700 font-bold'
                    : 'text-gray-700 hover:bg-pink-50/50 hover:text-pink-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.nativeLabel}</span>
                </div>
                {isSelected && (
                  <span className="text-pink-600 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
