import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post(""/api/auth/forgot-password`, { email });
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-bold text-sm">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">Recover Access</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Lost your cockpit key? Enter your email to receive a recovery link.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 group-focus-within:text-primary-500 transition-colors">
                  Registered Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold placeholder:italic"
                    placeholder="name@mombasa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 dark:bg-primary-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Send Recovery Link'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 italic">
               The "Forgot Password" system is a community safety-net to protect your earned Trust Score.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
