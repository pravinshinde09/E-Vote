import React, { createContext, useState, useContext } from 'react';
import * as Localization from 'expo-localization';
import en from '../localization/en.json';
import hi from '../localization/hi.json';
import mr from '../localization/mr.json';
import { Language } from '../types/languageType';

type Translations = {
  [key: string]: string;
};

const translationsMap: Record<Language, Translations> = {
  en,
  hi,
  mr,
 
};

export const languages = [
  { code: 'en' as const, name: 'English' },
  { code: 'mr' as const, name: 'Marathi' },
  { code: 'hi' as const, name: 'Hindi' },
];

interface LanguageContextType {
  locale: Language;
  translate: (key: string, lang?: Language) => string;
  setLocale: (locale: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLocalization = () => {
  const deviceLocale = Localization.getLocales()[0].languageCode as Language;
  const [locale, setLocaleState] = useState<Language>(deviceLocale);

  const translate = (key: string, lang?: Language): string => {
    const translations = translationsMap[lang || locale];
    return translations[key] || key;
  };

  const setLocale = (newLocale: Language) => {
    setLocaleState(newLocale);
  };

  return { locale, translate, setLocale };
};

export const LanguageContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale, translate, setLocale } = useLocalization();

  return (
    <LanguageContext.Provider value={{ locale, translate, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageContextProvider');
  }
  return context;
};
