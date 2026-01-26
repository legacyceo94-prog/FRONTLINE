import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
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

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-hidden py-12">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10 p-4">
        
        {/* Glass Card */}
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 sm:p-12">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-4">
               <SparklesIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Join the premier social commerce network
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username */}
            <div>
               <input
                type="text"
                name="username"
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
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
                className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  formData.role === 'user' 
                  ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                I want to Buy
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'seller'})}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  formData.role === 'seller' 
                  ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                I want to Sell
              </button>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium pr-12"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-lg shadow-xl shadow-primary-500/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Already a member?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
