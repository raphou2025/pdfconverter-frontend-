import { formatDate } from '../../utils/formatDate';
import { useTranslation } from 'react-i18next';

export default function HistoryTable({ data }) {
  const { t, i18n } = useTranslation();

  if (!data || data.length === 0) {
    return <p className="text-gray-500 p-4">{t('history.emptyTitle')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-gray-400 text-sm">
          <tr>
            <th className="p-4 rounded-tl-lg">{t('history.fileName')}</th>
            <th className="p-4">{t('history.format')}</th>
            <th className="p-4">{t('history.date')}</th>
            <th className="p-4">{t('history.status')}</th>
            <th className="p-4 rounded-tr-lg">{t('history.result')}</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-900/50 transition">
              <td className="p-4 truncate max-w-xs">{item.originalFileName}</td>
              <td className="p-4 text-gray-400">{item.outputFormat?.toUpperCase() || "N/A"}</td>
              <td className="p-4 text-gray-400">{formatDate(item.createdAt, i18n.resolvedLanguage)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                    item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'}`}>
                  {t(`history.${item.status}`, { defaultValue: item.status })}
                </span>
              </td>
              <td className="p-4">
                {item.status === 'completed' && (
                  <a href={item.outputUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    {t('common.download')}
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}