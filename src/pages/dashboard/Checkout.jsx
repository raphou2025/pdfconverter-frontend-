import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export default function Checkout() {
  const navigate = useNavigate();
  const notify = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 🚨 SIMULATE STRIPE PAYMENT
    setTimeout(() => {
      setIsProcessing(false);
      notify('Payment successful! Welcome to PRO.', 'success');
      // In a real app, you would update the user's role to 'PRO' in the database here.
      // Then navigate them back to the dashboard.
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition text-sm font-medium"
      >
        ← Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Payment Form */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
          <p className="text-slate-400 mb-8">You are one step away from unlocking PRO features.</p>

          <form onSubmit={handlePayment} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Credit or Debit Card</p>
                <p className="text-xs text-slate-500">Powered by Stripe (Mock)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                <input type="text" placeholder="MM / YY" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
                <input type="text" placeholder="123" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
              <input type="text" placeholder="John Doe" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
            </div>

            <Button type="submit" isLoading={isProcessing} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3">
              Pay $9.00
            </Button>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:w-80">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 border-b border-slate-800 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">PRO Plan (Monthly)</span>
                <span className="text-white">$9.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-300 font-medium">Total Due</span>
              <span className="text-2xl font-bold text-white">$9.00</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-amber-400">
                Cancel anytime. No hidden fees. Secure 256-bit encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}