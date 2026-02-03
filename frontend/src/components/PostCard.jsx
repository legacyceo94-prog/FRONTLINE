import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { UserIcon, ChatBubbleLeftIcon, StarIcon as StarOutlineIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

export default function PostCard({ post }) {
  const isFlyer = post.type === 'service' || post.type === 'product';
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [avgRating, setAvgRating] = useState(post.author?.averageRating || 0);
  const [ratingCount, setRatingCount] = useState(post.author?.ratings?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleRateAuthor = async (stars) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please sign in to rate.');
      
      const userId = localStorage.getItem('userId');
      if (userId === post.author?._id) return alert('You cannot rate yourself.');

      setIsRating(true);
      const res = await api.post(`/api/users/${post.author?._id}/rate`, { stars });
      
      setAvgRating(res.data.averageRating);
      setRatingCount(res.data.count);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to submit review.');
    } finally {
      setIsRating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please sign in to comment.');

      setIsCommenting(true);
      const res = await api.post(`/api/communities/posts/${post._id}/comment`, { text: commentText });
      
      setComments(Array.isArray(res.data) ? res.data : []);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Comment failed.');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 p-8 mb-8 transition-all group hover:border-blue-500/20">
      
      {/* Header: Author Integrity */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <Link to={`/profile/${post.author?._id}`} className="block relative group">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all shadow-inner">
              {post.author?.profileImage ? (
                 <img src={post.author.profileImage} alt={post.author.username} className="w-full h-full object-cover" />
              ) : (
                 <UserIcon className="w-7 h-7" />
              )}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.author?._id}`} className="hover:underline">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-lg leading-none">
                {post.author?.username || 'Phantom'}
                {post.author?.isVerified && (
                   <span className="ml-2 text-blue-600 text-[8px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-500/20 align-middle">Verified</span>
                )}
              </h4>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Community</span>
              {post.community && (
                <>
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  <Link to={`/communities/${post.community?._id || 'global'}`} className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest hover:underline flex items-center gap-1 group">
                     {post.community.name}
                     <RocketLaunchIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Trust Metric Dashboard */}
        <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
             <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
               {[1, 2, 3, 4, 5].map((s) => {
                 const hasAlreadyRated = post.author?.ratings?.some(r => r.author === localStorage.getItem('userId') || r.author?._id === localStorage.getItem('userId'));
                 const isActive = s <= (hoverRating || avgRating);
                 return (
                   <button
                     key={s}
                     disabled={isRating || hasAlreadyRated}
                     onClick={() => handleRateAuthor(s)}
                     onMouseEnter={() => setHoverRating(s)}
                     className="transition-transform hover:scale-150 disabled:cursor-not-allowed group/star"
                   >
                     {isActive ? (
                       <StarSolidIcon className="w-4 h-4 text-blue-500 transition-colors" />
                     ) : (
                       <StarOutlineIcon className="w-4 h-4 text-slate-200 dark:text-slate-800 transition-colors group-hover/star:text-blue-300" />
                     )}
                   </button>
                 );
               })}
             </div>
             <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-4 tracking-widest">
                <span className="text-slate-900 dark:text-white">{avgRating?.toFixed(1) || '0.0'}</span> ({ratingCount})
             </span>
        </div>
      </div>

      {/* Content Engine */}
      <div className="mb-8">
        <h3 className="font-black text-2xl md:text-3xl text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic leading-tight">{post.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap text-lg md:text-xl leading-relaxed font-medium italic">"{post.content}"</p>
      </div>

      {/* Visual Asset Area */}
      {post.media && post.media.length > 0 && (
        <div className="mb-10 rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 shadow-2xl">
            <img src={post.media[0]} alt="Broadcast media" className="w-full h-auto max-h-[600px] object-cover group-hover:scale-110 transition-transform duration-[2s]" />
        </div>
      )}

      {/* Interaction Matrix */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-white/5">
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-4 transition-all ${showComments ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
        >
          <ChatBubbleLeftIcon className={`w-7 h-7 ${showComments ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{comments.length > 0 ? `${comments.length} Comments` : 'Comment'}</span>
        </button>
        
         <div className="flex gap-4">
           <button 
             onClick={() => {
                if (post.author?.sellerProfile?.phone) {
                  const cleanPhone = post.author.sellerProfile.phone.replace(/\D/g, '').replace(/^0/, '254');
                  window.open(`https://wa.me/${cleanPhone}`, '_blank');
                } else {
                  // Contact protocol silent
                }
             }}
             className="px-8 py-3.5 bg-slate-900 dark:bg-slate-950 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95"
           >
             Chat
           </button>
           {isFlyer && (
             <button 
               onClick={() => {
                  const phone = post.author?.sellerProfile?.phone || '';
                  if (!phone) return;
                  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '254');
                  const message = `Hi, I'm interested in "${post.title}" on Frontline. Is it available?`;
                  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
               }}
               className="px-8 py-3.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
             >
               Buy
             </button>
           )}
         </div>
      </div>

      {/* Handshake Matrix (Comments) */}
      {showComments && (
        <div className="mt-10 pt-10 border-t border-slate-50 dark:border-white/10 animate-in fade-in slide-in-from-top-6 duration-700">
          <form onSubmit={handleAddComment} className="flex gap-5 mb-10">
            <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 dark:bg-slate-950 flex-shrink-0 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner border border-slate-100 dark:border-white/5">
               {localStorage.getItem('profileImage') ? (
                 <img src={localStorage.getItem('profileImage')} alt="Self" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-6 h-6" />
               )}
            </div>
            <div className="flex-1 flex gap-3">
              <input 
                type="text" 
                placeholder="Write a comment..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white font-bold italic"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isCommenting}
              />
              <button 
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-8 max-h-[500px] overflow-y-auto pr-6 custom-scrollbar">
            {comments.length === 0 ? (
              <div className="text-center py-16 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">No comments yet</p>
              </div>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="flex gap-5 animate-in fade-in slide-in-from-left-4 duration-500">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm">
                      {c.author?.profileImage ? (
                         <img src={c.author.profileImage} alt={c.author.username} className="w-full h-full object-cover" />
                      ) : (
                         <UserIcon className="w-5 h-5" />
                      )}
                   </div>
                   <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 rounded-[2.5rem] rounded-tl-none border border-slate-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                               {c.author?.username || 'Anonymous'}
                            </span>
                            {c.author?.isVerified && (
                              <span className="text-[8px] font-black text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase">Verified</span>
                            )}
                         </div>
                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Recent</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold italic">"{c.text}"</p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
