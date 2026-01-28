import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { UserCircleIcon, CheckBadgeIcon, MapPinIcon, BriefcaseIcon, UserGroupIcon, PhotoIcon } from '@heroicons/react/24/solid';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', description: '', imageUrl: '', link: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  const handleRate = async (stars) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please sign in to rate this expert.');
      
      setIsRating(true);
      const res = await api.post(`/api/users/${id}/rate`, { stars }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local profile state
      const updatedProfile = { ...profile };
      updatedProfile.averageRating = res.data.averageRating;
      if (!updatedProfile.ratings) updatedProfile.ratings = [];
      updatedProfile.ratings.push({}); // Dummy to update length
      setProfile(updatedProfile);
      
      alert('✅ Your rating has been added to the trust network.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to rate');
    } finally {
      setIsRating(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await api.get(`/api/users/${id}`);
        setProfile(userRes.data);

        const postsRes = await api.get(`/api/users/${id}/posts`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading Profile...</div>;
  if (!profile) return <div className="min-h-screen pt-24 text-center">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 transition-colors duration-300">
      
      {/* Meta-Style Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto">
          
          {/* Cover Photo */}
          <div 
            className="h-48 md:h-64 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 relative rounded-b-lg mx-4 md:mx-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(/default-profile-cover.png)`
            }}
          >
             {/* Optional: Add actual cover photo upload functionality here */}
          </div>

          <div className="px-4 pb-6 md:px-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16 gap-6">
              
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-lg overflow-hidden">
                   {(profile.profileImage || (localStorage.getItem('userId') === id && localStorage.getItem('profileImage'))) ? (
                     <img 
                       src={profile.profileImage || localStorage.getItem('profileImage')} 
                       alt={profile.username} 
                       className="w-full h-full rounded-full object-cover bg-slate-200" 
                     />
                   ) : (
                     <UserCircleIcon className="w-full h-full text-slate-300 dark:text-slate-600" />
                   )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                  {profile.username}
                </h1>
                
                {/* Stats / Bio Line */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  {profile.role === 'seller' && (
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="w-4 h-4" />
                      Member / Admin
                    </span>
                  )}
                  {/* Trust Score Reflecting Real Competence */}
                  <span className="text-slate-900 dark:text-white font-black bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs uppercase tracking-tighter">
                    {profile.trustScore || 0}% Trust
                  </span>

                  {/* The Rating Stripe (Systematic Feedback) */}
                  <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((s) => {
                        const hasAlreadyRated = profile.ratings?.some(r => r.author === localStorage.getItem('userId') || r.author?._id === localStorage.getItem('userId'));
                        return (
                          <button
                            key={s}
                            disabled={isRating || localStorage.getItem('userId') === id || hasAlreadyRated}
                            onClick={() => handleRate(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            className={`transition-transform hover:scale-125 disabled:cursor-not-allowed`}
                            title={hasAlreadyRated ? "Trust has already been established." : ""}
                          >
                            <CheckBadgeIcon className={`w-4 h-4 ${s <= (hoverRating || profile.averageRating || 0) ? 'text-amber-500' : 'text-slate-200 dark:text-slate-700'}`} />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 ml-1">
                      {profile.averageRating?.toFixed(1) || '0.0'} ({profile.ratings?.length || 0})
                    </span>
                  </div>
                </div>  
                  {/* Add location if enabled later */}
                  {/* <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> Nairobi</span> */}
                
                {profile.sellerProfile?.bio && (
                   <p className="mt-3 text-slate-500 max-w-lg mx-auto md:mx-0">{profile.sellerProfile.bio}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-4 md:mb-6">
                 {localStorage.getItem('userId') === id && localStorage.getItem('role') === 'seller' ? (
                   <Link 
                    to="/dashboard"
                    className="px-6 py-2 bg-slate-900 dark:bg-primary-600 text-white font-bold rounded-full transition-all shadow-lg shadow-slate-900/10"
                   >
                     Go to Dashboard
                   </Link>
                 ) : localStorage.getItem('userId') !== id && (
                   <>
                     <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
                       Connect
                     </button>
                     <button 
                        onClick={() => {
                          if (profile?.sellerProfile?.phone) {
                            const cleanPhone = profile.sellerProfile.phone.replace(/\+/g, '').replace(/\s/g, '');
                            window.open(`https://wa.me/${cleanPhone}`, '_blank');
                          } else {
                            alert("This user hasn't provided a contact number yet.");
                          }
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-lg transition-colors"
                      >
                        Message
                      </button>
                   </>
                 )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-t border-slate-200 dark:border-slate-700 mt-6 pt-1 justify-center md:justify-start">
              <button 
                onClick={() => setActiveTab('timeline')}
                className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Timeline
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'about' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                About & Competence
              </button>
               <button 
                onClick={() => setActiveTab('portfolio')}
                className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'portfolio' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Competence Assets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar (Intro) */}
          <div className="md:col-span-1 space-y-4 hidden md:block">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Orientation</h3>
               <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                 <p>🛰️ <span className="font-semibold">Network Role:</span> {profile.role === 'seller' ? 'Member / Admin' : 'Community Member'}</p>
                 {profile.sellerProfile?.website && <p>🕸️ <a href={profile.sellerProfile.website} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">Website</a></p>}
                 <p>📅 Joined January 2026</p>
               </div>
            </div>

            {/* Skills Card */}
            {profile.competence?.skills?.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.competence.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Joined Communities Card */}
            {profile.joinedCommunities?.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-primary-500" />
                  Communities
                </h3>
                <div className="space-y-3">
                  {profile.joinedCommunities.map(comm => (
                    <Link 
                      key={comm._id} 
                      to={`/communities/${comm._id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden">
                        {comm.image && <img src={comm.image} alt={comm.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-primary-500 transition-colors truncate">
                        {comm.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Feed */}
          <div className="md:col-span-2">
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 bg-white dark:bg-slate-800 rounded-xl">No posts yet</div>
                ) : (
                  posts.map(post => {
                    // Inject full author object since API might just return ID or partial
                    const postWithAuthor = { ...post, author: profile }; // We are on profile page, so author is this user
                    return <PostCard key={post._id} post={postWithAuthor} />;
                  })
                )}
              </div>
            )}
            
            {activeTab === 'portfolio' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <Link key={post._id} to={`/communities/${post.community?._id || 'global'}`} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                          {post.media?.[0] ? (
                            <img src={post.media[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <PhotoIcon className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/60 backdrop-blur-md rounded-full">
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">Expert Asset</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter text-lg leading-tight truncate">{post.title}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4 italic font-medium">"{post.content?.[0] || 'No description provided.'}"</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                             <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">{post.category || 'Competence'}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-black uppercase tracking-tighter text-xl">Mirror is Empty</p>
                      <p className="text-sm italic mt-1 font-medium">This admin hasn't broadcast any competence assets yet.</p>
                    </div>
                  )}
                  </div>
               </div>
            )}
          </div>

        </div>
      </div>

      {/* Add Portfolio Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsPortfolioModalOpen(false)}></div>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Portfolio Project</h3>
              </div>
              <form 
                className="px-6 py-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const token = localStorage.getItem('token');
                    await api.post(`/api/users/${id}/portfolio`, newPortfolioItem, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    alert('Project added to portfolio!');
                    window.location.reload();
                  } catch (err) {
                    console.error('Failed to add project:', err);
                    alert('Failed to add project');
                  }
                }}
              >
                <div>
                  <label className="block text-sm font-semibold mb-1">Project Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    value={newPortfolioItem.title}
                    onChange={e => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    value={newPortfolioItem.description}
                    onChange={e => setNewPortfolioItem({...newPortfolioItem, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Project Image</label>
                  <label className="w-full flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <PhotoIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">{newPortfolioItem.imageUrl ? 'Image Ready' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewPortfolioItem({...newPortfolioItem, imageUrl: reader.result});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20">Add Project</button>
                  <button type="button" onClick={() => setIsPortfolioModalOpen(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 font-bold rounded-xl">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
