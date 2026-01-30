import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

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
        alert(`✅ ${typeLabel} Launched! Entering your private cockpit...`);
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
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
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
      <div className="min-h-screen pt-24 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
              <Link 
                to={`/profile/${user._id}`}
                className="text-sm text-primary-500 hover:underline font-medium"
              >
                View Public Profile →
              </Link>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-3xl overflow-hidden ring-4 ring-white dark:ring-slate-800">
                  {(user.profileImage || localStorage.getItem('profileImage')) ? (
                    <img 
                      src={user.profileImage || localStorage.getItem('profileImage')} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Profile Picture</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Upload from your device</p>
                  <label className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors cursor-pointer inline-block">
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

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                      {user.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role & Identity</label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 capitalize w-fit">
                        {user.role}
                      </span>
                      {user.role === 'seller' && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {user.businessType === 'product' ? '📦 Product Store Owner' : '🚀 Professional Studio'}
                        </span>
                      )}
                    </div>
                  </div>

                  {user.role === 'seller' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Trust Score</label>
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            {user.trustScore || 0}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Verified Status</label>
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isVerified 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {user.isVerified ? 'Verified ✓' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {user.role === 'seller' && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {user.businessType === 'product' ? 'Store Mission' : 'Professional Bio'}
                    </label>
                    <div className="text-xs text-slate-500 mb-2 italic">
                      {user.businessType === 'product' ? 'What your store stands for and what you sell.' : 'This bio will be shown on your public pulse posts.'}
                    </div>
                    <textarea 
                      rows={3}
                      placeholder={user.businessType === 'product' ? "e.g. Bringing high-quality digital assets to creators..." : "Describe your skills and what you offer..."}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                       WhatsApp Phone Number
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. +254 700 000000"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Crucial for buyers to reach you instantly on WhatsApp.
                    </p>
                  </div>

                  {user.businessType === 'product' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Store Hub / Origin
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nairobi Hub, Kenya"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Helps buyers know where you ship from.
                      </p>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Communities Section */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Communities</h2>
            {user.joinedCommunities && user.joinedCommunities.length > 0 ? (
              <div className="space-y-3">
                {user.joinedCommunities.map(community => (
                  <Link
                    key={community._id}
                    to={`/communities/${community._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                      {community.image && <img src={community.image} alt={community.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Member</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                You haven't joined any communities yet.
              </p>
            )}
          </div>

          {/* Seller Upgrade (Only for users) */}
          {(user.role === 'user' || user.role === 'buyer') && (
            <div className="glass-card rounded-2xl p-6 shadow-sm bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-2 border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">🚀 Launch Your Engine</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Choose how you want to scale on Frontline. Access expert tools and build your trust score.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleBecomeSeller('service')}
                  className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Service Studio</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Expertise & Time</p>
                </button>

                <button 
                  onClick={() => handleBecomeSeller('product')}
                  className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Product Store</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Physical & Digital</p>
                </button>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </span>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Sign out of your account</span>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-between px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="font-semibold">Delete Account</span>
                  </span>
                  <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Permanently remove your account</span>
                </button>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                  ⚠️ This action is permanent and cannot be undone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
