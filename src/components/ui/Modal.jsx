import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleEscape);
    
    return () => window.removeEventListener('keydown', handleEscape);

  }, [isOpen, onClose]);

   if (!isOpen) return null;

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
       <div
         className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
         onClick={onClose}
         aria-hidden="true"
       />
       <div
         role="dialog"
         aria-modal="true"
         aria-label={title}
         className="relative my-auto w-full max-w-[400px] rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:p-8"
       >
         <button
             type="button"
             onClick={onClose}
             className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
             aria-label="Close modal"
           >
             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
             </svg>
         </button>
         {children}
       </div>
     </div>
   );
}
