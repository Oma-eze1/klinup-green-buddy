import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatableTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  showLoading?: boolean;
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({
  children,
  className = '',
  as: Component = 'span',
  showLoading = true,
}) => {
  const { translate, currentLanguage, translationCache } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  const cacheKey = `${currentLanguage}:${children}`;

  useEffect(() => {
    const doTranslate = async () => {
      if (currentLanguage === 'English') {
        setTranslatedText(children);
        return;
      }

      // Check cache first
      if (translationCache[cacheKey]) {
        setTranslatedText(translationCache[cacheKey]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translate(children);
        setTranslatedText(result);
      } catch {
        setTranslatedText(children);
      } finally {
        setIsLoading(false);
      }
    };

    doTranslate();
  }, [children, currentLanguage, translate, translationCache, cacheKey]);

  if (isLoading && showLoading) {
    return <Skeleton className={`inline-block h-4 w-20 ${className}`} />;
  }

  return React.createElement(Component, { className }, translatedText);
};
