import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BuildingStorefrontIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Choice() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'seller') {
      navigate('/communities');
    }
  }, [navigate]);

  const handleChoice = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/auth/upgrade', { businessType: type }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.setItem('businessType', type);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 pt-24 transition-colors duration-500 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-blue-500/20 shadow-xl shadow-blue-500/5">
           Account Setup
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase mb-8">
          Set Up <br />
          <span className="text-blue-600">Your Account.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed italic">
          Choose your business type.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Option 1: Service Studio */}
          <div 
            onClick={() => !loading && handleChoice('service')}
            className={`group relative bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all cursor-pointer text-left shadow-2xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 active:scale-95 duration-500 ${loading ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="absolute top-8 right-10 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic group-hover:text-blue-500 transition-colors">Path 01</div>
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-950 text-blue-600 flex items-center justify-center mb-10 border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-500/5">
               <BriefcaseIcon className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Services</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed italic">
              For technicians, tutors, and consultants. Offer your skills as services.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               {['Curriculum', 'Consultation', 'Assets'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-full text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </div>

          {/* Option 2: Product Studio */}
          <div 
            onClick={() => !loading && handleChoice('product')}
            className={`group relative bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all cursor-pointer text-left shadow-2xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 active:scale-95 duration-500 ${loading ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="absolute top-8 right-10 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic group-hover:text-blue-500 transition-colors">Path 02</div>
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-950 text-blue-600 flex items-center justify-center mb-10 border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-500/5">
               <BuildingStorefrontIcon className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Products</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed italic">
              For merchants and retailers. Sell physical or digital items.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               {['Inventory', 'Logistics', 'Warehouse'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-full text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </div>

        </div>

        <div className="mt-16 flex items-center justify-center gap-3 text-slate-400 font-black uppercase tracking-widest text-[9px] italic animate-pulse">
           <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
           This choice sets up your dashboard tools.
        </div>
      </div>
    </div>
  );
}
