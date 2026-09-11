import type { Language } from '../language';

export function LanguageSwitch({
  language,
  italianHref,
  englishHref,
  className = '',
}: {
  language: Language;
  italianHref: string;
  englishHref: string;
  className?: string;
}) {
  return (
    <nav className={`flex items-center gap-1.5 text-[11px] uppercase ${className}`} aria-label={language === 'en' ? 'Language selection' : 'Selezione lingua'}>
      <a className={language === 'it' ? 'text-[#ff3700]' : 'opacity-45 transition hover:opacity-100'} href={italianHref} lang="it" aria-current={language === 'it' ? 'page' : undefined}>IT</a>
      <span className="opacity-30" aria-hidden="true">/</span>
      <a className={language === 'en' ? 'text-[#ff3700]' : 'opacity-45 transition hover:opacity-100'} href={englishHref} lang="en" aria-current={language === 'en' ? 'page' : undefined}>EN</a>
    </nav>
  );
}
