import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // Need v2 icons

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-fill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem('token', res.data.token);
      storage.setItem('username', res.data.user.username);
      storage.setItem('userId', res.data.user.id);
      storage.setItem('role', res.data.user.role || 'user');
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if (res.data.user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/communities');
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
      
      {/* Futuristic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full relative z-10 p-8 sm:p-10">
        
        {/* Glass Card */}
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 sm:p-12 transform transition-all hover:scale-[1.01]">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Access your competence portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 ml-1 group-focus-within:text-primary-500 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
               <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 ml-1 group-focus-within:text-primary-500 transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" size="sm" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 cursor-pointer">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 text-white font-bold text-lg shadow-lg shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Signing In...</span>
              ) : (
                <>
                  Sign In <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline">
              Join the future
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
