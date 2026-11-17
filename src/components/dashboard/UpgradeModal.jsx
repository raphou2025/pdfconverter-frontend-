import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom'; // 🚨 Import navigation

export default function UpgradeModal({ isOpen, onClose, featureName }) {
  const navigate = useNavigate(); // 🚨 Initialize navigation

  const handleUpgradeClick = () => {
    onClose(); // Close the modal first
    navigate('/dashboard/checkout'); // 🚨 Redirect to the Checkout page
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Pro" tone="dashboard">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          Unlock {featureName || 'Premium Features'}
        </h3>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          This feature requires a Pro plan. Upgrade now to unlock all premium conversion tools, larger file sizes, and unlimited usage.
        </p>

        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 font-semibold text-slate-900 dark:text-white">Pro Plan Includes:</p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span> PDF to Word & Word to PDF
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span> Unlimited file conversions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span> Files up to 50MB
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-950/25 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleUpgradeClick} // 🚨 Trigger the redirect
          >
            Upgrade for $9/month
          </Button>
          <button 
            onClick={onClose} 
            className="py-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Maybe later
          </button>
        </div>
      </div>
    </Modal>
  );
}