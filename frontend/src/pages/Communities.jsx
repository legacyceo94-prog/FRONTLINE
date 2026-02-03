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
      const res = await api.get(`/api/communities/global/posts`);
      setGlobalPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch global pulse", err);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await api.get(`/api/communities`);
      setCommunities(Array.isArray(res.data) ? res.data : []);
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

      const res = await api.post(`/api/communities`, newCommunity, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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
      <div className="min-h-screen pt-24 flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-32">
      
      {/* Pulse Hero Section */}
      <div className="relative pt-32 pb-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-[100px] rounded-full"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                     <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Live Network Broadcast</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4 italic">
                     All <span className="text-blue-600">Communities.</span>
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                     Connect with experts and see their work.
                  </p>
               </div>
               
               <div className="w-full md:w-96 group">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                      <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search Communities..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-inner focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none dark:text-white transition-all font-bold italic"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
               </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex gap-8 mt-12 border-b border-slate-100 dark:border-white/5">
              <button 
                onClick={() => setActiveTab('hubs')}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${activeTab === 'hubs' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${activeTab === 'hubs' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <UserGroupIcon className="w-3 h-3" />
                </div>
                Communities
                {activeTab === 'hubs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('pulse')}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 relative ${activeTab === 'pulse' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${activeTab === 'pulse' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <FireIcon className="w-3 h-3" />
                </div>
                Live Feed
                {activeTab === 'pulse' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
              </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">
                {activeTab === 'hubs' ? 'Active Communities' : 'Recent Posts'}
              </h2>
              {(localStorage.getItem('role') === 'seller' || localStorage.getItem('role') === 'admin') && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Create Community
                </button>
              )}
        </div>

        {activeTab === 'hubs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communities
              .filter(c => 
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="col-span-full text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                  <RocketLaunchIcon className="w-20 h-20 mx-auto text-blue-500/20 mb-6" />
                  <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">No Communities Found</p>
                </div>
              ) : (
                communities
                  .filter(c => 
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    c.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((community) => (
                    <div 
                      key={community._id}
                      onClick={() => navigate(`/communities/${community._id}`)}
                      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                    >
                      <div className="h-40 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        {community.image ? (
                          <img src={community.image} alt={community.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                            <UserGroupIcon className="w-16 h-16" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full border border-white/40 dark:border-white/5">
                           <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{community.category}</span>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-tight">{community.name}</h3>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                            <UserGroupIcon className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500">{community.members?.length || 0}</span>
                          </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic line-clamp-2">"{community.description}"</p>
                      </div>
                    </div>
                  ))
              )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {globalPosts.length > 0 ? (
              globalPosts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                  <FireIcon className="w-20 h-20 mx-auto text-blue-500/20 mb-6" />
                  <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">No posts yet</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal - Simplified for mobile efficiency */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/40 dark:border-white/5">
              <div className="p-8">
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-8">Create Community</h3>
                 <form onSubmit={handleCreateSubmit} className="space-y-6">
                    <input 
                      type="text" 
                      placeholder="Community Name" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-bold italic"
                      value={newCommunity.name}
                      onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
                      required
                    />
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-bold italic"
                      value={newCommunity.category}
                      onChange={e => setNewCommunity({...newCommunity, category: e.target.value})}
                    >
                      {['Engineering', 'Technology', 'Business', 'Creative', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea 
                      placeholder="Description" 
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-bold italic"
                      value={newCommunity.description}
                      onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
                      required
                    />
                    <div className="flex gap-4">
                       <button type="submit" disabled={creating} className="flex-1 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                          {creating ? 'Creating...' : 'Create'}
                       </button>
                       <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl active:scale-95 transition-all">
                          Cancel
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
