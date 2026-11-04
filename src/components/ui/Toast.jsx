import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Toast({ message, type = "success", onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: "border-emerald-400/20 bg-slate-900 text-emerald-100",
    error: "border-rose-400/20 bg-slate-900 text-rose-100",
    info: "border-emerald-400/20 bg-slate-900 text-emerald-100"
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl shadow-black/30 ${types[type]}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
        type === 'error' ? 'bg-rose-400/15 text-rose-300' : 'bg-emerald-400/15 text-emerald-300'
      }`}>
        {type === 'error' ? '!' : '✓'}
      </span>
      <p className="min-w-0 flex-1 leading-5">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.dismissNotification')}
        className="ml-auto -mr-1 -mt-1 rounded-md p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}