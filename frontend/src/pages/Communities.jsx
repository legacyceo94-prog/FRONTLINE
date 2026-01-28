import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, PlusCircleIcon, XMarkIcon, PhotoIcon, RocketLaunchIcon, FireIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PostCard from '../components/PostCard';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', category: 'General', image: '' });
  const [creating, setCreating] = useState(false);
  const [globalPosts, setGlobalPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('hubs'); // 'hubs' or 'pulse'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
    fetchGlobalPulse();
  }, []);

  const fetchGlobalPulse = async () => {
    try {
      const res = await api.get(""/api/communities/global/posts`);
      setGlobalPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch global pulse", err);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await api.get(""/api/communities`);
      setCommunities(res.data);
    } catch (err) {
      console.error("Failed to fetch communities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await api.post(""/api/communities`, newCommunity, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Save image to localStorage if provided
      if (newCommunity.image) {
        localStorage.setItem(`community_image_${res.data._id}`, newCommunity.image);
      }
      
      setCommunities([res.data, ...communities]);
      setIsModalOpen(false);
      setNewCommunity({ name: '', description: '', category: 'General', image: '' });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create community");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      
      {/* Pulse Hero Section */}
      <div className="relative pt-32 pb-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/5 blur-[100px] rounded-full"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Network Broadcast</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4 italic">
                     Marketplace <span className="text-primary-600">Pulse</span>
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                     The social discovery zone for real competence. Explore hubs of expertise and witness live proof-of-work across the network.
                  </p>
               </div>
               
               <div className="w-full md:w-96">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search for competence..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-inner focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none dark:text-white transition-all font-bold italic"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
               </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex gap-8 mt-12 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('hubs')}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${activeTab === 'hubs' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="w-5 h-5 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                   <UserGroupIcon className="w-3 h-3" />
                </div>
                Expert Hubs
                {activeTab === 'hubs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-t-full"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('pulse')}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${activeTab === 'pulse' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 <div className="w-5 h-5 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                   <FireIcon className="w-3 h-3" />
                </div>
                Live Feed
                {activeTab === 'pulse' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-t-full"></div>}
              </button>
            </div>
         </div>
      </div>

        <div className="flex flex-col gap-8">
           {/* Systematic Infrastructure (Internal/Future Use) */}
           {/* Domain picker hidden for future ML-driven classification as per user request */}

           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] italic">
                {activeTab === 'hubs' ? 'Active Territories' : 'Recent Proofs of Work'}
              </h2>
              {localStorage.getItem('role') === 'seller' && (
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) return navigate('/login');
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Launch Your Territory
                </button>
              )}
        </div>

        {activeTab === 'hubs' ? (
          <>
            {communities.filter(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              c.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 transition-all">
                <RocketLaunchIcon className="w-20 h-20 mx-auto text-primary-500/20 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No Territories Found</h3>
                <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 mb-8 italic font-medium">
                  The network is vast. Try adjusting your lens or launch the first hub in this category.
                </p>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) return navigate('/login');
                    setIsModalOpen(true);
                  }}
                  className="px-8 py-3 bg-primary-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary-500/20"
                >
                  Create Territory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities
                  .filter(c => 
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    c.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((community) => (
                  <div 
                    key={community._id}
                    onClick={() => navigate(`/communities/${community._id}`)}
                    className="group glass-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-800"
                  >
                    <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      {community.image ? (
                        <img src={community.image} alt={community.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <UserGroupIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase">
                          {community.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <UserGroupIcon className="w-3 h-3" />
                          {community.members?.length || 0}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                        {community.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2 italic">
                        {community.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {globalPosts
              .filter(p => 
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length > 0 ? (
              globalPosts
                .filter(p => 
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(post => (
                  <PostCard key={post._id} post={post} />
                ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                <FireIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No activity matches your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200 dark:border-slate-700 translate-y-0 opacity-100">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white" id="modal-title">New Community</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <form id="create-comm-form" onSubmit={handleCreateSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Nairobi Software Devs" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
                      value={newCommunity.name}
                      onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
                      value={newCommunity.category}
                      onChange={e => setNewCommunity({...newCommunity, category: e.target.value})}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Creative">Creative</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                    <textarea 
                      rows={3} 
                      placeholder="What is this community about?" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
                      value={newCommunity.description}
                      onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Cover Image</label>
                    <div className="relative">
                      <label className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <PhotoIcon className="h-5 w-5 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {newCommunity.image ? 'Image Selected ✓' : 'Choose Cover Image'}
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
                                setNewCommunity({...newCommunity, image: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/30 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button 
                  type="submit" 
                  form="create-comm-form"
                  disabled={creating}
                  className="w-full inline-flex justify-center rounded-full px-8 py-2.5 bg-primary-600 text-base font-bold text-white hover:bg-primary-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50 transition-all shadow-lg shadow-primary-500/30"
                >
                  {creating ? 'Creating...' : 'Create Community'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-full border border-slate-300 dark:border-slate-600 px-8 py-2.5 bg-white dark:bg-slate-800 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:mt-0 sm:w-auto sm:text-sm transition-all"
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
};

export default Communities;
