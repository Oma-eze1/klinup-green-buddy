import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslatableTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TranslatableText: React.FC<TranslatableTextProps> = ({ 
  children, 
  className,
  as: Component = 'span'
}) => {
  const { translate } = useLanguage();
  const translatedText = translate(children);

  return <Component className={className}>{translatedText}</Component>;
};

export default TranslatableText;
