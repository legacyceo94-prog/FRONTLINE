import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/login', { username, password });
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem('token', res.data.token);
      storage.setItem('username', res.data.user.username);
      storage.setItem('email', res.data.user.email);
      storage.setItem('userId', res.data.user.id);
      storage.setItem('role', res.data.user.role || 'user');
      
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      if (res.data.user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/communities');
      }
      window.location.reload();
    } catch (err) {
      const errorMsg = 
        err.response?.data?.errors?.[0]?.msg || 
        err.response?.data?.msg || 
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message || 
        'Login Failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden py-24">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full relative z-10 p-6 md:p-10">
        
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/5 p-10 sm:p-12 hover:border-blue-500/20 transition-all">
          
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mb-6 shadow-inner">
               <ArrowRightIcon className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">
              Welcome <span className="text-blue-600">Back.</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">
              Log in to your account.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username Input */}
            <div className="group">
              <input
                type="text"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold italic"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-bold italic pr-12"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-transparent" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Stay Active</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-blue-600 hover:text-blue-500 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse italic">Logging in...</span>
              ) : (
                <>
                  Login <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            New to the Frontline? {' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
