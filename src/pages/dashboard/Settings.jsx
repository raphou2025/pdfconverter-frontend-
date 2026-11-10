
//2

import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import Modal from '../../components/ui/Modal';
import { ThemeContext } from '../../context/ThemeContext';
import { userService } from '../../services/userService';
import { localizeError } from '../../utils/localizeError';
import { useNotification } from '../../context/NotificationContext';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const notify = useNotification();
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [language, setLanguage] = useState(i18n.language);
  const [name, setName] = useState(user?.name || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [languageSaving, setLanguageSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Danger Zone State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const avatarInput = useRef(null);

  useEffect(() => {
    setLanguage(i18n.resolvedLanguage || 'en');
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme) toggleTheme();
  };

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    const previousLanguage = i18n.resolvedLanguage || 'en';
    setLanguageSaving(true);
    try {
      await i18n.changeLanguage(newLang);
      const updatedUser = await userService.updatePreferredLanguage(newLang);
      updateUser(updatedUser);
      notify(i18n.t('settings.languageSaved'), 'success');
    } catch (error) {
      await i18n.changeLanguage(previousLanguage);
      setLanguage(previousLanguage);
      notify(i18n.t('settings.languageSaveFailed'), 'error');
    } finally {
      setLanguageSaving(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName || normalizedName.length > 80) {
      notify(t('settings.invalidName'), 'error');
      return;
    }
    setProfileSaving(true);
    try {
      const updatedUser = await userService.updateSettings({ name: normalizedName });
      updateUser(updatedUser);
      notify(t('settings.profileSaved'), 'success');
    } catch (error) {
      notify(error.response?.data?.message ? localizeError(error.response.data.message, t) : t('settings.profileSaveFailed'), 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      notify(t('settings.invalidAvatarType'), 'error');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify(t('settings.avatarTooLarge'), 'error');
      e.target.value = '';
      return;
    }
    setAvatarLoading(true);
    try {
      const updatedUser = await userService.uploadProfilePicture(file);
      updateUser(updatedUser);
      notify(t('settings.avatarSaved'), 'success');
    } catch (error) {
      notify(t('settings.avatarSaveFailed'), 'error');
    } finally {
      setAvatarLoading(false);
      e.target.value = '';
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarLoading(true);
    try {
      const updatedUser = await userService.removeProfilePicture();
      updateUser(updatedUser);
      notify(t('settings.avatarRemoved'), 'success');
    } catch (error) {
      notify(t('settings.avatarRemoveFailed'), 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notify(t('settings.passwordMismatch'), 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      await userService.changePassword(oldPassword, newPassword);
      notify(t('settings.passwordUpdated'), 'success');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (error) {
      notify(t('settings.passwordUpdateFailed'), 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      notify(t('settings.deleteConfirmationMismatch'), 'error');
      return;
    }
    setIsDeleting(true);
    try {
      await userService.deleteAccount(deletePassword);
      notify(t('settings.accountDeleted'), 'success');
      logout();
    } catch (error) {
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.accountDeleteFailed'), 'error');
      setIsDeleting(false);
    }
  };

  const handleExportAccountData = async () => {
    setExportLoading(true);
    try {
      const accountData = await userService.exportAccountData();
      const downloadUrl = URL.createObjectURL(new Blob(
        [JSON.stringify(accountData, null, 2)],
        { type: 'application/json' }
      ));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'aiconvert-account-data.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      notify(t('settings.exportSuccess'), 'success');
    } catch (error) {
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.exportFailed'), 'error');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold text-white">{t('nav.settings')}</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl text-white">{t('settings.dataPrivacy')}</h2>
            <p className="mt-1 text-sm text-gray-400">{t('settings.dataPrivacyDescription')}</p>
          </div>
          <Button type="button" variant="outline" onClick={handleExportAccountData} isLoading={exportLoading}>
            {t('settings.exportData')}
          </Button>
        </div>
      </div>

      {/* 2. PROFILE */}
      <form onSubmit={handleProfileSave} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-white mb-4">{t('settings.profileInformation')}</h2>
        <div className="mb-6 flex flex-wrap items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={t('settings.profilePicture')} className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-700" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/15 text-2xl font-semibold text-blue-200 ring-2 ring-gray-700">
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          )}
          <div className="flex flex-wrap gap-3">
            <input type="file" ref={avatarInput} onChange={handleAvatarChange} accept="image/jpeg,image/png,image/webp" aria-label={t('settings.profilePicture')} className="hidden" />
            <Button type="button" onClick={() => avatarInput.current?.click()} isLoading={avatarLoading}>
              {user?.avatarUrl ? t('settings.changePicture') : t('settings.uploadPicture')}
            </Button>
            {user?.avatarUrl && (
              <Button type="button" variant="outline" onClick={handleAvatarRemove} disabled={avatarLoading}>
                {t('settings.removePicture')}
              </Button>
            )}
          </div>
          <p className="w-full text-xs text-gray-500">{t('settings.pictureRequirements')}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="profile-name" className="block text-gray-400 text-sm mb-2">{t('settings.name')}</label>
          <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700" />
        </div>
        <div className="mb-6">
          <label htmlFor="profile-email" className="block text-gray-400 text-sm mb-2">{t('settings.email')}</label>
          <input id="profile-email" type="email" disabled value={user?.email || ''} className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-500" />
        </div>
        <Button type="submit" isLoading={profileSaving}>{t('settings.saveProfile')}</Button>
      </form>

      {/* 3. PREFERENCES */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-white mb-4">{t('settings.preferences')}</h2>
        <div className="mb-6">
          <label htmlFor="preferred-language" className="block text-gray-400 text-sm mb-2">{t('settings.preferredLanguage')}</label>
          <select
            id="preferred-language"
            value={language}
            onChange={handleLanguageChange}
            disabled={languageSaving}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white disabled:opacity-60"
          >
            <option value="en">{t('common.english')}</option>
            <option value="km">{t('common.khmer')}</option>
          </select>
        </div>
        <div>
          <p className="mb-2 block text-sm text-gray-400">{t('settings.appearance')}</p>
          <div className="flex gap-4">
            <button type="button" aria-pressed={theme === 'dark'} onClick={() => handleThemeChange('dark')} className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'}`}>{t('settings.darkMode')}</button>
            <button type="button" aria-pressed={theme === 'light'} onClick={() => handleThemeChange('light')} className={`px-4 py-2 rounded-lg border ${theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'}`}>{t('settings.lightMode')}</button>
          </div>
        </div>
      </div>

      {/* 4. SECURITY */}
      <form onSubmit={handlePasswordChange} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-white mb-4">{t('settings.changePassword')}</h2>
        <PasswordInput placeholder={t('settings.currentPassword')} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <div className="mt-4"><PasswordInput placeholder={t('settings.newPassword')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
        <div className="mt-4"><PasswordInput placeholder={t('settings.confirmNewPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
        <Button type="submit" isLoading={passwordLoading} className="mt-6">{t('settings.updatePassword')}</Button>
      </form>

      {/* 5. DANGER ZONE */}
      <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-6">
        <h2 className="text-xl text-rose-400 mb-2">{t('settings.dangerZone')}</h2>
        <p className="text-sm text-gray-400 mb-4">{t('settings.deleteAccountDescription')}</p>
        <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>{t('settings.deleteAccount')}</Button>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('settings.deleteAccount')}>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">{t('settings.deleteAccount')}</h2>
        <p className="text-gray-600 mb-4">{t('settings.deleteAccountConfirm', { confirmation: 'DELETE' })}</p>
        <label htmlFor="delete-account-confirm" className="mb-2 block text-left text-sm text-slate-600">{t('settings.typeDelete')}</label>
        <input id="delete-account-confirm" type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-4" />
        <label htmlFor="delete-account-password" className="mb-2 block text-left text-sm text-slate-600">{t('settings.currentPassword')}</label>
        <input id="delete-account-password" type="password" autoComplete="current-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-6" />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleDeleteAccount} isLoading={isDeleting}>{t('settings.deletePermanently')}</Button>
        </div>
      </Modal>
    </div>
  );
}

// 3

// import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../hooks/useAuth';
// import Button from '../../components/ui/Button';
// import PasswordInput from '../../components/ui/PasswordInput';
// import Modal from '../../components/ui/Modal';
// import { userService } from '../../services/userService';
// import { localizeError } from '../../utils/localizeError';
// import { useNotification } from '../../context/NotificationContext';

// export default function Settings() {
//   const { user, updateUser, logout } = useAuth();
//   const { t, i18n } = useTranslation();
//   const notify = useNotification();
  
//   const [activeTab, setActiveTab] = useState('profile');
//   const [language, setLanguage] = useState(i18n.language);
//   const [name, setName] = useState(user?.name || '');
//   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPasswords, setShowPasswords] = useState(false);
  
//   const [loading, setLoading] = useState(false);
//   const [avatarLoading, setAvatarLoading] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteConfirmText, setDeleteConfirmText] = useState('');
//   const [isDeleting, setIsDeleting] = useState(false);

//   const avatarInput = useRef(null);

//   useEffect(() => { setLanguage(i18n.resolvedLanguage || 'en'); }, [i18n.resolvedLanguage]);
//   useEffect(() => { setName(user?.name || ''); }, [user?.name]);

//   const handleThemeChange = (newTheme) => {
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     document.documentElement.classList.toggle('dark', newTheme === 'dark');
//     notify(`Theme switched to ${newTheme} mode`, 'success');
//   };

//   const handleLanguageChange = async (e) => {
//     const newLang = e.target.value;
//     setLoading(true);
//     try {
//       await i18n.changeLanguage(newLang);
//       const updatedUser = await userService.updatePreferredLanguage(newLang);
//       updateUser(updatedUser);
//       notify(i18n.t('settings.languageSaved'), 'success');
//     } catch (error) {
//       notify(i18n.t('settings.languageSaveFailed'), 'error');
//     } finally { setLoading(false); }
//   };

//   const handleProfileSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const updatedUser = await userService.updateSettings({ name: name.trim() });
//       updateUser(updatedUser);
//       notify(t('settings.profileSaved'), 'success');
//     } catch (error) {
//       notify('Failed to update profile', 'error');
//     } finally { setLoading(false); }
//   };

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) return notify('Passwords do not match', 'error');
//     setLoading(true);
//     try {
//       await userService.changePassword(oldPassword, newPassword);
//       notify('Password updated', 'success');
//       setOldPassword(''); setNewPassword(''); setConfirmPassword('');
//     } catch (error) {
//       notify('Failed to update password', 'error');
//     } finally { setLoading(false); }
//   };

//   const handleDeleteAccount = async () => {
//     if (deleteConfirmText !== 'DELETE') return notify('Type DELETE to confirm', 'error');
//     setIsDeleting(true);
//     try {
//       await userService.deleteAccount();
//       notify('Account permanently deleted', 'success');
//       logout();
//     } catch (error) {
//       notify('Failed to delete account', 'error');
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-5xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white">Account Settings</h1>
//         <p className="text-gray-400 mt-1">Manage your personal preferences, security, and usage.</p>
//       </div>

//       <div className="flex flex-col md:flex-row gap-8">
//         {/* SIDEBAR TABS */}
//         <div className="w-full md:w-64 flex flex-col gap-1">
//           {['profile', 'security', 'usage', 'preferences'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
//                 activeTab === tab ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
//             </button>
//           ))}
//         </div>

//         {/* CONTENT AREA */}
//         <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
          
//           {/* PROFILE TAB */}
//           {activeTab === 'profile' && (
//             <form onSubmit={handleProfileSave} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//               <h2 className="text-xl text-white font-semibold border-b border-gray-800 pb-4">Profile Information</h2>
//               <div className="flex items-center gap-6">
//                 {user?.avatarUrl ? (
//                   <img src={user.avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-800" />
//                 ) : (
//                   <span className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20 text-3xl font-bold text-blue-400 ring-4 ring-gray-800">
//                     {(user?.name || 'U').charAt(0)}
//                   </span>
//                 )}
//                 <div>
//                   <input type="file" ref={avatarInput} onChange={() => {}} className="hidden" />
//                   <Button type="button" onClick={() => avatarInput.current?.click()} variant="outline">Upload New Avatar</Button>
//                   <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Full Name</label>
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-md bg-gray-950 text-white p-3 rounded-lg border border-gray-800 focus:border-blue-500 outline-none" />
//               </div>
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Email Address (Read-only)</label>
//                 <input type="text" disabled value={user?.email} className="w-full max-w-md bg-gray-950 text-gray-500 p-3 rounded-lg border border-gray-800 cursor-not-allowed" />
//               </div>
//               <Button type="submit" isLoading={loading}>Save Changes</Button>
//             </form>
//           )}

//           {/* SECURITY TAB */}
//           {activeTab === 'security' && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
//               <form onSubmit={handlePasswordChange}>
//                 <h2 className="text-xl text-white font-semibold border-b border-gray-800 pb-4 mb-4">Change Password</h2>
//                 <div className="space-y-4 max-w-md">
//                   <PasswordInput placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
//                   <PasswordInput placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
//                   <PasswordInput placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//                 </div>
//                 <Button type="submit" isLoading={loading} className="mt-4">Update Password</Button>
//               </form>

//               <div className="pt-8 border-t border-rose-500/20">
//                 <h2 className="text-xl text-rose-500 font-semibold mb-2">Danger Zone</h2>
//                 <p className="text-sm text-gray-400 mb-4 max-w-lg">Once you delete your account, all your files, conversions, and history will be permanently erased.</p>
//                 <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
//               </div>
//             </div>
//           )}

//           {/* USAGE TAB */}
//           {activeTab === 'usage' && (
//             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
//               <h2 className="text-xl text-white font-semibold border-b border-gray-800 pb-4">Plan & Usage</h2>
//               <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <p className="text-white font-medium text-lg">Free Tier</p>
//                     <p className="text-gray-400 text-sm">12 of 20 files converted this month</p>
//                   </div>
//                   <Button className="bg-gradient-to-r from-blue-500 to-purple-500 border-0">Upgrade to Pro</Button>
//                 </div>
//                 <div className="w-full bg-gray-800 rounded-full h-3">
//                   <div className="bg-blue-500 h-3 rounded-full" style={{ width: '60%' }}></div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-3">Your quota resets in 18 days.</p>
//               </div>
//             </div>
//           )}

//           {/* PREFERENCES TAB */}
//           {activeTab === 'preferences' && (
//             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
//               <h2 className="text-xl text-white font-semibold border-b border-gray-800 pb-4">Preferences</h2>
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">App Language</label>
//                 <select value={language} onChange={handleLanguageChange} className="w-full max-w-md bg-gray-950 text-white p-3 rounded-lg border border-gray-800">
//                   <option value="en">English</option>
//                   <option value="km">ភាសាខ្មែរ (Khmer)</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Theme</label>
//                 <div className="flex gap-4">
//                   <button onClick={() => handleThemeChange('dark')} className={`px-6 py-3 rounded-lg border flex-1 max-w-[150px] ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'}`}>Dark</button>
//                   <button onClick={() => handleThemeChange('light')} className={`px-6 py-3 rounded-lg border flex-1 max-w-[150px] ${theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-700 text-gray-400'}`}>Light</button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* DELETE MODAL */}
//       <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Account">
//         <p className="text-gray-400 mb-4">Type <strong className="text-white">DELETE</strong> to confirm.</p>
//         <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-6" />
//         <div className="flex justify-end gap-3">
//           <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteAccount} isLoading={isDeleting}>Delete Permanently</Button>
//         </div>
//       </Modal>
//     </div>
//   );
// }