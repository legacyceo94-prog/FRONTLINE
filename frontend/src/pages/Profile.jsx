import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { UserCircleIcon, CheckBadgeIcon, MapPinIcon, BriefcaseIcon, PhotoIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  const handleRate = async (stars) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please sign in to rate this seller.');
      
      setIsRating(true);
      const res = await api.post(`/api/users/${id}/rate`, { stars }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const updatedProfile = { ...profile };
      updatedProfile.averageRating = res.data.averageRating;
      if (!updatedProfile.ratings) updatedProfile.ratings = [];
      updatedProfile.ratings.push({ author: localStorage.getItem('userId') }); 
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

  if (loading) return <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-white dark:bg-slate-950">
    <div className="w-12 h-12 border-b-2 border-emerald-500 rounded-full animate-spin mb-4"></div>
    <span className="font-black uppercase text-[10px] tracking-widest text-slate-400">Synchronizing Identity...</span>
  </div>;

  if (!profile) return <div className="min-h-screen pt-24 text-center bg-white dark:bg-slate-950 font-black uppercase text-xs tracking-widest text-slate-400">Protocol Error: Identity Not Found.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-16 transition-colors duration-500 selection:bg-emerald-500 selection:text-white pb-24">
      
      {/* Premium Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          
          {/* Cover Area */}
          <div className="h-48 md:h-64 bg-slate-50 dark:bg-slate-950 relative rounded-b-[3rem] mx-4 md:mx-0 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-200 dark:to-slate-900 animate-pulse"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="absolute bottom-6 right-8 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Identity Hub</span>
             </div>
          </div>

          <div className="px-6 pb-8 md:px-12 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-24 gap-8">
              
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] bg-white dark:bg-slate-900 p-2 shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 group-hover:scale-105 transition-transform duration-500">
                   {(profile.profileImage || (localStorage.getItem('userId') === id && localStorage.getItem('profileImage'))) ? (
                     <img 
                       src={profile.profileImage || localStorage.getItem('profileImage')} 
                       alt={profile.username} 
                       className="w-full h-full rounded-[2rem] object-cover bg-slate-50" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-[2rem]">
                        <UserCircleIcon className="w-24 h-24 text-slate-200 dark:text-slate-800" />
                     </div>
                   )}
                </div>
                {profile.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 border-4 border-white dark:border-slate-900">
                     <CheckBadgeIcon className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Info Block */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4 leading-none">
                  {profile.username}<span className="text-emerald-600">.</span>
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                  {profile.role === 'seller' && (
                    <span className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      {profile.businessType === 'product' ? 'Merchant Pilot' : 'Service Architect'}
                    </span>
                  )}
                  
                  <span className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-3 py-1.5 rounded-full shadow-lg">
                    {profile.trustScore || 0}% Trust
                  </span>

                  <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
                     <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverRating(0)}>
                       {[1, 2, 3, 4, 5].map((s) => {
                         const hasAlreadyRated = profile.ratings?.some(r => r.author === localStorage.getItem('userId') || r.author?._id === localStorage.getItem('userId'));
                         return (
                           <button
                             key={s}
                             disabled={isRating || localStorage.getItem('userId') === id || hasAlreadyRated}
                             onClick={() => handleRate(s)}
                             onMouseEnter={() => setHoverRating(s)}
                             className="transition-transform hover:scale-150 disabled:cursor-not-allowed group/star"
                           >
                             <CheckBadgeIcon className={`w-4 h-4 transition-colors ${s <= (hoverRating || profile.averageRating || 0) ? 'text-emerald-500' : 'text-slate-200 dark:text-slate-800 group-hover/star:text-emerald-300'}`} />
                           </button>
                         );
                       })}
                     </div>
                     <span className="text-[10px] text-slate-400 font-black ml-1">
                       <span className="text-slate-900 dark:text-white">{profile.averageRating?.toFixed(1) || '0.0'}</span> ({profile.ratings?.length || 0})
                     </span>
                  </div>
                </div>  
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6 md:mb-8">
                  {localStorage.getItem('userId') === id ? (
                    <Link 
                     to="/dashboard"
                     className="px-8 py-3.5 bg-slate-900 dark:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95 hover:bg-emerald-700"
                    >
                      Access Cockpit
                    </Link>
                  ) : (
                    <>
                      <button className="px-8 py-3.5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95">
                        Connect
                      </button>
                      <button 
                         onClick={() => {
                           if (profile?.sellerProfile?.phone) {
                             const cleanPhone = profile.sellerProfile.phone.replace(/\+/g, '').replace(/\s/g, '');
                             window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Protocol Sync: interested in your professional signals on Frontline.`)}`, '_blank');
                           } else {
                             alert("Contact protocol not initialized.");
                           }
                         }}
                         className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95"
                       >
                          Pulse Sync
                       </button>
                    </>
                  )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-10 border-t border-slate-50 dark:border-white/5 mt-10 overflow-x-auto no-scrollbar justify-center md:justify-start">
              {[
                { id: 'timeline', label: 'Timeline' },
                { id: 'portfolio', label: profile.businessType === 'product' ? 'Inventory' : 'Assets' },
                { id: 'about', label: 'Competence' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-5 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Stats */}
          <div className="lg:col-span-4 space-y-6 hidden lg:block">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
               <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 mb-8 italic">Personnel Data</h3>
               <div className="space-y-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-600 border border-slate-100 dark:border-white/5 shadow-lg">
                        <BriefcaseIcon className="w-5 h-5" />
                     </div>
                     <p><span className="text-slate-900 dark:text-white block text-xs">Network Role</span> {profile.role}</p>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-600 border border-slate-100 dark:border-white/5 shadow-lg">
                           <MapPinIcon className="w-5 h-5" />
                        </div>
                        <p><span className="text-slate-900 dark:text-white block text-xs">Origin Hub</span> {profile.location}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Skills List */}
            {profile.competence?.skills?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 mb-8 italic">Signal Types</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.competence.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Feed Content */}
          <div className="lg:col-span-8">
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                {posts.length === 0 ? (
                  <div className="text-center py-24 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5 italic">
                    Static Silence: No Broadcasts Detected.
                  </div>
                ) : (
                  posts.map(post => {
                    const postWithAuthor = { ...post, author: profile };
                    return <PostCard key={post._id} post={postWithAuthor} />;
                  })
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {posts.filter(p => p.type === 'product' || p.type === 'service').length > 0 ? (
                    posts.filter(p => p.type === 'product' || p.type === 'service').map((post) => (
                      <Link key={post._id} to={`/communities/${post.community?._id || 'global'}`} className="block group">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-2 hover:border-emerald-500/20">
                          <div className="h-56 overflow-hidden relative">
                            {post.media?.[0] ? (
                              <img src={post.media[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-300 dark:text-slate-800">
                                 <PhotoIcon className="w-16 h-16" />
                              </div>
                            )}
                            <div className="absolute top-6 left-6 px-4 py-1.5 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/20">
                               <span className="text-[9px] font-black uppercase tracking-widest">
                                 {profile.businessType === 'product' ? 'Merchant Asset' : 'Expert Service'}
                               </span>
                            </div>
                          </div>
                          <div className="p-8">
                            <h4 className="font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter text-xl italic leading-tight truncate">{post.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 italic font-medium leading-relaxed">"{post.content || 'No description provided.'}"</p>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{post.category || 'Competence'}</span>
                               <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center bg-slate-50 dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/5">
                      <BriefcaseIcon className="w-20 h-20 mx-auto mb-6 text-slate-200 dark:text-slate-800" />
                      <p className="font-black uppercase tracking-tighter text-2xl italic text-slate-300 dark:text-slate-700">Mirror Empty</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Zero competence broadcasts detected.</p>
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-10 md:p-12 border border-slate-100 dark:border-white/5 shadow-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-500/10 text-[10px] font-black uppercase tracking-widest mb-8">
                       <InformationCircleIcon className="w-4 h-4" />
                       Manifesto & Mission
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-6">The <span className="text-emerald-600">Competence</span> Baseline.</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic mb-10">
                      {profile.sellerProfile?.bio || "This participant has not yet transmitted their professional mission signal. They operate within the network as a verified entity."}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-slate-100 dark:border-white/5">
                       <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Network Origin</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{profile.location || 'Unknown Hub'}</span>
                       </div>
                       <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Member Since</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{new Date(profile.createdAt).getFullYear()}</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
