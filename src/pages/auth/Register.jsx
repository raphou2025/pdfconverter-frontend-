import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import { getAuthErrorMessage } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
import { useNotification } from '../../context/NotificationContext';

export default function Register() {
  const { t, i18n } = useTranslation();
  const notify = useNotification();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await register(formData.name, formData.email, formData.password);
      notify(i18n.t('auth.registrationSuccess'), 'success');
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      notify(getAuthErrorMessage(err, t('auth.registrationFailed'), t), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <LanguageSwitcher className="absolute right-5 top-5 sm:right-8 sm:top-8" />
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl shadow-black/30 sm:p-9">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">A</span>
          AI<span className="-ml-2 text-blue-400">Convert</span>
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{t('auth.createYourAccount')}</h1>
        <p className="mt-2 text-sm text-slate-400">{t('auth.registerDescription')}</p>
        <label htmlFor="register-name" className="mb-2 mt-6 block text-sm font-medium text-slate-300">{t('auth.fullName')}</label>
        <input
          id="register-name"
          type="text"
          name="name"
          autoComplete="name"
          placeholder={t('auth.yourName')}
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
          required
        />
        <label htmlFor="register-email" className="mb-2 mt-5 block text-sm font-medium text-slate-300">{t('auth.email')}</label>
        <input
          id="register-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
          required
        />
        <label htmlFor="register-password" className="mb-2 mt-5 block text-sm font-medium text-slate-300">{t('auth.password')}</label>
        <PasswordInput
          id="register-password"
          name="password"
          placeholder={t('auth.password')}
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword((visible) => !visible)}
          autoComplete="new-password"
        />

        <Button type="submit" isLoading={loading} className="mt-6 w-full">{loading ? t('auth.creatingAccount') : t('auth.createAccount')}</Button>

        <p className="mt-6 text-center text-sm text-slate-400">
          {t('auth.alreadyHaveAccount')} <Link to="/login" className="font-medium text-blue-300 hover:text-blue-200">{t('auth.signIn')}</Link>
        </p>
      </form>
    </div>
  );
}