import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, getTranslation } from '@/data/translations';

export type { Language } from '@/data/translations';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'klinup_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'English';
  });

  // Persist language preference
  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const setCurrentLanguage = useCallback((lang: Language) => {
    setCurrentLanguageState(lang);
  }, []);

  const translate = useCallback((text: string): string => {
    if (!text?.trim()) return text;
    return getTranslation(text, currentLanguage);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      translate
    }}>
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
