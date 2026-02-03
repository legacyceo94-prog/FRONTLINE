import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // The new centralized link
import { 
  RocketLaunchIcon, 
  PlusCircleIcon, 
  UserGroupIcon, 
  PhotoIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  FireIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowUpCircleIcon,
  DocumentDuplicateIcon,
  Square3Stack3DIcon,
  StarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myHubs, setMyHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [newHub, setNewHub] = useState({ name: '', description: '', category: 'General', image: '' });
  const [creating, setCreating] = useState(false);
  const [receptionType, setReceptionType] = useState('ratings'); // 'ratings' or 'comments'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      navigate('/login');
      return;
    }

    if (role !== 'seller' && role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        // Execute all studio data fetches in parallel (Parallel Pulse)
        // Using centralized API: URLs are clean, Auth is automatic.
        const [userRes, hubsRes, postsRes] = await Promise.all([
          api.get(`/api/users/${userId}`),
          api.get('/api/communities/me'),
          api.get(`/api/users/${userId}/posts`)
        ]);



        setUser(userRes.data);
        setMyHubs(Array.isArray(hubsRes.data) ? hubsRes.data : []);
        setMyPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);



  /* 
    Studio Logic:
    Real-time data refreshers for high-frequency producer actions. 
  */
  const fetchMyHubs = async () => {
    try {
      const hubsRes = await api.get('/api/communities/me');
      setMyHubs(hubsRes.data);
    } catch (err) {
      console.error("Failed to fetch hubs", err);
    }
  };

  const handleCreateHub = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/api/communities', newHub);
      
      if (newHub.image) {
        localStorage.setItem(`community_image_${res.data._id}`, newHub.image);
      }

      setIsHubModalOpen(false);
      setNewHub({ name: '', description: '', category: 'General', image: '' });
      await fetchMyHubs();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to launch hub");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 transition-colors duration-300 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Orientation or "The Journey" */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md">Chapter One: The Foundation</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
              {user?.businessType === 'product' ? 'My Dashboard' : 'My Dashboard'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-lg">
              {user?.businessType === 'product' 
                ? 'Manage your stock, track orders, and grow your sales.'
                : 'Build trust, find work, and grow your reputation.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">System Health</p>
                <div className="flex items-center gap-2 text-blue-500">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-sm font-bold uppercase tracking-tighter">Operational</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Power Meter & Profile Preview */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 border-4 border-white dark:border-slate-700 flex items-center justify-center font-bold text-3xl overflow-hidden shadow-xl mb-4 relative group">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <PhotoIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{user?.username}</h2>
                <div className="mt-2 flex flex-col items-center gap-1">
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                       <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {user?.businessType === 'product' ? 'Verified Merchant' : 'Professional Seller'}
                       </span>
                   </div>
                   {user?.sellerProfile?.phone && (
                     <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                        📲 {user.sellerProfile.phone}
                     </span>
                   )}
                   {user?.location && (
                     <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        📍 {user.location}
                     </span>
                   )}
                   {myHubs.length > 0 && (
                     <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest italic">
                        📍 {myHubs[0].name}
                     </span>
                   )}
                </div>
              </div>

              {/* Trust Engine View */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Trust Score</span>
                     <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">{user?.trustScore || 0}%</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Threshold</span>
                     <span className="text-sm font-black text-slate-300 dark:text-slate-600">{user?.trustScore >= 50 ? 'Verified Seller' : 'Verification Lock'}</span>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${user?.trustScore > 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(var(--color-blue-500),0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`}
                    style={{ width: `${Math.max(user?.trustScore || 0, 5)}%` }}
                  ></div>
                </div>
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                   <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2">
                     <ShieldCheckIcon className="w-3 h-3" />
                     Reputation Level: {user?.trustScore >= 50 ? 'Certified Seller' : user?.trustScore > 0 ? 'Rising Professional' : 'Zero-Base Truth'}
                   </p>
                   <p className="text-[9px] text-slate-400 mt-1 italic leading-relaxed">
                     {user?.trustScore > 0 ? 'Your authority is growing. Keep broadcasting competence.' : 'Identity is private. Upload assets to begin your public broadcast.'}
                   </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Public Profile</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          {user?.profileImage && <img src={user.profileImage} alt="" className="w-full h-full object-cover opacity-80" />}
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user?.username}</p>
                          <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{myHubs[0]?.name || 'No Territory'}</p>
                       </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                             <StarIconSolid key={s} className={`w-2 h-2 ${s <= (user?.averageRating || 0) ? 'text-blue-400' : 'text-slate-200 dark:text-slate-700'}`} />
                          ))}
                          <span className="text-[7px] font-black text-slate-400 ml-1">({user?.ratings?.length || 0})</span>
                       </div>
                       {user?.sellerProfile?.phone && (
                         <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">WA: {user.sellerProfile.phone}</span>
                       )}
                    </div>
                  </div>
                 <Link to={`/profile/${user?._id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all group">
                   Visit Public Hub
                   <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </div>

            {/* Quick Stats Analyst */}
            <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ChartBarIcon className="w-32 h-32 rotate-12" />
               </div>
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <div className="w-5 h-[1px] bg-slate-700"></div>
                 {user?.businessType === 'product' ? 'Store Velocity' : 'Workshop Metrics'}
               </h3>
               <div className="grid grid-cols-2 gap-6 relative z-10">
                   <div className="flex flex-col">
                     <p className="text-3xl font-black tracking-tighter text-blue-400">{user?.averageRating?.toFixed(1) || '0.0'}</p>
                     <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1 flex items-center gap-1">
                        <StarIconSolid className="w-2 h-2 text-blue-400" />
                        Social Rating
                     </p>
                   </div>
                   <div className="flex flex-col">
                     <p className="text-3xl font-black tracking-tighter text-blue-400">{user?.ratings?.length || 0}</p>
                     <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">
                       {user?.businessType === 'product' ? 'Total Orders' : 'Total Handshakes'}
                     </p>
                   </div>
                   <div className="col-span-2 pt-6 border-t border-white/5 mt-2">
                     <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                           <div>
                             <p className="text-3xl font-black tracking-tighter text-white">{myPosts.length}</p>
                             <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">
                               {user?.businessType === 'product' ? 'Product SKUs' : 'Seller Assets'}
                             </p>
                           </div>
                           <div>
                             <p className="text-3xl font-black tracking-tighter text-blue-500">{myHubs.length}</p>
                             <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">
                               {user?.businessType === 'product' ? 'Live Stores' : 'Live Hubs'}
                             </p>
                           </div>
                        </div>
                       <button 
                         onClick={() => setIsPortfolioOpen(true)}
                         className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-colors"
                       >
                         {user?.businessType === 'product' ? 'Inventory' : 'Assets'}
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Column 2: The Forge (Actions & Content Management) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Actions Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button 
                  onClick={() => setIsHubModalOpen(true)}
                  className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left overflow-hidden border border-white/10"
               >
                  <div className="relative z-10">
                    <RocketLaunchIcon className="w-12 h-12 mb-6 text-blue-400 dark:text-white/80" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Create Hub</h3>
                    <p className="text-slate-400 dark:text-white/60 text-xs italic leading-relaxed">Start your own community.</p>
                  </div>
                  <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-125 transition-transform group-hover:-rotate-12">
                    <UserGroupIcon className="w-48 h-48" />
                  </div>
               </button>

               <button 
                  onClick={() => setIsPortfolioOpen(true)}
                  className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:-translate-y-1 text-left shadow-sm hover:shadow-xl"
               >
                  {user?.businessType === 'product' ? (
                    <BuildingStorefrontIcon className="w-12 h-12 mb-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <PhotoIcon className="w-12 h-12 mb-6 text-blue-600 dark:text-blue-400" />
                  )}
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
                    {user?.businessType === 'product' ? 'List Product' : 'Build Assets'}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs italic leading-relaxed">
                    {user?.businessType === 'product' 
                      ? 'Add new items to your warehouse and reach the network.'
                      : 'Construct proofs of competence to secure Trust points.'}
                  </p>
               </button>
            </div>

            {/* Hub Management Section (Managed Hubs) */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                     {user?.businessType === 'product' ? 'Your Stores' : 'Your Territories'}
                   </h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Admin Access Only</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{myHubs.length} Active</span>
                </div>
              </div>

              {myHubs.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                  <Square3Stack3DIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
                  <p className="text-slate-600 dark:text-slate-400 font-black uppercase tracking-tighter text-xl">No Active Communities</p>
                  <p className="text-sm text-slate-400 mb-8 italic">You haven't joined or created any communities.</p>
                  <button onClick={() => setIsHubModalOpen(true)} className="px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Create Community</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myHubs.map(hub => (
                    <div key={hub._id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-5 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
                       <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700 group-hover:rotate-3 transition-transform">
                          {hub.image ? (
                            <img src={hub.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserGroupIcon className="w-full h-full p-4 text-slate-300" />
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter text-lg">{hub.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{hub.category}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member / Admin</span>
                          </div>
                       </div>
                       <Link to={`/communities/${hub._id}`} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                          <ArrowRightIcon className="w-5 h-5" />
                       </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

             {/* Recent Network Reception (Feedback) - YouTube Studio Style */}
             <div className="bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Recent Activity</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Latest feedback</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100 dark:border-blue-900/50">
                    <StarIconSolid className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                   <button 
                      onClick={() => setReceptionType('ratings')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${receptionType === 'ratings' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                      Ratings
                   </button>
                   <button 
                      onClick={() => setReceptionType('comments')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${receptionType === 'comments' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                      Pulse Comments
                   </button>
                </div>

                <div className="space-y-4">
                    {receptionType === 'ratings' ? (
                       !user?.ratings || user.ratings.length === 0 ? (
                          <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                             <p className="text-sm text-slate-400 italic font-medium">No trust handshakes recorded yet.</p>
                          </div>
                       ) : (
                          user.ratings.slice(0, 5).map((rating, idx) => (
                            <div key={idx} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500 group">
                               <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
                                        {rating.author?.profileImage ? <img src={rating.author.profileImage} className="w-full h-full object-cover" /> : <div className="p-1 text-[10px]">🛡️</div>}
                                     </div>
                                     <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {rating.author?.username || 'Verified Client'}
                                     </span>
                                     {rating.author?.isVerified && <span className="text-[8px] font-bold text-blue-500 border border-blue-500/20 px-1 rounded uppercase">Verified</span>}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(s => (
                                      <StarIconSolid key={s} className={`w-3 h-3 ${s <= rating.stars ? 'text-blue-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                    ))}
                                  </div>
                               </div>
                               <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed font-bold">
                                  "{rating.comment || 'Verified without comment.'}"
                                </p>
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{new Date(rating.createdAt).toLocaleDateString()}</div>
                            </div>
                          ))
                       )
                    ) : 
                       (() => {
                          const allComments = (myPosts || []).reduce((acc, post) => {
                             if (post && Array.isArray(post.comments)) {
                                return [...acc, ...post.comments.map(c => ({ 
                                   ...c, 
                                   postTitle: post.title, 
                                   postId: post._id 
                                }))];
                             }
                             return acc;
                          }, []);

                          if (allComments.length === 0) {
                             return (
                                <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                   <p className="text-sm text-slate-400 italic font-medium">No comments on your posts yet.</p>
                                </div>
                             );
                          }

                          return allComments
                             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                             .slice(0, 5)
                             .map((comment, idx) => (
                                <div key={idx} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500 group">
                                   <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
                                            {comment.author?.profileImage ? <img src={comment.author.profileImage} className="w-full h-full object-cover" /> : <div className="p-1 text-[10px]">💬</div>}
                                         </div>
                                         <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                            {comment.author?.username || 'Anonymous'}
                                         </span>
                                         {comment.author?.isVerified && <span className="text-[8px] font-bold text-blue-500 border border-blue-500/20 px-1 rounded uppercase">Verified</span>}
                                      </div>
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                   </div>
                                   <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3 line-clamp-2 italic">
                                      "{comment.text}"
                                   </p>
                                   <div className="flex items-center gap-2">
                                      <div className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700 italic">
                                         Asset: {comment.postTitle}
                                      </div>
                                   </div>
                                </div>
                             ));
                       })()
                    }
                 </div>
             </div>

            {/* Dashboard Orientation Help */}
            <div className="p-8 rounded-[2rem] bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-white/5 relative overflow-hidden">

               <div className="absolute bottom-0 right-0 p-8 opacity-5">
                  <ShieldCheckIcon className="w-24 h-24 rotate-12" />
               </div>
               <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                     <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-blue-900 dark:text-white uppercase tracking-tighter mb-2 italic">Trust System</h4>
                    <p className="text-blue-800/60 dark:text-slate-500 text-xs leading-relaxed max-w-lg">
                      Gain trust by collecting verified reviews. Create communities and list your services to increase your rating.
                    </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Asset Manager Drawer (Private Construction) */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out ${isPortfolioOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col">
            {/* Drawer Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       {user?.businessType === 'product' ? 'Inventory' : 'My Assets'}
                     </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                    {user?.businessType === 'product' ? 'My Store' : 'My Portfolio'}
                  </h3>
               </div>
               <button 
                  onClick={() => setIsPortfolioOpen(false)}
                  className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
               >
                  <XMarkIcon className="w-6 h-6" />
               </button>
            </div>

            {/* Asset Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               
               {/* Quick Add Objective */}
               <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <PlusCircleIcon className="w-24 h-24" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-2">New Listing</h4>
                  <p className="text-slate-400 text-xs mb-6 italic leading-relaxed">List a new service or product.</p>
                  <button 
                    onClick={() => navigate('/create-course')}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-black/20"
                  >
                    <ArrowUpCircleIcon className="w-4 h-4" />
                    Create Listing
                  </button>
               </div>

               {/* Asset List */}
               <div>
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                     <div className="w-4 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
                     Active Listings
                  </h5>
                  
                  {(!Array.isArray(myPosts) || myPosts.length === 0) ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                       <DocumentDuplicateIcon className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                       <p className="text-sm text-slate-300 dark:text-slate-600 font-bold italic tracking-tight">Stage is set. Awaiting your first proof.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {myPosts.map(post => (
                         <div key={post._id} className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4 group hover:border-blue-500 transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                               {post.media?.[0] ? (
                                 <img src={post.media[0]} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <PhotoIcon className="w-6 h-6" />
                                 </div>
                               )}
                            </div>
                            <div className="flex-1 min-w-0">
                               <h6 className="font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">{post.title}</h6>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Type: {post.type}</span>
                                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                               </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                               <XMarkIcon className="w-5 h-5" />
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Trust Forecast Footer */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Trust Growth</p>
                   <p className="text-sm font-black text-blue-500">+{myPosts.length * 0.1}% Growth</p>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                   Listing quality services helps you build trust with customers.
                </p>
            </div>
         </div>
      </div>

      {/* Hub Modal (Launch Territory) */}
      {isHubModalOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsHubModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-[2.5rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-white/10">
              <div className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-center mb-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <RocketLaunchIcon className="w-3 h-3 text-blue-500" />
                       <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Create Community</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic" id="modal-title">Create Community</h3>
                  </div>
                  <button onClick={() => setIsHubModalOpen(false)} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <form id="create-hub-form" onSubmit={handleCreateHub} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Community Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Nairobi Designers" 
                      className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold placeholder:italic"
                      value={newHub.name}
                      onChange={e => setNewHub({...newHub, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</label>
                       <select 
                         className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold"
                         value={newHub.category}
                         onChange={e => setNewHub({...newHub, category: e.target.value})}
                       >
                         <option value="Engineering">Engineering</option>
                         <option value="Technology">Technology</option>
                         <option value="Business">Business</option>
                         <option value="Creative">Creative</option>
                         <option value="General">General</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Image</label>
                       <label className="w-full flex items-center gap-3 px-6 py-4 rounded-[1.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-blue-500 hover:text-white transition-all">
                         <PhotoIcon className="h-5 w-5 opacity-50" />
                         <span className="text-xs font-bold uppercase truncate">
                           {newHub.image ? 'Image Loaded ✓' : 'Add Image'}
                         </span>
                         <input 
                           type="file" 
                           accept="image/*"
                           className="hidden"
                           onChange={e => {
                             const file = e.target.files[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setNewHub({...newHub, image: reader.result});
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                         />
                       </label>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Description</label>
                    <textarea 
                      rows={3} 
                      placeholder="Describe your community." 
                      className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold placeholder:italic"
                      value={newHub.description}
                      onChange={e => setNewHub({...newHub, description: e.target.value})}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-8 py-8 flex flex-col gap-4 border-t border-white/5">
                <button 
                  type="submit" 
                  form="create-hub-form"
                  disabled={creating}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {creating ? 'CREATING...' : 'CREATE COMMUNITY'}
                </button>
                <p className="text-[10px] text-slate-400 text-center italic">Communities let you connect with others.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
