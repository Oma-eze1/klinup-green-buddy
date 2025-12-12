import { useState, useEffect, useCallback } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { getTranslation } from '@/data/translations';
import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'klinup_translation_cache';
const CACHE_EXPIRY_DAYS = 7;

interface CacheEntry {
  translation: string;
  timestamp: number;
}

interface TranslationCache {
  [key: string]: CacheEntry;
}

// Simple hash function for cache keys
const hashText = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const generateCacheKey = (text: string, language: Language): string => {
  return `${hashText(text)}_${language.toLowerCase()}`;
};

const getCache = (): TranslationCache => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const setCache = (cache: TranslationCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    console.warn('Failed to save translation cache');
  }
};

const getCachedTranslation = (key: string): string | null => {
  const cache = getCache();
  const entry = cache[key];
  
  if (!entry) return null;
  
  // Check if cache entry has expired
  const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - entry.timestamp > expiryTime) {
    // Remove expired entry
    delete cache[key];
    setCache(cache);
    return null;
  }
  
  return entry.translation;
};

const setCachedTranslation = (key: string, translation: string): void => {
  const cache = getCache();
  cache[key] = {
    translation,
    timestamp: Date.now()
  };
  setCache(cache);
};

export const useDynamicTranslation = (text: string) => {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(async () => {
    // If no text or empty, return as is
    if (!text?.trim()) {
      setTranslatedText(text);
      return;
    }

    // If English, return original
    if (currentLanguage === 'English') {
      setTranslatedText(text);
      return;
    }

    // Check static dictionary first (fast path)
    const staticTranslation = getTranslation(text, currentLanguage);
    if (staticTranslation !== text) {
      setTranslatedText(staticTranslation);
      return;
    }

    // Check localStorage cache
    const cacheKey = generateCacheKey(text, currentLanguage);
    const cachedTranslation = getCachedTranslation(cacheKey);
    if (cachedTranslation) {
      setTranslatedText(cachedTranslation);
      return;
    }

    // Call N-ATLaS edge function for translation
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('translate', {
        body: {
          text,
          targetLanguage: currentLanguage.toLowerCase()
        }
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.translatedText) {
        // Cache the successful translation
        setCachedTranslation(cacheKey, data.translatedText);
        setTranslatedText(data.translatedText);
      } else {
        // Fallback to original if no translation returned
        setTranslatedText(text);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || 'Translation failed');
      // Fallback to original text on error
      setTranslatedText(text);
    } finally {
      setIsLoading(false);
    }
  }, [text, currentLanguage]);

  useEffect(() => {
    translateText();
  }, [translateText]);

  return { translatedText, isLoading, error };
};

// Utility to clear translation cache
export const clearTranslationCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};
