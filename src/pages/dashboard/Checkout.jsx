// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../components/ui/Button';
// import { useNotification } from '../../context/NotificationContext';

// export default function Checkout() {
//   const navigate = useNavigate();
//   const notify = useNotification();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handlePayment = (e) => {
//     e.preventDefault();
//     setIsProcessing(true);
    
//     // 🚨 SIMULATE STRIPE PAYMENT
//     setTimeout(() => {
//       setIsProcessing(false);
//       notify('Payment successful! Welcome to PRO.', 'success');
//       // In a real app, you would update the user's role to 'PRO' in the database here.
//       // Then navigate them back to the dashboard.
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1500);
//     }, 2000);
//   };

//   return (
//     <div className="p-4 sm:p-8 max-w-4xl mx-auto">
//       <button 
//         onClick={() => navigate(-1)} 
//         className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition text-sm font-medium"
//       >
//         ← Back
//       </button>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* LEFT: Payment Form */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
//           <p className="text-slate-400 mb-8">You are one step away from unlocking PRO features.</p>

//           <form onSubmit={handlePayment} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
//             <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
//               <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-white font-medium">Credit or Debit Card</p>
//                 <p className="text-xs text-slate-500">Powered by Stripe (Mock)</p>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
//               <input type="text" placeholder="0000 0000 0000 0000" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
//                 <input type="text" placeholder="MM / YY" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">CVC</label>
//                 <input type="text" placeholder="123" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-300 mb-2">Cardholder Name</label>
//               <input type="text" placeholder="John Doe" required className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
//             </div>

//             <Button type="submit" isLoading={isProcessing} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3">
//               Pay $9.00
//             </Button>
//           </form>
//         </div>

//         {/* RIGHT: Order Summary */}
//         <div className="lg:w-80">
//           <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sticky top-24">
//             <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
            
//             <div className="space-y-3 mb-6 border-b border-slate-800 pb-6">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">PRO Plan (Monthly)</span>
//                 <span className="text-white">$9.00</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Tax</span>
//                 <span className="text-white">$0.00</span>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mb-6">
//               <span className="text-slate-300 font-medium">Total Due</span>
//               <span className="text-2xl font-bold text-white">$9.00</span>
//             </div>

//             <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
//               <p className="text-sm text-amber-400">
//                 Cancel anytime. No hidden fees. Secure 256-bit encryption.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import abaLogo from '../../assets/images/Bank-logo/ABA.jpg';
import acledaLogo from '../../assets/images/Bank-logo/acleda.png';
import alipayLogo from '../../assets/images/Bank-logo/alipay.png';
import visaLogo from '../../assets/images/Bank-logo/visa.png';
import wechatLogo from '../../assets/images/Bank-logo/wechat.png';
import wingLogo from '../../assets/images/Bank-logo/wing.jpg';

export default function Checkout() {
  const navigate = useNavigate();
  const notify = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🚨 State for selections
  const [paymentMethod, setPaymentMethod] = useState('aba');
  const [contactMethod, setContactMethod] = useState('phone');

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      notify('Payment successful! Welcome to PRO.', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };

  // Payment method logos are imported so Vite can bundle them.
  const paymentMethods = [
    { id: 'aba', name: 'ABA KHQR', desc: 'Scan to pay with any banking app', logo: abaLogo },
    { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, JCB', logo: visaLogo },
    { id: 'acleda', name: 'ACLEDA PAY', desc: 'Pay securely with ACLEDA.', logo: acledaLogo },
    { id: 'wing', name: 'Wing Bank', desc: 'Pay securely with WingPay', logo: wingLogo },
    { id: 'alipay', name: 'Alipay', desc: 'Scan to pay with Alipay', logo: alipayLogo },
    { id: 'wechat', name: 'WeChat', desc: 'Scan to pay with WeChat', logo: wechatLogo },
  ];

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

          <form onSubmit={handlePayment} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
            
            {/* 🚨 Payment Methods Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label 
                    key={method.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    {/* Custom Radio Circle */}
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      paymentMethod === method.id ? 'border-blue-500' : 'border-slate-600'
                    }`}>
                      {paymentMethod === method.id && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                    </div>
                    
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden" 
                    />

                    {/* Logo Container */}
                    <div className="h-10 w-14 shrink-0 rounded bg-white flex items-center justify-center overflow-hidden p-1">
                      <img src={method.logo} alt={method.name} className="h-full w-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-white">{method.name}</p>
                      <p className="text-xs text-slate-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 🚨 Contact Information Section */}
            <div className="border-t border-slate-800 pt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              
              <div className="flex gap-3 mb-6">
                {/* Phone Prefix */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 shrink-0">
                  <img src="/payment-logos/cambodia.png" alt="KH" className="h-4 w-6 object-cover rounded-sm" onError={(e) => e.target.style.display = 'none'} />
                  <span className="text-white text-sm">+855</span>
                </div>
                <input type="tel" placeholder="Enter contact" required className="flex-1 bg-slate-950 text-white p-3 rounded-lg border border-slate-800 focus:border-blue-500 outline-none" />
              </div>

              {/* Contact Method Radios */}
              <div className="space-y-2">
                {['PHONE CALL', 'TELEGRAM', 'WHATSAPP'].map((method) => (
                  <label key={method} className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-slate-800/50 transition border border-transparent hover:border-slate-800">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      contactMethod === method ? 'border-blue-500' : 'border-slate-600'
                    }`}>
                      {contactMethod === method && <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value={method}
                      checked={contactMethod === method}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="hidden" 
                    />
                    <span className="text-sm font-semibold text-slate-200 tracking-wide">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" isLoading={isProcessing} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 mt-4">
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