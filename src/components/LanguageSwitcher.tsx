import React from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Hausa', label: 'Hausa', flag: '🇳🇬' },
  { code: 'Igbo', label: 'Igbo', flag: '🇳🇬' },
  { code: 'Yoruba', label: 'Yoruba', flag: '🇳🇬' },
];

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-foreground/80 hover:text-foreground hover:bg-primary/10"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setCurrentLanguage(lang.code)}
            className={`cursor-pointer gap-2 ${
              currentLanguage === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
