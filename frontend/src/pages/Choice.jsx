import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  BuildingStorefrontIcon, 
  BriefcaseIcon, 
  RocketLaunchIcon,
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
      
      // Update local storage to trigger immediate re-renders if needed
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 pt-24 transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-xl">
           Divergent Engine Initialization
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase mb-6">
          Initialize Your <br />
          <span className="text-primary-600">Frontline Identity.</span>
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
          The network has recognized your status. Now, choose the specialized operating system that fits your professional pulse.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Option 1: Service Studio */}
          <div 
            onClick={() => !loading && handleChoice('service')}
            className={`group relative bg-white dark:bg-slate-800 rounded-[3rem] p-10 border-2 border-slate-100 dark:border-slate-700 hover:border-primary-500 transition-all cursor-pointer text-left shadow-2xl hover:-translate-y-2 ${loading ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="absolute top-6 right-8 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic group-hover:text-primary-500 transition-colors">Path 01</div>
            <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-8 border border-primary-200 dark:border-primary-800 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-lg">
               <BriefcaseIcon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Service Studio</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              Designed for **Experts, Tutors, and Consultants**. formalize your time and knowledge into scalable Expert Bundles.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               {['Curriculum', 'Consultation', 'Expert Assets'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </div>

          {/* Option 2: Product Store */}
          <div 
            onClick={() => !loading && handleChoice('product')}
            className={`group relative bg-white dark:bg-slate-800 rounded-[3rem] p-10 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all cursor-pointer text-left shadow-2xl hover:-translate-y-2 ${loading ? 'opacity-50 grayscale' : ''}`}
          >
            <div className="absolute top-6 right-8 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic group-hover:text-indigo-500 transition-colors">Path 02</div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-8 border border-indigo-200 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
               <BuildingStorefrontIcon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Product Store</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              Designed for **Merchants and Retailers**. Scale your physical or digital inventory through high-velocity Stores.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
               {['Inventory', 'Shipping Hubs', 'Warehouse'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{tag}</span>
               ))}
            </div>
          </div>

        </div>

        <div className="mt-16 flex items-center justify-center gap-3 text-slate-400 font-medium italic">
           <ShieldCheckIcon className="w-5 h-5" />
           Your choice will permanently calibrate your cockpit terminologies and tools.
        </div>
      </div>
    </div>
  );
}
