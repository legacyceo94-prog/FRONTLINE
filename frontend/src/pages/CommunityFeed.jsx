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
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'discussion', price: '', mediaUrl: '' });
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
        media: newPost.mediaUrl ? [newPost.mediaUrl] : []
      };

      const res = await api.post(`/api/communities/${id}/posts`, payload, {
        headers: { 'x-auth-token': token } 
      });

      // Add new post to top of list
      setPosts([res.data, ...posts]);
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', type: 'discussion', price: '', mediaUrl: '' });
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
                    <span>{community?.members?.length || 0} Buyers</span>
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
               className={`px-6 py-2.5 font-semibold rounded-full shadow-lg transition-all ${
                 isMember 
                 ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                 : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
               }`}
             >
               {isMember ? 'Buyer' : 'Join Community'}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Create Post Trigger (Sellers Only) */}
        {(localStorage.getItem('role') === 'seller' || localStorage.getItem('role') === 'admin') && (
          <div onClick={() => setIsModalOpen(true)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex gap-4 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-10 rounded-full px-4 flex items-center text-slate-500 text-sm">Start a discussion or list a product...</div>
            <PencilSquareIcon className="w-6 h-6 text-slate-400" />
          </div>
        )}

        {/* Feed */}
        <div className="space-y-6">
           {posts.length === 0 && <p className="text-center text-slate-500">No posts yet. Be the first!</p>}
           {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">Create Post</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <form id="post-form" onSubmit={handlePostSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Title (e.g. Selling AutoCAD License)" 
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    required
                  />
                  <textarea 
                    rows={4} 
                    placeholder="What's on your mind? Describe your service or question..." 
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    required
                  />

                  <div className="flex gap-4">
                    <select 
                      className="w-1/2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      value={newPost.type}
                      onChange={e => setNewPost({...newPost, type: e.target.value})}
                    >
                      <option value="discussion">Discussion</option>
                      {localStorage.getItem('role') === 'seller' && (
                        <>
                          <option value="service">Service (Listing)</option>
                          <option value="product">Product (Listing)</option>
                        </>
                      )}
                    </select>
                    {newPost.type !== 'discussion' && (
                       <input 
                        type="number" 
                        placeholder="Price (KES)" 
                        className="w-1/2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={newPost.price}
                        onChange={e => setNewPost({...newPost, price: e.target.value})}
                      />
                    )}
                  </div>

                  <div>
                    <label className="w-full flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                      <PhotoIcon className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {newPost.mediaUrl ? 'Image Selected ✓' : 'Add Image'}
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
              <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="submit" 
                  form="post-form"
                  disabled={posting}
                  className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-full border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
