import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// 🚨 Changed to default export
export default function ToastUI({ message, type = "success" }) {
  const { t } = useTranslation();
  
  const types = {
    success: "border-emerald-400/20 bg-slate-900 text-emerald-100",
    error: "border-rose-400/20 bg-slate-900 text-rose-100",
    info: "border-emerald-400/20 bg-slate-900 text-emerald-100"
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl shadow-black/30 max-w-sm ${types[type]}`}>
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
        type === 'error' ? 'bg-rose-400/15 text-rose-300' : 'bg-emerald-400/15 text-emerald-300'
      }`}>
        {type === 'error' ? '!' : '✓'}
      </span>
      <p className="min-w-0 flex-1 leading-5">{message}</p>
    </div>
  );
}

// 🚨 Keep these named exports
export const showToast = (message, type = 'success') => {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} transition-all`}>
      <ToastUI message={message} type={type} />
    </div>
  ), {
    duration: 3000,
    position: 'top-right',
  });
};

export function ToastContainer() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      }}
    />
  );
}