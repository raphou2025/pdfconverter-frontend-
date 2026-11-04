import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { formatBytes } from '../../utils/formatBytes';
import { localizeError } from '../../utils/localizeError';

const USER_PAGE_SIZE = 20;

const formatUptime = (seconds, t) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return t('adminMonitoring.uptimeValue', { days, hours, minutes });
};

const MetricCard = ({ label, value, detail }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
    <p className="text-sm font-medium text-slate-400">{label}</p>
    <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{value}</p>
    {detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}
  </section>
);

export default function AdminMonitor() {
  const { t, i18n } = useTranslation();
  const [monitoring, setMonitoring] = useState(null);
  const [monitoringError, setMonitoringError] = useState('');
  const [users, setUsers] = useState(null);
  const [usersError, setUsersError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const { data } = await api.get('/admin/monitoring');
        if (active) {
          setMonitoring(data);
          setMonitoringError('');
        }
      } catch (error) {
        if (active) {
          setMonitoringError(error.response?.data?.message
            ? localizeError(error.response.data.message, t)
            : t('adminMonitoring.monitoringLoadFailed'));
        }
      }
    };

    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [t]);

  useEffect(() => {
    let active = true;
    api.get('/admin/users', { params: { page, pageSize: USER_PAGE_SIZE } })
      .then(({ data }) => {
        if (active) {
          setUsers(data);
          setUsersError('');
        }
      })
      .catch((error) => {
        if (active) {
          setUsersError(error.response?.data?.message
            ? localizeError(error.response.data.message, t)
            : t('adminMonitoring.userListLoadFailed'));
        }
      });

    return () => {
      active = false;
    };
  }, [page, t]);

  const memory = monitoring?.system.memory;
  const processMemory = monitoring?.system.processMemory;
  const totalPages = users ? Math.max(1, Math.ceil(users.total / users.pageSize)) : 1;

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-300">{t('admin.section')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('adminMonitoring.title')}</h1>
        <p className="mt-2 text-slate-400">{t('adminMonitoring.description')}</p>
        {monitoring?.sampledAt && (
          <p className="mt-2 text-xs text-slate-500">
            {t('adminMonitoring.lastUpdated', {
              time: new Date(monitoring.sampledAt).toLocaleTimeString(i18n.resolvedLanguage)
            })}
          </p>
        )}
      </div>

      {monitoringError && (
        <p role="alert" className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
          {monitoringError}
        </p>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">{t('adminMonitoring.systemHealth')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t('adminMonitoring.apiStatus')}
            value={monitoring ? t('adminMonitoring.online') : '—'}
            detail={monitoring ? t('adminMonitoring.uptime', { value: formatUptime(monitoring.uptimeSeconds, t) }) : ''}
          />
          <MetricCard
            label={t('adminMonitoring.cpuUsage')}
            value={monitoring ? `${monitoring.system.cpuUsagePercent.toFixed(1)}%` : '—'}
            detail={t('adminMonitoring.cpuDescription')}
          />
          <MetricCard
            label={t('adminMonitoring.systemMemory')}
            value={memory ? `${memory.usedPercent.toFixed(1)}%` : '—'}
            detail={memory ? t('adminMonitoring.memoryUsed', {
              used: formatBytes(memory.usedBytes),
              total: formatBytes(memory.totalBytes)
            }) : ''}
          />
          <MetricCard
            label={t('adminMonitoring.processMemory')}
            value={processMemory ? formatBytes(processMemory.rss) : '—'}
            detail={processMemory ? t('adminMonitoring.heapUsed', {
              used: formatBytes(processMemory.heapUsed),
              total: formatBytes(processMemory.heapTotal)
            }) : ''}
          />
          <MetricCard
            label={t('adminMonitoring.database')}
            value={monitoring ? t(`adminMonitoring.databaseStatus.${monitoring.database.status}`) : '—'}
            detail={monitoring?.database.responseTimeMs !== null && monitoring?.database.responseTimeMs !== undefined
              ? t('adminMonitoring.databaseResponse', { value: monitoring.database.responseTimeMs })
              : ''}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">{t('adminMonitoring.traffic')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t('adminMonitoring.requestsPerSecond')}
            value={monitoring ? monitoring.traffic.requestsPerSecond.toLocaleString(i18n.resolvedLanguage) : '—'}
            detail={t('adminMonitoring.lastMinuteRequests', { count: monitoring?.traffic.requestsLastMinute ?? 0 })}
          />
          <MetricCard
            label={t('adminMonitoring.averageLatency')}
            value={monitoring ? t('adminMonitoring.milliseconds', { value: monitoring.traffic.averageLatencyMs }) : '—'}
            detail={t('adminMonitoring.lastMinute')}
          />
          <MetricCard
            label={t('adminMonitoring.serverErrors')}
            value={monitoring ? monitoring.traffic.errorsLastMinute.toLocaleString(i18n.resolvedLanguage) : '—'}
            detail={t('adminMonitoring.errorsSinceStart', { count: monitoring?.traffic.errorsSinceStart ?? 0 })}
          />
          <MetricCard
            label={t('adminMonitoring.totalRequests')}
            value={monitoring ? monitoring.traffic.requestsSinceStart.toLocaleString(i18n.resolvedLanguage) : '—'}
            detail={t('adminMonitoring.sinceRestart')}
          />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-white">{t('adminMonitoring.recentErrors')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('adminMonitoring.recentErrorsDescription')}</p>
        </div>
        {!monitoring ? (
          <p className="p-6 text-sm text-slate-400">{t('common.loading')}</p>
        ) : monitoring.recentErrors.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">{t('adminMonitoring.noRecentErrors')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">{t('adminMonitoring.time')}</th>
                  <th className="px-5 py-3 font-medium">{t('adminMonitoring.request')}</th>
                  <th className="px-5 py-3 font-medium">{t('adminMonitoring.statusCode')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {monitoring.recentErrors.map((error, index) => (
                  <tr key={`${error.timestamp}-${index}`}>
                    <td className="px-5 py-4 text-slate-400 sm:px-6">
                      {new Date(error.timestamp).toLocaleString(i18n.resolvedLanguage)}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-300">{error.method} {error.route}</td>
                    <td className="px-5 py-4 text-rose-300">{error.statusCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-white">{t('adminMonitoring.users')}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {users ? t('adminMonitoring.userCount', { count: users.total }) : t('common.loading')}
          </p>
        </div>
        {usersError && <p role="alert" className="p-6 text-sm text-rose-300">{usersError}</p>}
        {!users && !usersError ? (
          <p className="p-6 text-sm text-slate-400">{t('common.loading')}</p>
        ) : users && users.users.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">{t('admin.noAccounts')}</p>
        ) : users && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium sm:px-6">{t('adminMonitoring.user')}</th>
                    <th className="px-5 py-3 font-medium">{t('adminMonitoring.role')}</th>
                    <th className="px-5 py-3 font-medium">{t('adminMonitoring.language')}</th>
                    <th className="px-5 py-3 font-medium">{t('adminMonitoring.activity')}</th>
                    <th className="px-5 py-3 font-medium">{t('adminMonitoring.joined')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4 sm:px-6">
                        <p className="font-medium text-slate-200">{user.name || t('admin.unnamedAccount')}</p>
                        <p className="mt-1 text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {user.role === 'ADMIN' ? t('admin.adminRole') : t('admin.userRole')}
                      </td>
                      <td className="px-5 py-4 text-slate-400">{t(`common.${user.preferredLanguage === 'km' ? 'khmer' : 'english'}`)}</td>
                      <td className="px-5 py-4 text-slate-400">
                        {t('adminMonitoring.activityCounts', {
                          conversions: user.conversionCount,
                          translations: user.translationCount
                        })}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString(i18n.resolvedLanguage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-500">
                {t('adminMonitoring.page', { page, total: totalPages })}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('adminMonitoring.previous')}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('adminMonitoring.next')}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
