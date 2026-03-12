import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, Direction } from "@/i18n/types";
import { translations } from "@/i18n/translations";

export type { Language, Direction };

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "hayy-language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(storageKey);
    return (stored as Language) || defaultLanguage;
  });

  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("dir", direction);
    root.setAttribute("lang", language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(storageKey, lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
