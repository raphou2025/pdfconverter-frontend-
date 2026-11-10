// import { useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import Button from '../../components/ui/Button';
// import Modal from '../../components/ui/Modal';
// import { useAuth } from '../../hooks/useAuth';
// import { adminService } from '../../services/adminService';
// import { useNotification } from '../../context/NotificationContext';
// import { localizeError } from '../../utils/localizeError';

// const PAGE_SIZE = 20;

// export default function AdminSettings() {
//   const { user: currentUser } = useAuth();
//   const { t, i18n } = useTranslation();
//   const notify = useNotification();
//   const [users, setUsers] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState('');
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('ALL');
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState('');
//   const [pendingAction, setPendingAction] = useState(null);
//   const [deletingUser, setDeletingUser] = useState(false);

//   const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
//   const conversionCount = useMemo(
//     () => users.reduce((sum, account) => sum + account.conversionCount, 0),
//     [users]
//   );
//   const adminCount = useMemo(
//     () => users.filter((account) => account.role === 'ADMIN').length,
//     [users]
//   );

//   const loadUsers = async () => {
//     setLoading(true);
//     setLoadError('');
//     try {
//       const result = await adminService.getUsers(page, PAGE_SIZE, search, roleFilter);
//       setUsers(result.users);
//       setTotal(result.total);
//     } catch (error) {
//       setLoadError(error.response?.data?.message
//         ? localizeError(error.response.data.message, t)
//         : t('adminSettings.loadError'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, [page, search, roleFilter]);

//   const handleSearch = (event) => {
//     event.preventDefault();
//     setPage(1);
//     setSearch(searchInput.trim());
//   };

//   const handleRoleChange = async (account, role) => {
//     if (account.role === role) return;
//     try {
//       await adminService.updateUserRole(account.id, role);
//       setUsers((currentUsers) => currentUsers.map((current) => (
//         current.id === account.id ? { ...current, role } : current
//       )));
//       notify(t('adminSettings.roleUpdated'), 'success');
//     } catch (error) {
//       notify(error.response?.data?.message
//         ? localizeError(error.response.data.message, t)
//         : t('adminSettings.roleUpdateFailed'), 'error');
//     }
//   };

//   const handleDeleteUser = async () => {
//     if (!pendingAction) return;
//     setDeletingUser(true);
//     try {
//       await adminService.deleteUser(pendingAction.id);
//       setPendingAction(null);
//       notify(t('adminSettings.userDeleted'), 'success');
//       if (users.length === 1 && page > 1) {
//         setPage((currentPage) => currentPage - 1);
//       } else {
//         await loadUsers();
//       }
//     } catch (error) {
//       notify(error.response?.data?.message
//         ? localizeError(error.response.data.message, t)
//         : t('adminSettings.deleteFailed'), 'error');
//     } finally {
//       setDeletingUser(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <header className="flex flex-wrap items-end justify-between gap-4">
//         <div>
//           <p className="mb-2 text-sm font-medium text-blue-300">{t('adminSettings.eyebrow')}</p>
//           <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('adminSettings.title')}</h1>
//           <p className="mt-2 max-w-2xl text-slate-400">{t('adminSettings.description')}</p>
//         </div>
//         <Link
//           to="/admin/monitoring"
//           className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
//         >
//           {t('adminSettings.monitoringLink')}
//         </Link>
//       </header>

//       <section aria-label={t('adminSettings.accountOverview')} className="grid gap-4 sm:grid-cols-3">
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//           <p className="text-sm text-slate-400">{t('adminSettings.totalAccounts')}</p>
//           <p className="mt-3 text-3xl font-semibold text-white">{total}</p>
//         </div>
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//           <p className="text-sm text-slate-400">{t('adminSettings.adminsOnPage')}</p>
//           <p className="mt-3 text-3xl font-semibold text-white">{adminCount}</p>
//         </div>
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//           <p className="text-sm text-slate-400">{t('adminSettings.conversionsOnPage')}</p>
//           <p className="mt-3 text-3xl font-semibold text-white">{conversionCount}</p>
//         </div>
//       </section>

