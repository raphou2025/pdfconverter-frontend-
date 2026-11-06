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

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from '../../services/api';
import { localizeError } from '../../utils/localizeError';

// ==========================================
// CHART CONFIGURATION
// ==========================================

const chartColors = {
  users: '#60a5fa',
  conversions: '#34d399',
  translations: '#a78bfa',
};

// ==========================================
// CHART HELPERS
// ==========================================

const getPoint = (value, index, count, maximum) => ({
  x: 48 + (index * 664) / Math.max(count - 1, 1),
  y: 174 - (value / maximum) * 136,
});

const getLinePath = (values, maximum) =>
  values
    .map((value, index) => {
      const point = getPoint(value, index, values.length, maximum);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ');

// ==========================================
// ACTIVITY CHART
// ==========================================

function ActivityChart({ data = [], t, language }) {
  const maximum = Math.max(
    1,
    ...data.flatMap((day) => [
      Number(day.users) || 0,
      Number(day.conversions) || 0,
      Number(day.translations) || 0,
    ])
  );

  const series = [
    { key: 'users', color: chartColors.users },
    { key: 'conversions', color: chartColors.conversions },
    { key: 'translations', color: chartColors.translations },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-semibold text-white">
            {t('adminDashboard.activityTitle')}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t('adminDashboard.lastSevenDays')}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {series.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-2 text-xs text-slate-400"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
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
                <line
                  x1="48"
                  x2="712"
                  y1={y}
                  y2={y}
                  stroke="#263246"
                  strokeDasharray="4 6"
                />

                <text
                  x="4"
                  y={y + 4}
                  fill="#64748b"
                  fontSize="11"
                >
                  {Math.round((maximum * (3 - line)) / 3)}
                </text>
              </g>
            );
          })}

          {series.map((item) => (
            <g key={item.key}>
              <path
                d={getLinePath(
                  data.map((day) => Number(day[item.key]) || 0),
                  maximum
                )}
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {data.map((day, index) => {
                const value = Number(day[item.key]) || 0;

                const point = getPoint(
                  value,
                  index,
                  data.length,
                  maximum
                );

                return (
                  <circle
                    key={`${item.key}-${day.date}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={item.color}
                  >
                    <title>
                      {`${day.date}: ${t(
                        `adminDashboard.${item.key}`
                      )} ${value}`}
                    </title>
                  </circle>
                );
              })}
            </g>
          ))}

          {data.map((day, index) => {
            const point = getPoint(0, index, data.length, maximum);

            return (
              <text
                key={day.date}
                x={point.x}
                y="204"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
              >
                {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(
                  language,
                  {
                    weekday: 'short',
                    timeZone: 'UTC',
                  }
                )}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

// ==========================================
// VOLUME CHART
// ==========================================

function VolumeChart({ data = [], t, language }) {
  const maximum = Math.max(
    1,
    ...data.flatMap((day) => [
      Number(day.conversions) || 0,
      Number(day.translations) || 0,
    ])
  );

  const chartHeight = 142;
  const groupWidth = 664 / Math.max(data.length, 1);
  const barWidth = Math.min(15, groupWidth * 0.22);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div>
        <h2 className="font-semibold text-white">
          {t('adminDashboard.volumeTitle')}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {t('adminDashboard.volumeDescription')}
        </p>
      </div>

      <div className="mt-5 flex gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-emerald-400" />
          {t('adminDashboard.conversions')}
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-violet-400" />
          {t('adminDashboard.translations')}
        </span>
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

            return (
              <line
                key={line}
                x1="48"
                x2="712"
                y1={y}
                y2={y}
                stroke="#263246"
                strokeDasharray="4 6"
              />
            );
          })}

          {data.map((day, index) => {
            const center =
              48 + groupWidth * index + groupWidth / 2;

            const conversions = Number(day.conversions) || 0;
            const translations = Number(day.translations) || 0;

            const conversionHeight =
              (conversions / maximum) * chartHeight;

            const translationHeight =
              (translations / maximum) * chartHeight;

            return (
              <g key={day.date}>
                <rect
                  x={center - barWidth - 2}
                  y={162 - conversionHeight}
                  width={barWidth}
                  height={Math.max(conversionHeight, conversions ? 2 : 0)}
                  rx="4"
                  fill={chartColors.conversions}
                >
                  <title>
                    {`${day.date}: ${t(
                      'adminDashboard.conversions'
                    )} ${conversions}`}
                  </title>
                </rect>

                <rect
                  x={center + 2}
                  y={162 - translationHeight}
                  width={barWidth}
                  height={Math.max(translationHeight, translations ? 2 : 0)}
                  rx="4"
                  fill={chartColors.translations}
                >
                  <title>
                    {`${day.date}: ${t(
                      'adminDashboard.translations'
                    )} ${translations}`}
                  </title>
                </rect>

                <text
                  x={center}
                  y="190"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                >
                  {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(
                    language,
                    {
                      weekday: 'short',
                      timeZone: 'UTC',
                    }
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ label, value, detail, icon, accent }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <div
        className={`absolute -right-7 -top-8 h-28 w-28 rounded-full blur-3xl ${accent}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {detail}
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-slate-950/70 text-slate-200">
          {icon}
        </span>
      </div>
    </section>
  );
}

// ==========================================
// STAT ICON
// ==========================================

function StatIcon({ path }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ==========================================
// MAIN ADMIN OVERVIEW
// ==========================================

export default function AdminOverview() {
  const { t, i18n } = useTranslation();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const language = i18n.resolvedLanguage || i18n.language || 'en';

  // ========================================
  // FETCH ADMIN STATISTICS
  // ========================================

  const fetchStats = useCallback(async () => {
    try {
      setError('');

      const { data } = await api.get('/admin/stats');

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid dashboard response');
      }

      setStats({
        ...data,

        today: {
          users: Number(data.today?.users) || 0,
          conversions: Number(data.today?.conversions) || 0,
          translations: Number(data.today?.translations) || 0,
        },

        activityByDay: Array.isArray(data.activityByDay)
          ? data.activityByDay
          : [],

        recentUsers: Array.isArray(data.recentUsers)
          ? data.recentUsers
          : [],
      });
    } catch (requestError) {
      const message = requestError.response?.data?.message;

      setError(
        message
          ? localizeError(message, t)
          : t('admin.loadError')
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ========================================
  // UPDATE USER ROLE
  // ========================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);

      await api.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      window.alert('User role updated successfully.');

      await fetchStats();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to update user role.';

      window.alert(message);

      // Restore the actual role from the server
      await fetchStats();
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ========================================
  // DELETE USER
  // ========================================

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        userName || 'this user'
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingUserId(userId);

      await api.delete(`/admin/users/${userId}`);

      window.alert('User deleted successfully.');

      await fetchStats();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to delete user.';

      window.alert(message);
    } finally {
      setDeletingUserId(null);
    }
  };

  // ========================================
  // FORMAT NUMBERS
  // ========================================

  const number = (value) =>
    (Number(value) || 0).toLocaleString(language);

  const todayActivity =
    (stats?.today?.conversions ?? 0) +
    (stats?.today?.translations ?? 0);

  // ========================================
  // STATISTICS CARDS
  // ========================================

  const statCards = [
    {
      key: 'userCount',
      label: 'totalUsers',
      value: stats ? number(stats.userCount) : '—',
      detail: t('adminDashboard.newUsersToday', {
        count: stats?.today?.users ?? 0,
      }),
      accent: 'bg-blue-500/15',
      icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m16-13a4 4 0 0 1 0 8m4 5v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    },
    {
      key: 'conversionCount',
      label: 'conversions',
      value: stats ? number(stats.conversionCount) : '—',
      detail: t('adminDashboard.conversionsToday', {
        count: stats?.today?.conversions ?? 0,
      }),
      accent: 'bg-emerald-500/15',
      icon: 'M12 3v12m0 0 4-4m-4 4-4-4m-4 7v2h16v-2',
    },
    {
      key: 'translationCount',
      label: 'translations',
      value: stats ? number(stats.translationCount) : '—',
      detail: t('adminDashboard.translationsToday', {
        count: stats?.today?.translations ?? 0,
      }),
      accent: 'bg-violet-500/15',
      icon: 'M4 5h16M4 10h10M4 15h6m4 5 4-8 4 8m-6-3h4',
    },
    {
      key: 'todayActivity',
      label: 'todayActivity',
      value: stats ? number(todayActivity) : '—',
      detail: t('adminDashboard.activityToday'),
      accent: 'bg-amber-500/15',
      icon: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    },
  ];

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-7">

      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-300">
            {t('admin.section')}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t('admin.title')}
          </h1>

          <p className="mt-2 text-slate-400">
            {t('admin.description')}
          </p>
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

      {/* ERROR MESSAGE */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          <div className="flex items-center justify-between gap-4">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchStats();
              }}
              className="shrink-0 font-medium text-rose-200 underline underline-offset-4 hover:text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* STAT CARDS */}

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

      {/* CHARTS */}

      {loading && !stats ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/80"
            />
          ))}
        </div>
      ) : stats?.activityByDay?.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
          <ActivityChart
            data={stats.activityByDay}
            t={t}
            language={language}
          />

          <VolumeChart
            data={stats.activityByDay}
            t={t}
            language={language}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
          <p className="text-sm text-slate-400">
            No activity data available.
          </p>
        </div>
      )}

      {/* RECENT USERS */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">

        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-semibold text-white">
              {t('admin.recentUsers')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t('admin.latestAccounts')}
            </p>
          </div>

          {stats && (
            <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-400">
              {t('adminDashboard.showingRecent', {
                count: stats.recentUsers.length,
              })}
            </span>
          )}
        </div>

        {/* LOADING */}

        {loading && !stats ? (
          <p className="p-6 text-sm text-slate-400">
            {t('admin.loadingAccounts')}
          </p>
        ) : !stats ? (
          <p className="p-6 text-sm text-slate-400">
            {t('admin.accountListUnavailable')}
          </p>
        ) : stats.recentUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">
            {t('admin.noAccounts')}
          </p>
        ) : (

          /* USERS TABLE */

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">

              <thead className="bg-slate-950/40 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">
                    {t('adminDashboard.user')}
                  </th>

                  <th className="px-5 py-3 font-medium">
                    {t('adminDashboard.role')}
                  </th>

                  <th className="px-5 py-3 font-medium">
                    {t('adminDashboard.joined')}
                  </th>

                  <th className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {stats.recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-800/30"
                  >

                    {/* USER INFORMATION */}

                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 text-xs font-semibold text-blue-200 ring-1 ring-white/5">
                          {(user.name || user.email || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-200">
                            {user.name || t('admin.unnamedAccount')}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE MANAGEMENT */}

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={
                          updatingUserId === user.id ||
                          deletingUserId === user.id
                        }
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        aria-label={`Change role for ${user.name || user.email}`}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 outline-none transition focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      {updatingUserId === user.id && (
                        <span className="ml-2 text-xs text-slate-500">
                          Saving...
                        </span>
                      )}
                    </td>

                    {/* JOINED DATE */}

                    <td className="px-5 py-4 text-slate-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            language,
                            { dateStyle: 'medium' }
                          )
                        : '—'}
                    </td>

                    {/* DELETE USER */}

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={
                          deletingUserId === user.id ||
                          updatingUserId === user.id
                        }
                        onClick={() =>
                          handleDeleteUser(
                            user.id,
                            user.name || user.email
                          )
                        }
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingUserId === user.id
                          ? 'Deleting...'
                          : 'Delete'}
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

