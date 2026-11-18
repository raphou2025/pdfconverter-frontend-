// import { useTranslation } from 'react-i18next';
// import { useContext, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { userService } from '../../services/userService';
// import { useNotification } from '../../context/NotificationContext';
// import { ThemeContext } from '../../context/ThemeContext';

// export default function LanguageSwitcher({ className = '' }) {
//   const { t, i18n } = useTranslation();
//   const { user, updateUser } = useAuth();
//   const notify = useNotification();
//   const { theme } = useContext(ThemeContext);
//   const [isSaving, setIsSaving] = useState(false);
//   const currentLanguage = i18n.resolvedLanguage || i18n.language;
//   const activeColor = theme === 'light' ? 'text-blue-700' : 'text-blue-300';
//   const inactiveColor = theme === 'light' ? 'text-slate-600' : 'text-slate-400';

//   const changeLanguage = async (language) => {
//     if (language === currentLanguage || isSaving) return;
//     try {
//       await i18n.changeLanguage(language);
//       if (!user) {
//         notify(i18n.t('language.changed'), 'success');
//         return;
//       }

//       setIsSaving(true);
//       const updatedUser = await userService.updatePreferredLanguage(language);
//       updateUser(updatedUser);
//       notify(i18n.t('settings.languageSaved'), 'success');
//     } catch (error) {
//       console.error('Failed to change or save language preference:', error);
//       notify(i18n.t('settings.languageSaveFailed'), 'error');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className={className}>
//       <div className="flex items-center gap-2 text-xs">
//         <button
//           type="button"
//           disabled={isSaving}
//           onClick={() => changeLanguage('en')}
//           aria-label={t('language.switchToEnglish')}
//           aria-pressed={currentLanguage === 'en'}
//           className={`transition hover:text-blue-600 disabled:cursor-wait disabled:opacity-60 ${currentLanguage === 'en' ? `font-semibold ${activeColor}` : inactiveColor}`}
//         >
//           EN
//         </button>
//         <span className={theme === 'light' ? 'text-slate-400' : 'text-slate-700'}>/</span>
//         <button
//           type="button"
//           disabled={isSaving}
//           onClick={() => changeLanguage('km')}
//           aria-label={t('language.switchToKhmer')}
//           aria-pressed={currentLanguage === 'km'}
//           className={`transition hover:text-blue-600 disabled:cursor-wait disabled:opacity-60 ${currentLanguage === 'km' ? `font-semibold ${activeColor}` : inactiveColor}`}
//         >
//           KH
//         </button>
//       </div>
//     </div>
//   );
// }

import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import { ThemeContext } from '../../context/ThemeContext';

// 🚨 Import the images
import usFlag from '../../assets/images/flag/Flag_of_the_United_States.png'; // Make sure the file extension matches!
import khmerFlag from '../../assets/images/flag/Flag_of_Cambodia.svg.webp'; // Make sure the file extension matches!

export default function LanguageSwitcher({ className = '' }) {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const notify = useNotification();
  const { theme } = useContext(ThemeContext);
  const [isSaving, setIsSaving] = useState(false);
  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const changeLanguage = async (language) => {
    if (language === currentLanguage || isSaving) return;
    try {
      await i18n.changeLanguage(language);
      if (!user) {
        notify(i18n.t('language.changed'), 'success');
        return;
      }

      setIsSaving(true);
      const updatedUser = await userService.updatePreferredLanguage(language);
      updateUser(updatedUser);
      notify(i18n.t('settings.languageSaved'), 'success');
    } catch (error) {
      console.error('Failed to change or save language preference:', error);
      notify(i18n.t('settings.languageSaveFailed'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {/* 🚨 English Button (Using Image) */}
        <button
          type="button"
          disabled={isSaving}
          onClick={() => changeLanguage('en')}
          aria-label={t('language.switchToEnglish')}
          aria-pressed={currentLanguage === 'en'}
          title="English"
          className={`flex items-center justify-center rounded-md p-1 transition-all disabled:cursor-wait disabled:opacity-60 ${
            currentLanguage === 'en' 
              ? 'ring-2 ring-blue-500 bg-slate-800/50' 
              : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
          }`}
        >
          <img 
            src={usFlag} 
            alt="English" 
            className="h-5 w-7 rounded-sm object-cover shadow-sm"
          />
        </button>

        <span className={theme === 'light' ? 'text-slate-400' : 'text-slate-700'}>/</span>

        {/* 🚨 Khmer Button (Using Image) */}
        <button
          type="button"
          disabled={isSaving}
          onClick={() => changeLanguage('km')}
          aria-label={t('language.switchToKhmer')}
          aria-pressed={currentLanguage === 'km'}
          title="ភាសាខ្មែរ (Khmer)"
          className={`flex items-center justify-center rounded-md p-1 transition-all disabled:cursor-wait disabled:opacity-60 ${
            currentLanguage === 'km' 
              ? 'ring-2 ring-blue-500 bg-slate-800/50' 
              : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
          }`}
        >
          <img 
            src={khmerFlag} 
            alt="Khmer" 
            className="h-5 w-7 rounded-sm object-cover shadow-sm"
          />
        </button>
      </div>
    </div>
  );
}