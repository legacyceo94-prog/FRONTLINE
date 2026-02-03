import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ClockIcon, ShoppingBagIcon, StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('ratings');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userRes = await api.get(`/api/users/${userId}`);
        
        // Get ratings given by this user
        setRatings(userRes.data.ratingsGiven || []);
        
        // Get comments made by this user (from their activity)
        setComments(userRes.data.commentsGiven || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <span className="font-black uppercase text-[10px] tracking-widest text-slate-400">Loading History...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-32 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Your Activity</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
            History<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm italic">
            Track your interactions across the network.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('ratings')}
            className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'ratings' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <StarIcon className="w-4 h-4" />
            Reviews Given
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'activity' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Comments
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'ratings' ? (
            ratings.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                <StarIcon className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="font-black uppercase tracking-tighter text-xl italic text-slate-300 dark:text-slate-700">No Reviews Yet</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Rate sellers to build trust on the network.</p>
                <Link to="/marketplace" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">
                  Explore Marketplace
                </Link>
              </div>
            ) : (
              ratings.map((rating, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Link to={`/profile/${rating.seller?._id}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {rating.seller?.profileImage ? (
                          <img src={rating.seller.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {rating.seller?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{rating.seller?.username}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(rating.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <StarIconSolid key={s} className={`w-4 h-4 ${s <= rating.stars ? 'text-blue-500' : 'text-slate-200 dark:text-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{rating.comment}"</p>
                  )}
                </div>
              ))
            )
          ) : (
            comments.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                <ChatBubbleLeftIcon className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="font-black uppercase tracking-tighter text-xl italic text-slate-300 dark:text-slate-700">No Comments Yet</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Engage with posts to show your activity.</p>
                <Link to="/communities" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all">
                  Join Communities
                </Link>
              </div>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      On: {comment.postTitle || 'A Post'}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{comment.text}"</p>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
}
