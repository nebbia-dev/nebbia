import { useEffect } from 'react';

export type Language = 'it' | 'en';

export const DEFAULT_LANGUAGE: Language = 'it';

export function homePath(language: Language) {
  return language === 'en' ? '/en' : '/';
}

export function workPath(language: Language, slug: string) {
  return `${language === 'en' ? '/en' : ''}/works/${slug}`;
}

export function careersPath(language: Language) {
  return language === 'en' ? '/en/apply-now' : '/candidati-ora';
}

export function useDocumentLanguage(language: Language) {
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [language]);
}
