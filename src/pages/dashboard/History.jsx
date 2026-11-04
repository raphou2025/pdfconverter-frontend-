import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import { localizeError } from '../../utils/localizeError';

export default function History() {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/files/history');
        setHistory(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message
          ? localizeError(requestError.response.data.message, t)
          : t('history.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-300">{t('history.activity')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('history.title')}</h1>
        <p className="mt-2 text-slate-400">{t('history.description')}</p>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-white">{t('history.recent')}</h2>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-slate-400">{t('history.loading')}</p>
        ) : error ? (
          <p role="alert" className="p-6 text-sm text-rose-300">{error}</p>
        ) : history.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-200">{t('history.emptyTitle')}</p>
            <p className="mt-2 text-sm text-slate-500">{t('history.emptyDescription')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">{t('history.fileName')}</th>
                  <th className="px-5 py-3 font-medium">{t('history.format')}</th>
                  <th className="px-5 py-3 font-medium">{t('history.date')}</th>
                  <th className="px-5 py-3 font-medium">{t('history.status')}</th>
                  <th className="px-5 py-3 font-medium">{t('history.result')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="max-w-xs truncate px-5 py-4 font-medium text-slate-200 sm:px-6">{item.originalFileName}</td>
                    <td className="px-5 py-4 text-slate-400">{item.outputFormat?.toUpperCase() || '—'}</td>
                    <td className="px-5 py-4 text-slate-400">{new Date(item.createdAt).toLocaleDateString(i18n.resolvedLanguage)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : item.status === 'processing' || item.status === 'pending'
                            ? 'bg-amber-400/10 text-amber-300'
                            : 'bg-rose-400/10 text-rose-300'
                      }`}>
                        {t(`history.${item.status}`, { defaultValue: item.status })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {item.outputUrl && item.outputFormat === 'txt' ? (
                        <a href={item.outputUrl} download className="font-medium text-blue-300 hover:text-blue-200">
                          {t('common.download')}
                        </a>
                      ) : <span className="text-slate-600">{t('history.textUnavailable')}</span>}
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
