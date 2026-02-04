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
      
      {/* Action Layer: Interaction & Trust Overlay */}
      <div className="flex flex-col gap-6 relative">
        {/* The Asset Hero (Media First) */}
        {post.media && post.media.length > 0 && (
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-white/5 shadow-2xl group/media">
              <img src={post.media[0]} alt="Imperial Proof" className="w-full h-auto max-h-[700px] object-cover group-hover/media:scale-105 transition-transform duration-[3s]" />
              
              {/* Info Overlay (Glass) */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                 <div className="backdrop-blur-xl bg-blue-600/80 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl border border-white/20">
                    {post.type === 'discussion' ? 'Broadcast' : post.type === 'service' ? 'Professional Proof' : 'Retail Asset'}
                 </div>
                 {post.price && (
                   <div className="backdrop-blur-xl bg-black/60 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                      KES {post.price.toLocaleString()}
                   </div>
                 )}
              </div>

              {/* Verified Author Tag (Absolute Mini) */}
              <div className="absolute top-6 right-6">
                 <div className="backdrop-blur-xl bg-white/10 text-white p-1 rounded-full border border-white/20">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-blue-500/50">
                       {post.author?.profileImage ? (
                          <img src={post.author.profileImage} className="w-full h-full object-cover" />
                       ) : (
                          <UserIcon className="w-5 h-5" />
                       )}
                    </div>
                 </div>
              </div>
          </div>
        )}

        {/* The Intelligence Layer (Text & Narratives) */}
        <div className="pt-2">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h3 className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-2">{post.title}</h3>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-[1.5px] bg-blue-500"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none truncate">
                      @{post.author?.username} in {post.community?.name || 'Global Network'}
                   </span>
                </div>
             </div>
             {/* Dynamic Rating Matrix */}
             <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-slate-100 dark:border-white/5">
                <StarSolidIcon className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-black text-slate-900 dark:text-white">{avgRating?.toFixed(1)}</span>
                <span className="text-[10px] font-black text-slate-400">({ratingCount})</span>
             </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap text-lg leading-relaxed font-medium italic mb-8">
            "{post.content}"
          </p>
        </div>

        {/* Interaction Interface */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2.5 transition-all group ${showComments ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${showComments ? 'bg-blue-50' : 'bg-slate-50 dark:bg-slate-950'}`}>
                <ChatBubbleLeftIcon className={`w-5 h-5 ${showComments ? 'stroke-[2.5px]' : ''}`} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">{comments.length > 0 ? `${comments.length} Handshakes` : 'Handshake'}</span>
            </button>
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
                      className="transition-transform hover:scale-125 disabled:cursor-not-allowed"
                    >
                      <StarSolidIcon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : 'text-slate-200 dark:text-slate-800'}`} />
                    </button>
                  );
                })}
            </div>
          </div>
        
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
               Secure Asset
             </button>
           )}
         </div>
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
