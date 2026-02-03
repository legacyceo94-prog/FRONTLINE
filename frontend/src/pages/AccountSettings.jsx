import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
        setBio(res.data.sellerProfile?.bio || '');
        setPhone(res.data.sellerProfile?.phone || '');
        setLocation(res.data.location || '');
      } catch (err) {
        console.error("Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('profileImage', reader.result);
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBecomeSeller = async (type) => {
    const typeLabel = type === 'service' ? 'Service Studio' : 'Product Store';
    if (window.confirm(`Launch your ${typeLabel}? You'll get access to tailored cockpit tools.`)) {
      try {
        const token = localStorage.getItem('token');
        
        await api.post(`/api/auth/upgrade`, { businessType: type }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        localStorage.setItem('role', 'seller');
        alert(`✅ ${typeLabel} Created! Opening your dashboard...`);
        window.location.reload();
      } catch (err) {
        alert('Failed to upgrade account. Please try again.');
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await api.patch(`/api/users/${userId}`, { bio, phone, location }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSaving('done');
      setTimeout(() => setSaving(false), 2000);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const firstConfirm = window.confirm(
      "⚠️ WARNING: Are you sure you want to delete your account?\n\nThis action cannot be undone. All your data, posts, and communities will be permanently removed."
    );
    
    if (!firstConfirm) return;

    const secondConfirm = window.prompt(
      "To confirm account deletion, please type 'DELETE' in all caps:"
    );

    if (secondConfirm !== 'DELETE') {
      alert("Account deletion cancelled. The text didn't match.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      await api.delete(`/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert("Your account has been successfully deleted.");
      localStorage.clear();
      navigate('/');
    } catch (err) {
      alert("Failed to delete account. Please try again or contact support.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Protocol...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Blocked: User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-24 transition-colors duration-500 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full border border-blue-500/10 text-[10px] font-black uppercase tracking-widest mb-4">
              <Cog6ToothIcon className="w-4 h-4" />
              Account Settings
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">My <span className="text-blue-600">Profile.</span></h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Manage your account details and preferences.</p>
        </div>

        <div className="space-y-10">
          {/* Profile Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Your Details</h2>
              <Link 
                to={`/profile/${user._id}`}
                className="px-6 py-2 bg-white dark:bg-slate-950 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                View Feed →
              </Link>
            </div>

            <div className="space-y-10">
              {/* Profile Picture */}
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-slate-950 text-blue-600 flex items-center justify-center font-black text-4xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-2xl relative group">
                  {(user.profileImage || localStorage.getItem('profileImage')) ? (
                    <img 
                      src={user.profileImage || localStorage.getItem('profileImage')} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <UserCircleIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">Profile Picture</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Your public image</p>
                  <label className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer inline-block shadow-xl shadow-blue-500/20 active:scale-95">
                    Choose Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/5 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Username</label>
                    <div className="px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-black italic">
                      {user.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Account Type</label>
                    <div className="px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col space-y-2">
                       <span className="text-blue-600 font-black uppercase tracking-widest text-xs italic">
                        {user.role} Hub
                      </span>
                      {user.role === 'seller' && (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {user.businessType === 'product' ? 'Merchant Pilot' : 'Service Studio Architect'}
                        </span>
                      )}
                    </div>
                  </div>

                  {user.role === 'seller' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Network Trust Score</label>
                        <div className="px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                           <span className="text-blue-600 font-black text-lg italic">
                            {user.trustScore || 0}% <span className="text-[10px] uppercase tracking-widest">Trust Points</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Security Clearance</label>
                        <div className="px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            user.isVerified 
                              ? 'text-blue-500' 
                              : 'text-slate-400'
                          }`}>
                            {user.isVerified ? 'VERIFIED ✓' : 'NOT VERIFIED'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {user.role === 'seller' && (
                <div className="border-t border-slate-200 dark:border-white/5 pt-10 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      {user.businessType === 'product' ? 'Hub Description' : 'Professional Mission'}
                    </label>
                    <textarea 
                      rows={4}
                      placeholder={user.businessType === 'product' ? "e.g. Bringing high-quality digital assets to creators..." : "Describe your professional competence..."}
                      className="w-full px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium italic leading-relaxed"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                       WhatsApp Sync Number
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. +254 700 000000"
                      className="w-full px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-black italic"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  {user.businessType === 'product' && (
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                        Logistics Origin Hub
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nairobi Hub, Kenya"
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-black italic"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className={`w-full md:w-auto px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 ${
                      saving === 'done' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    }`}
                  >
                    {saving === 'done' ? 'Saved ✓' : saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Communities Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-white/5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-8">Active Hubs</h2>
            {user.joinedCommunities && user.joinedCommunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.joinedCommunities.map(community => (
                  <Link
                    key={community._id}
                    to={`/communities/${community._id}`}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      {community.image && <img src={community.image} alt={community.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Member</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Static Silence: No Hubs Joined.</p>
              </div>
            )}
          </div>

          {/* Seller Upgrade */}
          {(user.role === 'user' || user.role === 'buyer' || (user.role === 'seller' && !user.businessType)) && (
            <div className="bg-slate-950 rounded-[3rem] p-8 md:p-12 border border-blue-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">
                  {user.role === 'seller' ? 'Complete Your Profile' : 'Start Selling'}
                </h2>
                <p className="text-slate-400 font-medium italic mb-10 max-w-xl">
                  {user.role === 'seller' 
                    ? 'Your identity is recognized. Choose your specialized cockpit to unlock the core tools of the network.'
                    : 'Choose your account type to get started.'}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleBecomeSeller('service')}
                    className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-blue-500 transition-all text-left active:scale-95 group"
                  >
                    <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                       <BriefcaseIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">Service Studio</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Knowledge & Assets</p>
                  </button>
  
                  <button 
                    onClick={() => handleBecomeSeller('product')}
                    className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-blue-500 transition-all text-left active:scale-95 group"
                  >
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                       <BuildingStorefrontIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-2">Product Store</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Physical & Digital</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-red-500/10 mb-24">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-8">Account Actions</h2>
            <div className="space-y-4">
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-between px-8 py-5 bg-white dark:bg-slate-950 text-red-600 rounded-[2rem] border border-red-500/20 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group shadow-sm active:scale-95"
      >
        <span className="flex items-center gap-4">
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-red-400 hidden sm:block">Secure Logout</span>
      </button>

              <div className="pt-6">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-between px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-[2rem] transition-all shadow-xl shadow-red-500/20 active:scale-95 group"
                >
                  <span className="flex items-center gap-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Delete Account</span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60 hidden sm:block italic">This cannot be undone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
