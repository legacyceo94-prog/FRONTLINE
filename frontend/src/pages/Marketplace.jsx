import { useState, useEffect } from 'react';
import api from '../utils/api';
import { MagnifyingGlassIcon, FunnelIcon, CubeIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';

export default function Marketplace() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '' // Service or Product
  });

  const categories = ['Engineering', 'Design', 'Technology', 'Business', 'Other'];

  const studioInsights = {
    '': 'Scanning the Global Stream: A cross-pollination of professional services and performance products.',
    'service': 'Service Studio Hub: Accessing elite competence, consultations, and scalable labor solutions.',
    'product': 'Product Store Hub: Procuring verified assets, physical components, and digital blueprints.'
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.type) params.append('type', filters.type);

        const res = await api.get(`/api/courses?${params.toString()}`);
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
     setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-32 transition-colors duration-500 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header & Internal Scanning Matrix */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/10">
                  <SparklesIcon className="w-4 h-4" />
                  Inventory Scan Protocol
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter italic uppercase leading-[0.8]">
                 Scan <span className="text-emerald-600">Assets.</span>
               </h1>
               <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium italic">
                 {studioInsights[filters.type]}
               </p>
            </div>

            {/* Studio Toggle: Affirmative Choice */}
            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-white/5 flex gap-2 shadow-inner">
               <button 
                 onClick={() => handleFilterChange('type', '')}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.type === '' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Global Stream
               </button>
               <button 
                 onClick={() => handleFilterChange('type', 'service')}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filters.type === 'service' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <RocketLaunchIcon className="w-4 h-4" />
                 Service Studio
               </button>
               <button 
                 onClick={() => handleFilterChange('type', 'product')}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filters.type === 'product' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <CubeIcon className="w-4 h-4" />
                 Product Store
               </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Engine */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-600">
                <MagnifyingGlassIcon className="h-6 w-6 text-slate-300 dark:text-slate-700" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-16 pr-6 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm font-bold shadow-xl shadow-slate-200/50 dark:shadow-none"
                placeholder="Synchronize with Sellers, Skills, or Results..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select 
                className="block w-full lg:w-64 px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer shadow-xl shadow-slate-200/50 dark:shadow-none"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Category Nodes</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                 <FunnelIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Stream */}
        {loading ? (
             <div className="text-center py-32">
               <div className="w-16 h-16 border-b-2 border-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Network Inventory...</p>
             </div>
        ) : (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-white/5 animate-in fade-in duration-700">
                <FunnelIcon className="mx-auto h-16 w-16 text-slate-200 dark:text-slate-800 mb-6" />
                <h3 className="text-3xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter italic">Signal Lost: No Matches Located</h3>
                <p className="mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Try recalibrating your search parameters to find available assets.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
