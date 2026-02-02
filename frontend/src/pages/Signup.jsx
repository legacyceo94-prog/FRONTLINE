import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('role', res.data.user.role || 'user');
      
      if (res.data.user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/communities');
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const userBtnClass = `py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    formData.role === 'user' 
      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl' 
      : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'
  }`;

  const sellerBtnClass = `py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    formData.role === 'seller' 
      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl' 
      : 'text-slate-500 dark:text-slate-500 hover:text-slate-700'
  }`;

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden py-24">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10 p-6 md:p-4">
        
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/5 p-10 sm:p-12">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mb-6 shadow-inner">
               <SparklesIcon className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">
              Join <span className="text-blue-600">Frontline.</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">
              Plug into the premier social commerce network.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div className="group">
               <input
                type="text"
                name="username"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold italic"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold italic"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={userBtnClass}
              >
                I want to be a Buyer
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'seller'})}
                className={sellerBtnClass}
              >
                I want to be a Seller
              </button>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold italic pr-12"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Initializing...' : 'Join the Network'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Identity already active?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
