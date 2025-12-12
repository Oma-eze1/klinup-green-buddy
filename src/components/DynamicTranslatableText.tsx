import React from 'react';
import { useDynamicTranslation } from '@/hooks/useDynamicTranslation';
import { cn } from '@/lib/utils';

interface DynamicTranslatableTextProps {
  children: string;
  className?: string;
  showLoadingIndicator?: boolean;
}

const DynamicTranslatableText: React.FC<DynamicTranslatableTextProps> = ({
  children,
  className,
  showLoadingIndicator = false
}) => {
  const { translatedText, isLoading } = useDynamicTranslation(children);

  if (showLoadingIndicator && isLoading) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {translatedText}
        <span className="inline-block w-1 h-1 bg-primary/50 rounded-full animate-pulse" />
      </span>
    );
  }

  return <span className={className}>{translatedText}</span>;
};

export default DynamicTranslatableText;
