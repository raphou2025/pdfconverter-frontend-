// import { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import Button from '../../components/ui/Button';
// import PasswordInput from '../../components/ui/PasswordInput';
// import { getAuthErrorMessage } from '../../services/authService';
// import { useTranslation } from 'react-i18next';
// import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
// import { useNotification } from '../../context/NotificationContext';

// export default function Login() {
//   const { t, i18n } = useTranslation();
//   const notify = useNotification();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const user = await login(email, password);
//       notify(i18n.t('auth.loginSuccess'), 'success');
//       navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
//     } catch (err) {
//       notify(getAuthErrorMessage(err, t('auth.loginFailed'), t), 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
//       <LanguageSwitcher className="absolute right-5 top-5 sm:right-8 sm:top-8" />
//       <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl shadow-black/30 sm:p-9">
//         <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
//           <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 font-bold text-white">A</span>
//           AI<span className="-ml-2 text-blue-400">Convert</span>
//         </Link>
//         <h1 className="text-3xl font-semibold tracking-tight text-white">{t('auth.welcomeBack')}</h1>
//         <p className="mt-2 text-sm text-slate-400">{t('auth.loginDescription')}</p>
//         <label htmlFor="login-email" className="mb-2 mt-6 block text-sm font-medium text-slate-300">{t('auth.email')}</label>
//         <input
//           id="login-email"
//           type="email"
//           autoComplete="email"
//           placeholder="you@example.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
//           required
//         />
//         <label htmlFor="login-password" className="mb-2 mt-5 block text-sm font-medium text-slate-300">{t('auth.password')}</label>
//         <PasswordInput
//           id="login-password"
//           placeholder={t('auth.password')}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           showPassword={showPassword}
//           onToggleVisibility={() => setShowPassword((visible) => !visible)}
//           autoComplete="current-password"
//         />

//         <Button type="submit" isLoading={loading} className="mt-6 w-full">{loading ? t('auth.signingIn') : t('auth.signIn')}</Button>

//         <p className="mt-6 text-center text-sm text-slate-400">
//           {t('auth.newHere')} <Link to="/register" className="font-medium text-blue-300 hover:text-blue-200">{t('auth.createAccount')}</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import { getAuthErrorMessage } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
import { useNotification } from '../../context/NotificationContext';

export default function Login() {
  const { t, i18n } = useTranslation();
  const notify = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🚨 FIXED: Clean inputs to prevent mobile keyboard whitespace/capitalization
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const user = await login(cleanEmail, cleanPassword);
      notify(i18n.t('auth.loginSuccess'), 'success');
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      notify(getAuthErrorMessage(err, t('auth.loginFailed'), t), 'error');
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
        <h1 className="text-3xl font-semibold tracking-tight text-white">{t('auth.welcomeBack')}</h1>
        <p className="mt-2 text-sm text-slate-400">{t('auth.loginDescription')}</p>
        
        <label htmlFor="login-email" className="mb-2 mt-6 block text-sm font-medium text-slate-300">{t('auth.email')}</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400"
          required
        />
        
        <label htmlFor="login-password" className="mb-2 mt-5 block text-sm font-medium text-slate-300">{t('auth.password')}</label>
        <PasswordInput
          id="login-password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          onToggleVisibility={() => setShowPassword((visible) => !visible)}
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={loading} className="mt-6 w-full">
          {loading ? t('auth.signingIn') : t('auth.signIn')}
        </Button>

        <p className="mt-6 text-center text-sm text-slate-400">
          {t('auth.newHere')} <Link to="/register" className="font-medium text-blue-300 hover:text-blue-200">{t('auth.createAccount')}</Link>
        </p>
      </form>
    </div>
  );
}