import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Recovery link invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 sm:p-12">
          {success ? (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="w-12 h-12 text-green-500" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Reset Successful</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                 Your cockpit key has been updated. Calibrating your login...
               </p>
               <Link to="/login" className="text-sm font-black text-primary-600 uppercase tracking-widest hover:underline">
                 Manual Redirect
               </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                   <LockClosedIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">New Identity Key</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Establish a secure new password for your professional account.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="group relative">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 group-focus-within:text-primary-500 transition-colors">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full pl-5 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                      >
                       {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 group-focus-within:text-primary-500 transition-colors">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50"
                >
                  {loading ? 'Re-keying...' : 'Update & Login'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
