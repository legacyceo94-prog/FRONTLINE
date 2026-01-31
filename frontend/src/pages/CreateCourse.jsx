import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, SparklesIcon, RocketLaunchIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    price: '',
    duration: '',
    skillLevel: 'All Levels',
    flyerImage: '',
    curriculum: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
        if (res.data.role !== 'seller') {
          navigate('/marketplace');
        }
      } catch {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization Required: Sign in to broadcast assets.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const payload = {
        ...formData,
        type: user?.businessType || 'service',
        curriculum: formData.curriculum.split('\n').filter(item => item.trim() !== '') 
      };

      await api.post(`/api/courses`, payload, config);
      navigate('/marketplace');
    } catch (err) {
       console.error(err);
       setError(err.response?.data?.msg || 'Broadcast Interrupted: Protocol Error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-24 transition-colors duration-500 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header: Asset Calibration */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-500/10 text-[10px] font-black uppercase tracking-widest mb-6">
              <SparklesIcon className="w-4 h-4" />
              Asset Calibration Flow
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-6">
             Broadcast <span className="text-emerald-600">Competence.</span>
           </h1>
           <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic">
             Formalize your professional output into the global inventory stream.
           </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
              {user?.businessType === 'product' ? 'Product Specification' : 'Service Manifest'}
            </h2>
            <div className="flex items-center gap-2">
               {user?.businessType === 'product' ? <CubeIcon className="w-5 h-5 text-emerald-600" /> : <RocketLaunchIcon className="w-5 h-5 text-emerald-600" />}
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.businessType || 'Service'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            {/* Basic Info Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Identity Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="block w-full rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-5 px-6 font-bold italic"
                  placeholder={user?.businessType === 'product' ? "e.g. TR-900 Torque Regulator" : "e.g. Quantum Systems Architecture Consultation"}
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Network Sector</label>
                <select
                  name="category"
                  className="block w-full rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-5 px-6 font-bold italic appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Competence Level</label>
                <select
                  name="skillLevel"
                  className="block w-full rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-5 px-6 font-bold italic appearance-none cursor-pointer"
                  value={formData.skillLevel}
                  onChange={handleChange}
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Monetary Value (KES)</label>
                <input
                  type="number"
                  name="price"
                  required
                  className="block w-full rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-5 px-6 font-black text-xl text-emerald-600 italic"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={handleChange}
                />
              </div>
               <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                  {user?.businessType === 'product' ? 'Deployment / Stock' : 'Cycle Duration'}
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  className="block w-full rounded-2xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-5 px-6 font-bold italic"
                  placeholder={user?.businessType === 'product' ? "e.g. 5 Units in Stock" : "e.g. 4 Week Engagement"}
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Context Transmission */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Asset Mission (Description)</label>
              <textarea
                name="description"
                rows={4}
                required
                className="block w-full rounded-[2rem] border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-6 px-8 font-medium italic leading-relaxed"
                placeholder="Describe the value proposition of this asset..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Specifications Matrix */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                {user?.businessType === 'product' ? 'Technical Specs' : 'Service Roadmap'} (One per line)
              </label>
              <textarea
                name="curriculum"
                rows={4}
                className="block w-full rounded-[2rem] border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-emerald-500/30 transition-all py-6 px-8 font-medium italic leading-relaxed"
                placeholder={user?.businessType === 'product' ? "Performance: High Efficiency&#10;Material: Sustainable Poly&#10;Origin: Nairobi Hub" : "Phase 1: Initial Handshake&#10;Phase 2: Depth Analysis&#10;Phase 3: Final Deployment"}
                value={formData.curriculum}
                onChange={handleChange}
              />
            </div>

            {/* Visual Signal (Flyer) */}
             <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Visual Transmission (Flyer)</label>
              <div className="mt-2 flex flex-col md:flex-row items-center gap-8">
                <label className="w-full h-40 flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer transition-all group/upload">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover/upload:bg-emerald-600 group-hover/upload:text-white transition-all shadow-lg shadow-black/5">
                     <PhotoIcon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/upload:text-emerald-600 transition-colors">
                    {formData.flyerImage ? 'Signal Captured ✓' : 'Upload Broadcast Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, flyerImage: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {formData.flyerImage && (
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/20 flex-shrink-0 animate-in fade-in zoom-in-95 duration-500">
                    <img src={formData.flyerImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              <p className="mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest italic text-center md:text-left">Upload your high-fidelity pricing asset (MAX 5MB)</p>
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Initiate Broadcast'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
