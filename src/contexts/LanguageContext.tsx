import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'English' | 'Hausa' | 'Igbo' | 'Yoruba';

interface TranslationCache {
  [key: string]: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
  translationCache: TranslationCache;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CACHE_KEY = 'klinup_translations';
const LANGUAGE_KEY = 'klinup_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'English';
  });
  
  const [translationCache, setTranslationCache] = useState<TranslationCache>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  const [isTranslating, setIsTranslating] = useState(false);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  // Persist cache
  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
  }, [translationCache]);

  const setCurrentLanguage = useCallback((lang: Language) => {
    setCurrentLanguageState(lang);
  }, []);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text?.trim()) return text;
    if (currentLanguage === 'English') return text;

    const cacheKey = `${currentLanguage}:${text}`;
    
    // Check cache first
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    setIsTranslating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, targetLanguage: currentLanguage }
      });

      if (error) {
        console.error('Translation error:', error);
        return text;
      }

      const translatedText = data?.translatedText || text;
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));

      return translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, translationCache]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      translate,
      isTranslating,
      translationCache
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
