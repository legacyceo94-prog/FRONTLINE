import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserGroupIcon, ArrowLeftIcon, PencilSquareIcon, XMarkIcon, PhotoIcon, CameraIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import PostCard from '../components/PostCard';

export default function CommunityFeed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isMember, setIsMember] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'discussion', price: '', mediaUrl: '', tier: 'standard', category: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const token = localStorage.getItem('token');
        try {
          const res = await api.get(`/api/communities/${id}`);
          setCommunity(res.data);
        } catch (err) {
          console.error("Failed to fetch community info", err);
          setCommunity(null);
        }

        // check membership
        if (token && id !== '1' && id !== '4') { // Avoid check if using old mock IDs from landing
          try {
            const memRes = await api.get(`/api/communities/${id}/membership`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsMember(memRes.data.isMember);
          } catch (e) { console.error("Mem check err", e) }
        } else if (id === '1' || id === '4') {
            setIsMember(true); // Simulate membership for the initial discovery communities
        }

        // 2. Get Posts
        const postsRes = await api.get(`/api/communities/${id}/posts`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [id]);

  const handleJoin = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    
    try {
      await api.post(`/api/communities/${id}/join`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsMember(true);
      setCommunity(prev => prev ? ({ ...prev, members: [...(prev.members || []), localStorage.getItem('userId')] }) : null);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to join");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Please Login to post");

      const payload = {
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        price: newPost.price,
        tier: newPost.tier,
        category: newPost.category,
        media: newPost.mediaUrl ? [newPost.mediaUrl] : []
      };

      const res = await api.post(`/api/communities/${id}/posts`, payload, {
        headers: { 'x-auth-token': token } 
      });

      // Add new post to top of list
      setPosts([res.data, ...posts]);
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', type: 'discussion', price: '', mediaUrl: '', tier: 'standard', category: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to post. ensure you are logged in.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 transition-colors duration-300">
      
      {/* Community Header (Same as before) */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div 
          className="h-48 w-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: (community?.image || localStorage.getItem(`community_image_${id}`)) 
              ? 'none' 
              : 'url(/default-community-cover.png)'
          }}
        >
           {(community?.image || localStorage.getItem(`community_image_${id}`)) && (
             <img 
               src={community?.image || localStorage.getItem(`community_image_${id}`)} 
               alt="Cover" 
               className="w-full h-full object-cover" 
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <button onClick={() => navigate('/communities')} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur rounded-full text-white"><ArrowLeftIcon className="w-6 h-6" /></button>

            {/* Change Cover for Creator */}
            {community?.creator === localStorage.getItem('userId') && (
              <label className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur rounded-full text-white cursor-pointer hover:bg-white/40 transition-all group">
                <CameraIcon className="w-5 h-5" />
                <span className="absolute right-full mr-2 whitespace-nowrap bg-black/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Change Cover</span>
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        try {
                          const token = localStorage.getItem('token');
                          await api.patch(`/api/communities/${id}`, { image: reader.result }, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          localStorage.setItem(`community_image_${id}`, reader.result);
                          window.location.reload();
                        } catch (err) {
                          console.info('Cover update error handled:', err);
                          alert('Failed to update cover');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
             <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{community?.name}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm mt-1">
                  <div className="flex items-center gap-1.5">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{community?.members?.length || 0} Synced Members</span>
                  </div>
                  {community?.creator && (
                    <Link to={`/profile/${community.creator._id || community.creator}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                      <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                      <span>Founded by <span className="font-semibold uppercase">{community.creator.username || 'Seller'}</span></span>
                    </Link>
                  )}
                </div>
              </div>
              <button 
                onClick={handleJoin}
                className={`px-6 py-2.5 font-black uppercase tracking-widest text-[10px] rounded-full shadow-lg transition-all ${
                  isMember 
                  ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20 shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                }`}
              >
                {isMember 
                  ? (localStorage.getItem('role') === 'seller' ? 'Authenticated Seller' : 'Verified Buyer') 
                  : 'Join Community'}
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Create Post Trigger (Sellers Only) */}
        {(localStorage.getItem('role') === 'seller' || localStorage.getItem('role') === 'admin') && (
          <div onClick={() => setIsModalOpen(true)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex gap-4 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
               {localStorage.getItem('profileImage') ? (
                 <img src={localStorage.getItem('profileImage')} alt="" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                    {localStorage.getItem('username')?.charAt(0).toUpperCase()}
                 </div>
               )}
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-10 rounded-full px-4 flex items-center text-slate-500 text-sm italic">Initiate a broadcast or provide professional proof...</div>
            <PencilSquareIcon className="w-6 h-6 text-slate-400" />
          </div>
        )}

        {/* Feed */}
        <div className="space-y-6">
           {posts.length === 0 && <p className="text-center text-slate-500">No posts yet. Be the first!</p>}
           {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {/* INITIATE BROADCAST MODAL (The Mission Terminal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-[3rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-white/10">
              <div className="px-8 pt-10 pb-4">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <RocketLaunchIcon className="w-3 h-3 text-blue-500" />
                       <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Protocol Override</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic" id="modal-title">Initiate Broadcast</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <form id="post-form" onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Mission Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Verified AutoCAD Activation" 
                      className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold placeholder:italic"
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Intelligence (Content)</label>
                    <textarea 
                      rows={4} 
                      placeholder="Provide proof of work or broadcast your requirement..." 
                      className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold placeholder:italic resize-none"
                      value={newPost.content}
                      onChange={e => setNewPost({...newPost, content: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Asset Tier</label>
                       <select 
                         className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold"
                         value={newPost.tier}
                         onChange={e => setNewPost({...newPost, tier: e.target.value})}
                       >
                         <option value="standard">Standard Layer</option>
                         <option value="premium">Premium Protocol</option>
                         <option value="elite">Elite Archive</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Domain Tag (Uniqueness)</label>
                       <input 
                         type="text" 
                         placeholder="e.g. AutoCAD / Branding / Strategy" 
                         className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold placeholder:italic"
                         value={newPost.category}
                         onChange={e => setNewPost({...newPost, category: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Asset Identity</label>
                      <select 
                        className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold"
                        value={newPost.type}
                        onChange={e => setNewPost({...newPost, type: e.target.value})}
                      >
                        <option value="discussion">Discussion Broadcast</option>
                        {localStorage.getItem('role') === 'seller' && (
                          <>
                            <option value="service">Service Asset (Proof)</option>
                            <option value="product">Retail Asset (SKU)</option>
                          </>
                        )}
                      </select>
                    </div>
                    {newPost.type !== 'discussion' && (
                      <div className="space-y-2 animate-in zoom-in-95 duration-300">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 ml-1">Valuation (KES)</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full px-6 py-4 rounded-[1.5rem] bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all font-bold text-blue-500"
                          value={newPost.price}
                          onChange={e => setNewPost({...newPost, price: e.target.value})}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Visual Evidence</label>
                    <label className="w-full flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] cursor-pointer hover:bg-blue-500 hover:text-white transition-all group">
                      <div className="flex items-center gap-3">
                         <PhotoIcon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                         <span className="text-xs font-bold uppercase tracking-widest truncate">
                           {newPost.mediaUrl ? 'Evidence Locked ✓' : 'Attach Proof'}
                         </span>
                      </div>
                      <div className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full text-[8px] font-black uppercase tracking-tighter">Required</div>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewPost({...newPost, mediaUrl: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </form>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-8 py-8 flex flex-col gap-4 border-t border-white/5">
                <button 
                  type="submit" 
                  form="post-form"
                  disabled={posting}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {posting ? 'SYNCHRONIZING...' : 'INJECT BROADCAST'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                  Abort Mission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
