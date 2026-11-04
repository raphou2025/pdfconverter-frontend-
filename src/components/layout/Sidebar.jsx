import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useNotification } from '../../context/NotificationContext';

const linkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-400/20'
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
  }`;

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const notify = useNotification();

  const handleLogout = () => {
    logout();
    notify(t('auth.loggedOut'), 'info');
  };

  return (
    <aside className="z-20 flex w-full flex-col border-b border-slate-800 bg-slate-950/95 px-5 py-4 md:sticky md:top-0 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-4 md:py-7">
      <Link to="/dashboard" className="flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-950/40">
          P
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          PDF<span className="text-blue-400">Converter</span>
        </span>
      </Link>

      <p className="mb-2 mt-7 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:block">
        {t('nav.workspace')}
      </p>
      <nav aria-label={t('nav.mainNavigation')} className="mt-5 flex gap-1 overflow-x-auto md:mt-0 md:flex-1 md:flex-col">
        <NavLink to="/dashboard" end className={linkClass}>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/dashboard/translator" className={linkClass}>
          {t('nav.translator')}
        </NavLink>
        <NavLink to="/dashboard/history" className={linkClass}>
          {t('nav.history')}
        </NavLink>
        <NavLink to="/dashboard/settings" className={linkClass}>
          {t('nav.settings')}
        </NavLink>
        {user?.role === 'ADMIN' && (
          <>
            <p className="mb-2 mt-7 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:block">
              {t('nav.administration')}
            </p>
            <NavLink to="/admin" className={linkClass}>
              {t('nav.adminDashboard')}
            </NavLink>
            <NavLink to="/admin/monitoring" className={linkClass}>
              {t('nav.systemMonitoring')}
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-800 pt-4 md:mt-8 md:block">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">{user?.name || t('nav.yourAccount')}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 md:mt-4 md:justify-between">
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-slate-400 transition hover:text-rose-300"
          >
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </aside>
  );
}
