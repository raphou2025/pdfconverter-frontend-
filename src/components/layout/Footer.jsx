import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  return (
    <footer className={`border-t px-6 py-8 text-center text-sm ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-900'}`}>
      <p className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      <p className={`mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t('footer.builtWith')}</p>
    </footer>
  );
}