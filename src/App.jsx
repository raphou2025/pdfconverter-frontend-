import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Overview from './pages/dashboard/Overview';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';
import Translator from './pages/dashboard/Translator';
import AdminOverview from './pages/dashboard/AdminOverview';
import AdminMonitor from './pages/dashboard/AdminMonitor';

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        {t('common.loading')}
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const { user } = useContext(AuthContext);
  return user?.role === 'ADMIN'
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
}

function DashboardLayout() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <header className="border-b border-slate-800/80 bg-slate-950/70 px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{t('app.workspace')}</p>
              <p className="mt-1 text-sm text-slate-300">{t('app.tagline')}</p>
            </div>
            <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400 sm:inline-flex">
              {new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium' }).format(new Date())}
            </span>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="translator" element={<Translator />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="monitoring" element={<AdminMonitor />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}