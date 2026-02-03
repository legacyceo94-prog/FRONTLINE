import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, ShieldCheckIcon, RocketLaunchIcon, CubeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

export default function SyncModal({ isOpen, onClose, course }) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('Inquiry');
  const [step, setStep] = useState(1); // 1: Form, 2: Logging, 3: Contact
  
  // DRIVEN CALCULATION: Derived auth status eliminates cascading renders
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuth = !!token;

  const handleSync = async () => {
    if (!isAuth) {
       navigate('/login');
       return;
    }

    setStep(2);
    try {
      // Log the Handshake in the structural layer
      await api.post('/api/connections', {
        sellerId: course.seller?._id,
        itemId: course._id,
        purpose
      });
      
      setTimeout(() => {
        setStep(3);
      }, 1500); // Simulated "logging" for UX impact
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
         // App will reload via api.js interceptor
         return;
      }
      setStep(1);
      alert("Sync Protocol Interrupted. Please check connectivity.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <ShieldCheckIcon className="w-6 h-6" />
             </div>
             <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-xl">Sync Protocol</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Structural Node Connection</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-10">
          {!isAuth ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4">
               <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-blue-500">
                  <LockClosedIcon className="w-10 h-10" />
               </div>
               <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">Login Required.</h4>
               <p className="text-xs text-slate-500 italic mb-10">You must be a verified buyer to sync with sellers.</p>
               
               <button 
                 onClick={() => navigate('/login')}
                 className="block w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
               >
                 Go to Login Protocol
               </button>
            </div>
          ) : step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="mb-8">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4">Verification Layer</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic mb-6">
                  Initialize a recorded handshake for the asset: <span className="text-slate-900 dark:text-white font-black uppercase tracking-tight italic">"{course.title}"</span>
                </p>
                
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Protocol Purpose</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Inquiry', 'Purchase', 'Technical Support', 'Custom Request'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${purpose === p ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 hover:text-slate-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSync}
                className="w-full py-5 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                Authenticate Handshake
              </button>
            </div>
          ) : null}

          {step === 2 && (
            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
               <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
               <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Logging Handshake Protocol...</h4>
               <p className="text-xs text-slate-500 italic mt-4">Structural records update in progress.</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4">
               <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <ShieldCheckIcon className="w-10 h-10 text-green-500" />
               </div>
               <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">Protocol Verified.</h4>
               <p className="text-xs text-slate-500 italic mb-10">Connectivity established via Imperial Network Sync.</p>
               
               <a 
                 href={`https://wa.me/${course.seller.sellerProfile.phone.replace(/\D/g, '').replace(/^0/, '254')}?text=${encodeURIComponent(`Sync Protocol Verified [${purpose}]: Checking on "${course.title}" status.`)}`}
                 target="_blank"
                 rel="noreferrer"
                 className="block w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 active:scale-95"
               >
                 Launch Live Connection
               </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