//       <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
//         <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 px-5 py-5 sm:px-6">
//           <div>
//             <h2 className="font-semibold text-white">{t('adminSettings.directoryTitle')}</h2>
//             <p className="mt-1 text-sm text-slate-400">{t('adminSettings.directoryDescription')}</p>
//           </div>
//           <form onSubmit={handleSearch} className="flex w-full flex-wrap gap-2 sm:w-auto">
//             <label className="sr-only" htmlFor="account-search">{t('adminSettings.searchLabel')}</label>
//             <input
//               id="account-search"
//               type="search"
//               value={searchInput}
//               onChange={(event) => setSearchInput(event.target.value)}
//               placeholder={t('adminSettings.searchPlaceholder')}
//               className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400 sm:w-56"
//             />
//             <label className="sr-only" htmlFor="account-role-filter">{t('adminSettings.roleFilter')}</label>
//             <select
//               id="account-role-filter"
//               value={roleFilter}
//               onChange={(event) => {
//                 setPage(1);
//                 setRoleFilter(event.target.value);
//               }}
//               className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400"
//             >
//               <option value="ALL">{t('adminSettings.allRoles')}</option>
//               <option value="USER">{t('adminSettings.userRole')}</option>
//               <option value="ADMIN">{t('adminSettings.adminRole')}</option>
//             </select>
//             <Button type="submit">{t('adminSettings.search')}</Button>
//           </form>
//         </div>

//         {loading ? (
//           <p className="p-6 text-sm text-slate-400">{t('adminSettings.loading')}</p>
//         ) : loadError ? (
//           <div role="alert" className="flex flex-wrap items-center justify-between gap-4 p-6">
//             <p className="text-sm text-rose-300">{loadError}</p>
//             <Button type="button" variant="outline" onClick={loadUsers}>{t('adminSettings.retry')}</Button>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="px-6 py-12 text-center">
//             <p className="font-medium text-slate-200">{t('adminSettings.noResults')}</p>
//             <p className="mt-2 text-sm text-slate-500">{t('adminSettings.noResultsDescription')}</p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[820px] text-left">
//                 <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
//                   <tr>
//                     <th className="px-5 py-3 font-medium sm:px-6">{t('adminSettings.account')}</th>
//                     <th className="px-5 py-3 font-medium">{t('adminSettings.joined')}</th>
//                     <th className="px-5 py-3 font-medium">{t('adminSettings.activity')}</th>
//                     <th className="px-5 py-3 font-medium">{t('adminSettings.role')}</th>
//                     <th className="px-5 py-3 font-medium">{t('adminSettings.actions')}</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-800">
//                   {users.map((account) => {
//                     const isCurrentUser = account.id === currentUser?.id;
//                     return (
//                       <tr key={account.id} className="text-sm">
//                         <td className="px-5 py-4 sm:px-6">
//                           <p className="font-medium text-slate-200">{account.name || t('adminSettings.unnamed')}</p>
//                           <p className="mt-1 text-slate-500">{account.email}</p>
//                         </td>
//                         <td className="px-5 py-4 text-slate-400">
//                           {new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium' }).format(new Date(account.createdAt))}
//                         </td>
//                         <td className="px-5 py-4 text-slate-400">
//                           {t('adminSettings.activityCount', {
//                             conversions: account.conversionCount,
//                             translations: account.translationCount
//                           })}
//                         </td>
//                         <td className="px-5 py-4">
//                           <label className="sr-only" htmlFor={`role-${account.id}`}>
//                             {t('adminSettings.changeRole', { name: account.name || account.email })}
//                           </label>
//                           <select
//                             id={`role-${account.id}`}
//                             value={account.role}
//                             disabled={isCurrentUser}
//                             onChange={(event) => handleRoleChange(account, event.target.value)}
//                             className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
//                           >
//                             <option value="USER">{t('adminSettings.userRole')}</option>
//                             <option value="ADMIN">{t('adminSettings.adminRole')}</option>
//                           </select>
//                         </td>
//                         <td className="px-5 py-4">
//                           <Button
//                             type="button"
//                             variant="danger"
//                             disabled={isCurrentUser}
//                             onClick={() => setPendingAction(account)}
//                             className="px-3 py-2 text-sm"
//                           >
//                             {t('adminSettings.delete')}
//                           </Button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-5 py-4 sm:px-6">
//               <p className="text-sm text-slate-400">
//                 {t('adminSettings.pageOf', { page, pageCount, total })}
//               </p>
//               <div className="flex gap-2">
//                 <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
//                   {t('adminSettings.previous')}
//                 </Button>
//                 <Button type="button" variant="outline" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>
//                   {t('adminSettings.next')}
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </section>

