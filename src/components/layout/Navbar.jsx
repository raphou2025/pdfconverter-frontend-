import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 z-40 w-full border-b shadow-lg backdrop-blur-xl ${isLight ? 'border-white/70 bg-[#f8f6f0]/90 shadow-slate-900/5' : 'border-white/15 bg-slate-950/75 shadow-black/20'}`}>
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link to="/" className={`text-xl font-bold tracking-tight transition ${isLight ? 'text-slate-900 hover:text-blue-700' : 'text-white hover:text-blue-200'}`}>
          PDF<span className={isLight ? 'text-blue-600' : 'text-blue-400'}>Convertor</span>
        </Link>
        <div className={`flex items-center gap-4 text-sm sm:gap-6 ${isLight ? 'text-slate-700' : 'text-slate-100'}`}>
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="rounded-lg px-3 py-2 transition hover:bg-white/20 hover:text-blue-600 focus-visible:outline-blue-500">{t('nav.dashboard')}</Link>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-blue-600">{t('auth.signIn')}</Link>
              <Link to="/register" className={`rounded-lg px-4 py-2 font-semibold shadow-md transition ${isLight ? 'border border-blue-400/40 bg-blue-500 text-white shadow-blue-900/15 hover:bg-blue-600' : 'border border-blue-300/50 bg-blue-400 text-slate-950 shadow-blue-950/20 hover:bg-blue-300'}`}>
                {t('landing.startFree')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}