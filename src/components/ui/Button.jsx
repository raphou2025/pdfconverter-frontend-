import { useTranslation } from 'react-i18next';

export default function Button({ children, onClick, type = "button", variant = "primary", isLoading, disabled = false, className = "" }) {
  const { t } = useTranslation();
  const baseStyle = "px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400",
    outline: "border border-slate-700 text-white hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {isLoading ? t('common.loading') : children}
    </button>
  );
}