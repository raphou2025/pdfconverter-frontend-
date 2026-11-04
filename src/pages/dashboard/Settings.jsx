import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';
import { userService } from '../../services/userService';
import { localizeError } from '../../utils/localizeError';
import { useNotification } from '../../context/NotificationContext';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const notify = useNotification();
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
  const avatarInput = useRef(null);

  useEffect(() => {
    setLanguage(i18n.resolvedLanguage || 'en');
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguageSaving(true);
    try {
      await i18n.changeLanguage(newLang);
      const updatedUser = await userService.updatePreferredLanguage(newLang);
      updateUser(updatedUser);
      notify(i18n.t('settings.languageSaved'), 'success');
    } catch (error) {
      console.error('Failed to save preferred language:', error);
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
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.profileSaveFailed'), 'error');
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
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.avatarSaveFailed'), 'error');
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
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.avatarRemoveFailed'), 'error');
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
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      notify(error.response?.data?.message
        ? localizeError(error.response.data.message, t)
        : t('settings.passwordUpdateFailed'), 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">{t('nav.settings')}</h1>
      
      <form onSubmit={handleProfileSave} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl">
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
            <input
              ref={avatarInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label={t('settings.profilePicture')}
            />
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
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">{t('settings.email')}</label>
          <input type="text" disabled value={user?.email || ''} className="w-full bg-gray-800 text-gray-500 p-3 rounded-lg border border-gray-700 cursor-not-allowed" />
        </div>

        <div className="mb-6">
          <label htmlFor="preferred-language" className="block text-gray-400 text-sm mb-2">{t('settings.preferredLanguage')}</label>
          <select 
            id="preferred-language"
            value={language} 
            disabled={languageSaving}
            onChange={handleLanguageChange}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 outline-none"
          >
            <option value="en">{t('common.english')}</option>
            <option value="km">{t('common.khmer')}</option>
          </select>
        </div>
        <Button type="submit" isLoading={profileSaving}>
          {profileSaving ? t('settings.savingProfile') : t('settings.saveProfile')}
        </Button>
      </form>

      <form onSubmit={handlePasswordChange} className="mt-6 max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl text-white">{t('settings.changePassword')}</h2>
        <label htmlFor="current-password" className="mb-2 block text-sm text-gray-400">{t('settings.currentPassword')}</label>
        <PasswordInput
          id="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          showPassword={showPasswords}
          onToggleVisibility={() => setShowPasswords((visible) => !visible)}
          autoComplete="current-password"
          placeholder={t('settings.currentPassword')}
        />

        <label htmlFor="new-password" className="mb-2 mt-4 block text-sm text-gray-400">{t('settings.newPassword')}</label>
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showPasswords}
          onToggleVisibility={() => setShowPasswords((visible) => !visible)}
          autoComplete="new-password"
          placeholder={t('settings.newPassword')}
        />

        <label htmlFor="confirm-password" className="mb-2 mt-4 block text-sm text-gray-400">{t('settings.confirmNewPassword')}</label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showPasswords}
          onToggleVisibility={() => setShowPasswords((visible) => !visible)}
          autoComplete="new-password"
          placeholder={t('settings.confirmNewPassword')}
        />

        <Button type="submit" isLoading={passwordLoading} className="mt-6">
          {passwordLoading ? t('settings.updatingPassword') : t('settings.updatePassword')}
        </Button>
      </form>
    </div>
  );
}