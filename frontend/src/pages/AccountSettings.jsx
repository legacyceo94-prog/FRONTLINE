import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
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

        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(res.data);
        setBio(res.data.sellerProfile?.bio || '');
        setPhone(res.data.sellerProfile?.phone || '');
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

  const handleBecomeSeller = async () => {
    if (window.confirm("Upgrade to seller account? You'll be able to create courses and listings.")) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        await axios.patch(`http://localhost:5000/api/users/${userId}/upgrade-seller`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        localStorage.setItem('role', 'seller');
        alert('✅ Account upgraded to Seller! Entering your private cockpit...');
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
      await axios.patch(`http://localhost:5000/api/users/${userId}`, { bio, phone }, {
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
      
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
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
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 capitalize">
                        {user.role}
                      </span>
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
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Professional Bio</label>
                    <div className="text-xs text-slate-500 mb-2 italic">This bio will be shown on your public pulse posts.</div>
                    <textarea 
                      rows={3}
                      placeholder="Describe your skills and what you offer..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">WhatsApp Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +254 700 000000"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-2">Crucial for buyers to reach you instantly on WhatsApp.</p>
                  </div>
                  
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
          {user.role === 'user' && (
            <div className="glass-card rounded-2xl p-6 shadow-sm bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-2 border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">🚀 Become a Seller</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                Upgrade your account to create course listings, showcase your portfolio, and start earning!
              </p>
              <button 
                onClick={handleBecomeSeller}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30"
              >
                Upgrade to Seller Account
              </button>
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
