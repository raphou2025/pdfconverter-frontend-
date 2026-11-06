// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import api from '../../services/api';
// import { localizeError } from '../../utils/localizeError';

// const chartColors = {
//   users: '#60a5fa',
//   conversions: '#34d399',
//   translations: '#a78bfa'
// };

// const getPoint = (value, index, count, maximum) => ({
//   x: 48 + (index * 664) / Math.max(count - 1, 1),
//   y: 174 - (value / maximum) * 136
// });

// const getLinePath = (values, maximum) => values
//   .map((value, index) => {
//     const point = getPoint(value, index, values.length, maximum);
//     return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
//   })
//   .join(' ');

// function ActivityChart({ data, t, language }) {
//   const maximum = Math.max(1, ...data.flatMap((day) => [day.users, day.conversions, day.translations]));
//   const series = [
//     { key: 'users', color: chartColors.users },
//     { key: 'conversions', color: chartColors.conversions },
//     { key: 'translations', color: chartColors.translations }
//   ];

//   return (
//     <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
//         <div>
//           <h2 className="font-semibold text-white">{t('adminDashboard.activityTitle')}</h2>
//           <p className="mt-1 text-sm text-slate-500">{t('adminDashboard.lastSevenDays')}</p>
//         </div>
//         <div className="flex flex-wrap gap-x-4 gap-y-2">
//           {series.map((item) => (
//             <span key={item.key} className="inline-flex items-center gap-2 text-xs text-slate-400">
//               <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
//               {t(`adminDashboard.${item.key}`)}
//             </span>
//           ))}
//         </div>
//       </div>
//       <div className="mt-5 overflow-hidden">
//         <svg
//           role="img"
//           aria-label={t('adminDashboard.activityChartLabel')}
//           viewBox="0 0 740 220"
//           className="h-auto w-full"
//         >
//           {[0, 1, 2, 3].map((line) => {
//             const y = 38 + line * 45;
//             return (
//               <g key={line}>
//                 <line x1="48" x2="712" y1={y} y2={y} stroke="#263246" strokeDasharray="4 6" />
//                 <text x="4" y={y + 4} fill="#64748b" fontSize="11">
//                   {Math.round(maximum * (3 - line) / 3)}
//                 </text>
//               </g>
//             );
//           })}
//           {series.map((item) => (
//             <g key={item.key}>
//               <path
//                 d={getLinePath(data.map((day) => day[item.key]), maximum)}
//                 fill="none"
//                 stroke={item.color}
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               {data.map((day, index) => {
//                 const point = getPoint(day[item.key], index, data.length, maximum);
//                 return (
//                   <circle key={`${item.key}-${day.date}`} cx={point.x} cy={point.y} r="4" fill={item.color}>
//                     <title>{`${day.date}: ${t(`adminDashboard.${item.key}`)} ${day[item.key]}`}</title>
//                   </circle>
//                 );
//               })}
//             </g>
//           ))}
//           {data.map((day, index) => {
//             const point = getPoint(0, index, data.length, maximum);
//             return (
//               <text key={day.date} x={point.x} y="204" textAnchor="middle" fill="#94a3b8" fontSize="11">
//                 {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(language, { weekday: 'short', timeZone: 'UTC' })}
//               </text>
//             );
//           })}
//         </svg>
//       </div>
//     </section>
//   );
// }

// function VolumeChart({ data, t, language }) {
//   const maximum = Math.max(1, ...data.flatMap((day) => [day.conversions, day.translations]));
//   const chartHeight = 142;
//   const groupWidth = 664 / data.length;
//   const barWidth = Math.min(15, groupWidth * 0.22);

//   return (
//     <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
//       <div>
//         <h2 className="font-semibold text-white">{t('adminDashboard.volumeTitle')}</h2>
//         <p className="mt-1 text-sm text-slate-500">{t('adminDashboard.volumeDescription')}</p>
//       </div>
//       <div className="mt-5 flex gap-4 text-xs text-slate-400">
//         <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-emerald-400" />{t('adminDashboard.conversions')}</span>
//         <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-violet-400" />{t('adminDashboard.translations')}</span>
//       </div>
//       <div className="mt-3 overflow-hidden">
//         <svg
//           role="img"
//           aria-label={t('adminDashboard.volumeChartLabel')}
//           viewBox="0 0 740 205"
//           className="h-auto w-full"
//         >
//           {[0, 1, 2, 3].map((line) => {
//             const y = 20 + line * (chartHeight / 3);
//             return <line key={line} x1="48" x2="712" y1={y} y2={y} stroke="#263246" strokeDasharray="4 6" />;
//           })}
//           {data.map((day, index) => {
//             const center = 48 + groupWidth * index + groupWidth / 2;
//             const conversionHeight = (day.conversions / maximum) * chartHeight;
//             const translationHeight = (day.translations / maximum) * chartHeight;
//             return (
//               <g key={day.date}>
//                 <rect
//                   x={center - barWidth - 2}
//                   y={162 - conversionHeight}
//                   width={barWidth}
//                   height={Math.max(conversionHeight, day.conversions ? 2 : 0)}
//                   rx="4"
//                   fill={chartColors.conversions}
//                 >
//                   <title>{`${day.date}: ${t('adminDashboard.conversions')} ${day.conversions}`}</title>
//                 </rect>
//                 <rect
//                   x={center + 2}
//                   y={162 - translationHeight}
//                   width={barWidth}
//                   height={Math.max(translationHeight, day.translations ? 2 : 0)}
//                   rx="4"
//                   fill={chartColors.translations}
//                 >
//                   <title>{`${day.date}: ${t('adminDashboard.translations')} ${day.translations}`}</title>
//                 </rect>
//                 <text x={center} y="190" textAnchor="middle" fill="#94a3b8" fontSize="11">
//                   {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(language, { weekday: 'short', timeZone: 'UTC' })}
//                 </text>
//               </g>
//             );
//           })}
//         </svg>
//       </div>
//     </section>
//   );
// }

// function StatCard({ label, value, detail, icon, accent }) {
//   return (
//     <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//       <div className={`absolute -right-7 -top-8 h-28 w-28 rounded-full blur-3xl ${accent}`} />
//       <div className="relative flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-medium text-slate-400">{label}</p>
//           <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
//           <p className="mt-2 text-xs text-slate-500">{detail}</p>
//         </div>
//         <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-slate-950/70 text-slate-200">
//           {icon}
//         </span>
//       </div>
//     </section>
//   );
// }

// function StatIcon({ path }) {
//   return (
//     <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
//       <path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// export default function AdminOverview() {
//   const { t, i18n } = useTranslation();
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     let active = true;

//     api.get('/admin/stats')
//       .then(({ data }) => {
//         if (active) setStats(data);
//       })
//       .catch((requestError) => {
//         if (active) {
//           setError(requestError.response?.data?.message
//             ? localizeError(requestError.response.data.message, t)
//             : t('admin.loadError'));
//         }
//       });

//     return () => {
//       active = false;
//     };
//   }, [t]);

//   const number = (value) => value.toLocaleString(i18n.resolvedLanguage);
//   const todayActivity = stats ? stats.today.conversions + stats.today.translations : 0;
//   const statCards = [
//     {
//       key: 'userCount',
//       label: 'totalUsers',
//       value: stats ? number(stats.userCount) : '—',
//       detail: t('adminDashboard.newUsersToday', { count: stats?.today.users ?? 0 }),
//       accent: 'bg-blue-500/15',
//       icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-13a4 4 0 0 1 0 8m4 5v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
//     },
//     {
//       key: 'conversionCount',
//       label: 'conversions',
//       value: stats ? number(stats.conversionCount) : '—',
//       detail: t('adminDashboard.conversionsToday', { count: stats?.today.conversions ?? 0 }),
//       accent: 'bg-emerald-500/15',
//       icon: 'M12 3v12m0 0 4-4m-4 4-4-4m-4 7v2h16v-2'
//     },
//     {
//       key: 'translationCount',
//       label: 'translations',
//       value: stats ? number(stats.translationCount) : '—',
//       detail: t('adminDashboard.translationsToday', { count: stats?.today.translations ?? 0 }),
//       accent: 'bg-violet-500/15',
//       icon: 'M4 5h16M4 10h10M4 15h6m4 5 4-8 4 8m-6-3h4'
//     },
//     {
//       key: 'todayActivity',
//       label: 'todayActivity',
//       value: stats ? number(todayActivity) : '—',
//       detail: t('adminDashboard.activityToday'),
//       accent: 'bg-amber-500/15',
//       icon: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
//     }
//   ];

//   return (
//     <div className="space-y-7">
//       <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
//         <div>
//           <p className="mb-2 text-sm font-medium text-blue-300">{t('admin.section')}</p>
//           <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('admin.title')}</h1>
//           <p className="mt-2 text-slate-400">{t('admin.description')}</p>
//         </div>
//         <Link
//           to="/admin/monitoring"
//           className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 hover:bg-slate-800"
//         >
//           <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
//           {t('adminDashboard.systemStatus')}
//           <span aria-hidden="true">→</span>
//         </Link>
//       </div>

//       {error && (
//         <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
//           {error}
//         </p>
//       )}

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {statCards.map((card) => (
//           <StatCard
//             key={card.key}
//             label={t(`admin.${card.label}`)}
//             value={card.value}
//             detail={card.detail}
//             accent={card.accent}
//             icon={<StatIcon path={card.icon} />}
//           />
//         ))}
//       </div>

//       {stats && (
//         <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
//           <ActivityChart data={stats.activityByDay} t={t} language={i18n.resolvedLanguage} />
//           <VolumeChart data={stats.activityByDay} t={t} language={i18n.resolvedLanguage} />
//         </div>
//       )}

//       <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
//         <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
//           <div>
//             <h2 className="font-semibold text-white">{t('admin.recentUsers')}</h2>
//             <p className="mt-1 text-sm text-slate-500">{t('admin.latestAccounts')}</p>
//           </div>
//           {stats && (
//             <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-400">
//               {t('adminDashboard.showingRecent', { count: stats.recentUsers.length })}
//             </span>
//           )}
//         </div>
//         {!stats ? (
//           <p className="p-6 text-sm text-slate-400">{error ? t('admin.accountListUnavailable') : t('admin.loadingAccounts')}</p>
//         ) : stats.recentUsers.length === 0 ? (
//           <p className="p-6 text-sm text-slate-400">{t('admin.noAccounts')}</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[560px] text-left text-sm">
//               <thead className="bg-slate-950/40 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3 font-medium sm:px-6">{t('adminDashboard.user')}</th>
//                   <th className="px-5 py-3 font-medium">{t('adminDashboard.role')}</th>
//                   <th className="px-5 py-3 font-medium">{t('adminDashboard.joined')}</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-800">
//                 {stats.recentUsers.map((user) => (
//                   <tr key={user.id} className="transition hover:bg-slate-800/30">
//                     <td className="px-5 py-4 sm:px-6">
//                       <div className="flex items-center gap-3">
//                         <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 text-xs font-semibold text-blue-200 ring-1 ring-white/5">
//                           {(user.name || user.email || 'U').charAt(0).toUpperCase()}
//                         </span>
//                         <div className="min-w-0">
//                           <p className="truncate font-medium text-slate-200">{user.name || t('admin.unnamedAccount')}</p>
//                           <p className="truncate text-xs text-slate-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-blue-400/10 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
//                         {user.role === 'ADMIN' ? t('admin.adminRole') : t('admin.userRole')}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4 text-slate-400">
//                       {new Date(user.createdAt).toLocaleDateString(i18n.resolvedLanguage, { dateStyle: 'medium' })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { localizeError } from '../../utils/localizeError';
import { useNotification } from '../../context/NotificationContext'; // 🚨 Import notification

const chartColors = {
  users: '#60a5fa',
  conversions: '#34d399',
  translations: '#a78bfa'
};

const getPoint = (value, index, count, maximum) => ({
  x: 48 + (index * 664) / Math.max(count - 1, 1),
  y: 174 - (value / maximum) * 136
});

const getLinePath = (values, maximum) => values
  .map((value, index) => {
    const point = getPoint(value, index, values.length, maximum);
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  })
  .join(' ');

function ActivityChart({ data, t, language }) {
  const maximum = Math.max(1, ...data.flatMap((day) => [day.users, day.conversions, day.translations]));
  const series = [
    { key: 'users', color: chartColors.users },
    { key: 'conversions', color: chartColors.conversions },
    { key: 'translations', color: chartColors.translations }
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-semibold text-white">{t('adminDashboard.activityTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('adminDashboard.lastSevenDays')}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {series.map((item) => (
            <span key={item.key} className="inline-flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {t(`adminDashboard.${item.key}`)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 overflow-hidden">
        <svg
          role="img"
          aria-label={t('adminDashboard.activityChartLabel')}
          viewBox="0 0 740 220"
          className="h-auto w-full"
        >
          {[0, 1, 2, 3].map((line) => {
            const y = 38 + line * 45;
            return (
              <g key={line}>
                <line x1="48" x2="712" y1={y} y2={y} stroke="#263246" strokeDasharray="4 6" />
                <text x="4" y={y + 4} fill="#64748b" fontSize="11">
                  {Math.round(maximum * (3 - line) / 3)}
                </text>
              </g>
            );
          })}
          {series.map((item) => (
            <g key={item.key}>
              <path
                d={getLinePath(data.map((day) => day[item.key]), maximum)}
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((day, index) => {
                const point = getPoint(day[item.key], index, data.length, maximum);
                return (
                  <circle key={`${item.key}-${day.date}`} cx={point.x} cy={point.y} r="4" fill={item.color}>
                    <title>{`${day.date}: ${t(`adminDashboard.${item.key}`)} ${day[item.key]}`}</title>
                  </circle>
                );
              })}
            </g>
          ))}
          {data.map((day, index) => {
            const point = getPoint(0, index, data.length, maximum);
            return (
              <text key={day.date} x={point.x} y="204" textAnchor="middle" fill="#94a3b8" fontSize="11">
                {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(language, { weekday: 'short', timeZone: 'UTC' })}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function VolumeChart({ data, t, language }) {
  const maximum = Math.max(1, ...data.flatMap((day) => [day.conversions, day.translations]));
  const chartHeight = 142;
  const groupWidth = 664 / data.length;
  const barWidth = Math.min(15, groupWidth * 0.22);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div>
        <h2 className="font-semibold text-white">{t('adminDashboard.volumeTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('adminDashboard.volumeDescription')}</p>
      </div>
      <div className="mt-5 flex gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-emerald-400" />{t('adminDashboard.conversions')}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-violet-400" />{t('adminDashboard.translations')}</span>
      </div>
      <div className="mt-3 overflow-hidden">
        <svg
          role="img"
          aria-label={t('adminDashboard.volumeChartLabel')}
          viewBox="0 0 740 205"
          className="h-auto w-full"
        >
          {[0, 1, 2, 3].map((line) => {
            const y = 20 + line * (chartHeight / 3);
            return <line key={line} x1="48" x2="712" y1={y} y2={y} stroke="#263246" strokeDasharray="4 6" />;
          })}
          {data.map((day, index) => {
            const center = 48 + groupWidth * index + groupWidth / 2;
            const conversionHeight = (day.conversions / maximum) * chartHeight;
            const translationHeight = (day.translations / maximum) * chartHeight;
            return (
              <g key={day.date}>
                <rect
                  x={center - barWidth - 2}
                  y={162 - conversionHeight}
                  width={barWidth}
                  height={Math.max(conversionHeight, day.conversions ? 2 : 0)}
                  rx="4"
                  fill={chartColors.conversions}
                >
                  <title>{`${day.date}: ${t('adminDashboard.conversions')} ${day.conversions}`}</title>
                </rect>
                <rect
                  x={center + 2}
                  y={162 - translationHeight}
                  width={barWidth}
                  height={Math.max(translationHeight, day.translations ? 2 : 0)}
                  rx="4"
                  fill={chartColors.translations}
                >
                  <title>{`${day.date}: ${t('adminDashboard.translations')} ${day.translations}`}</title>
                </rect>
                <text x={center} y="190" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(language, { weekday: 'short', timeZone: 'UTC' })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function StatCard({ label, value, detail, icon, accent }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <div className={`absolute -right-7 -top-8 h-28 w-28 rounded-full blur-3xl ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-slate-950/70 text-slate-200">
          {icon}
        </span>
      </div>
    </section>
  );
}

function StatIcon({ path }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminOverview() {
  const { t, i18n } = useTranslation();
  const notify = useNotification(); // 🚨 Initialize notify
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // 🚨 Moved fetch logic to a separate function so we can call it after deleting/updating
  const fetchStats = () => {
    api.get('/admin/stats')
      .then(({ data }) => {
        setStats(data);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message
          ? localizeError(requestError.response.data.message, t)
          : t('admin.loadError'));
      });
  };

  useEffect(() => {
    fetchStats();
  }, [t]);

  // 🚨 New: Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      notify('Role updated successfully', 'success');
      fetchStats(); // Refresh data
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  // 🚨 New: Handle Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName || 'this user'}?`)) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      notify('User deleted successfully', 'success');
      fetchStats(); // Refresh data
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const number = (value) => value.toLocaleString(i18n.resolvedLanguage);
  const todayActivity = stats ? stats.today.conversions + stats.today.translations : 0;
  const statCards = [
    {
      key: 'userCount',
      label: 'totalUsers',
      value: stats ? number(stats.userCount) : '—',
      detail: t('adminDashboard.newUsersToday', { count: stats?.today.users ?? 0 }),
      accent: 'bg-blue-500/15',
      icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-13a4 4 0 0 1 0 8m4 5v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
    },
    {
      key: 'conversionCount',
      label: 'conversions',
      value: stats ? number(stats.conversionCount) : '—',
      detail: t('adminDashboard.conversionsToday', { count: stats?.today.conversions ?? 0 }),
      accent: 'bg-emerald-500/15',
      icon: 'M12 3v12m0 0 4-4m-4 4-4-4m-4 7v2h16v-2'
    },
    {
      key: 'translationCount',
      label: 'translations',
      value: stats ? number(stats.translationCount) : '—',
      detail: t('adminDashboard.translationsToday', { count: stats?.today.translations ?? 0 }),
      accent: 'bg-violet-500/15',
      icon: 'M4 5h16M4 10h10M4 15h6m4 5 4-8 4 8m-6-3h4'
    },
    {
      key: 'todayActivity',
      label: 'todayActivity',
      value: stats ? number(todayActivity) : '—',
      detail: t('adminDashboard.activityToday'),
      accent: 'bg-amber-500/15',
      icon: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    }
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-300">{t('admin.section')}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('admin.title')}</h1>
          <p className="mt-2 text-slate-400">{t('admin.description')}</p>
        </div>
        <Link
          to="/admin/monitoring"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/40 hover:bg-slate-800"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
          {t('adminDashboard.systemStatus')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            label={t(`admin.${card.label}`)}
            value={card.value}
            detail={card.detail}
            accent={card.accent}
            icon={<StatIcon path={card.icon} />}
          />
        ))}
      </div>

      {stats && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <ActivityChart data={stats.activityByDay} t={t} language={i18n.resolvedLanguage} />
          <VolumeChart data={stats.activityByDay} t={t} language={i18n.resolvedLanguage} />
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-semibold text-white">{t('admin.recentUsers')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('admin.latestAccounts')}</p>
          </div>
          {stats && (
            <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-400">
              {t('adminDashboard.showingRecent', { count: stats.recentUsers.length })}
            </span>
          )}
        </div>
        {!stats ? (
          <p className="p-6 text-sm text-slate-400">{error ? t('admin.accountListUnavailable') : t('admin.loadingAccounts')}</p>
        ) : stats.recentUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">{t('admin.noAccounts')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-950/40 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">{t('adminDashboard.user')}</th>
                  <th className="px-5 py-3 font-medium">{t('adminDashboard.role')}</th>
                  <th className="px-5 py-3 font-medium">{t('adminDashboard.joined')}</th>
                  {/* 🚨 Added Actions Column */}
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-800/30">
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 text-xs font-semibold text-blue-200 ring-1 ring-white/5">
                          {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-200">{user.name || t('admin.unnamedAccount')}</p>
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {/* 🚨 Replaced static badge with Dropdown */}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 outline-none focus:border-blue-400"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString(i18n.resolvedLanguage, { dateStyle: 'medium' })}
                    </td>
                    {/* 🚨 Added Delete Button */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}