//       <Modal isOpen={Boolean(pendingAction)} onClose={() => setPendingAction(null)} title={t('adminSettings.deleteUser')}>
//         <h2 className="mb-2 text-xl font-semibold text-slate-900">{t('adminSettings.deleteUser')}</h2>
//         <p className="mb-6 text-slate-600">
//           {t('adminSettings.deleteConfirmation', { email: pendingAction?.email || '' })}
//         </p>
//         <div className="flex justify-end gap-3">
//           <Button type="button" variant="outline" onClick={() => setPendingAction(null)}>{t('common.cancel')}</Button>
//           <Button type="button" variant="danger" isLoading={deletingUser} onClick={handleDeleteUser}>
//             {t('adminSettings.deletePermanently')}
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState } from 'react';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export default function AdminSettings() {
  const notify = useNotification();
  const [saving, setSaving] = useState(false);
  
  // System State Mockup
  const [settings, setSettings] = useState({
    maxFileSize: 10,
    maxPages: 20,
    force2FA: false,
    maintenanceMode: false,
    aiModel: 'tesseract-v4',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      notify('Global configurations updated.', 'success');
      setSaving(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          System Control Panel
          <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">ADMIN ONLY</span>
        </h1>
        <p className="text-gray-400 mt-1">Manage global limits, security policies, and platform behavior.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. GLOBAL LIMITS */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </span>
            <h2 className="text-lg font-semibold text-white">Global Limits</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-300">Max File Size (MB)</label>
                <span className="text-sm text-blue-400 font-mono">{settings.maxFileSize} MB</span>
              </div>
              <input type="range" min="5" max="50" value={settings.maxFileSize} onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})} className="w-full accent-blue-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-300">Max PDF Pages</label>
                <span className="text-sm text-blue-400 font-mono">{settings.maxPages}</span>
              </div>
              <input type="range" min="5" max="100" value={settings.maxPages} onChange={(e) => setSettings({...settings, maxPages: e.target.value})} className="w-full accent-blue-500" />
            </div>
          </div>
        </div>

        {/* 2. AI CONFIGURATION */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            <h2 className="text-lg font-semibold text-white">AI Processing Engine</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Default OCR Model</label>
              <select value={settings.aiModel} onChange={(e) => setSettings({...settings, aiModel: e.target.value})} className="w-full bg-gray-950 text-white p-3 rounded-lg border border-gray-800">
                <option value="tesseract-v4">Tesseract v4 (Fast)</option>
                <option value="tesseract-v5">Tesseract v5 (Accurate)</option>
                <option value="google-vision">Google Vision API (Premium)</option>
              </select>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400">Switching to Google Vision will incur higher API costs.</p>
            </div>
          </div>
        </div>

        {/* 3. SECURITY POLICIES */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </span>
            <h2 className="text-lg font-semibold text-white">Security Policies</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Force 2FA</p>
                <p className="text-xs text-gray-500">Require all users to enable 2FA.</p>
              </div>
              <button type="button" onClick={() => setSettings({...settings, force2FA: !settings.force2FA})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.force2FA ? 'bg-rose-500' : 'bg-gray-700'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.force2FA ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Block all incoming API requests.</p>
              </div>
              <button type="button" onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-700'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. DANGER ZONE */}
        <div className="bg-gray-900 border border-rose-500/30 rounded-2xl p-6 bg-gradient-to-br from-gray-900 to-rose-950/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
            <h2 className="text-lg font-semibold text-white">System Actions</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">These actions are destructive and affect the entire platform.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => notify('Cache cleared!', 'success')} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">Clear Cache</button>
            <button type="button" className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm rounded-lg hover:bg-rose-500/20 transition">Purge Database</button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
          <Button type="submit" isLoading={saving} className="px-8">Save All Configurations</Button>
        </div>
      </form>
    </div>
  );
}
