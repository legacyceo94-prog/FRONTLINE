import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { UserIcon, ChatBubbleLeftIcon, ShareIcon, StarIcon as StarOutlineIcon, UserGroupIcon } from '@heroicons/react/24/outline';
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
      if (!token) return alert('Please sign in to rate this expert.');
      
      const userId = localStorage.getItem('userId');
      if (userId === post.author?._id) return alert('You cannot rate your own work.');

      setIsRating(true);
      const res = await api.post(`/api/users/${post.author._id}/rate`, { stars });
      
      setAvgRating(res.data.averageRating);
      setRatingCount(res.data.count);
      alert('✅ Rating recorded!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to rate');
    } finally {
      setIsRating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please sign in to participate in the pulse.');

      setIsCommenting(true);
      const res = await api.post(`/api/communities/posts/${post._id}/comment`, { text: commentText });
      
      setComments(Array.isArray(res.data) ? res.data : []);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to post comment');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-4 hover:shadow-md transition-shadow">
      {/* Header: Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${post.author?._id}`} className="block">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
            {post.author?.profileImage ? (
               <img src={post.author.profileImage} alt={post.author.username} className="w-full h-full object-cover" />
            ) : (
               <UserIcon className="w-6 h-6" />
            )}
          </div>
        </Link>
        <div>
          <Link to={`/profile/${post.author?._id}`} className="hover:underline">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {post.author?.username || 'Anonymous'}
              {post.author?.isVerified && (
                 <span className="ml-1 text-primary-500 text-xs text-[10px] border border-primary-500 rounded px-1">Verified</span>
              )}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2 hours ago</span>
            {post.community && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <Link to={`/communities/${post.community._id}`} className="text-[10px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                   <UserGroupIcon className="w-3 h-3" />
                   {post.community.name}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="mb-4">
        {post.author?.sellerProfile?.bio && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mb-2 line-clamp-1 border-l-2 border-slate-100 dark:border-slate-800 pl-2">
            {post.author.sellerProfile.bio}
          </p>
        )}
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 tracking-tight">{post.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Media / Flyer Area */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
           {/* Just showing first image for now */}
           <img src={post.media[0]} alt="Post media" className="w-full h-auto max-h-96 object-cover" />
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex gap-4">
           {/* Systematic Star Rating replaces Generic Like */}
           <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverRating(0)}>
               {[1, 2, 3, 4, 5].map((s) => {
                 const hasAlreadyRated = post.author?.ratings?.some(r => r.author === localStorage.getItem('userId') || r.author?._id === localStorage.getItem('userId'));
                 return (
                   <button
                     key={s}
                     disabled={isRating || hasAlreadyRated}
                     onClick={() => handleRateAuthor(s)}
                     onMouseEnter={() => setHoverRating(s)}
                     className="transition-transform hover:scale-125 disabled:cursor-not-allowed"
                     title={hasAlreadyRated ? "Trust has already been established." : ""}
                   >
                     {s <= (hoverRating || avgRating) ? (
                       <StarSolidIcon className="w-4 h-4 text-amber-500" />
                     ) : (
                       <StarOutlineIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                     )}
                   </button>
                 );
               })}
             </div>
             <span className="text-[10px] font-black text-slate-500 ml-2 tracking-tighter">
               {avgRating?.toFixed(1) || '0.0'} ({ratingCount})
             </span>
           </div>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors ${showComments ? 'text-primary-600' : 'text-slate-500 hover:text-primary-500'}`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm font-bold">Comment {comments.length > 0 && `(${comments.length})`}</span>
            </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => {
               if (post.author?.sellerProfile?.phone) {
                 const cleanPhone = post.author.sellerProfile.phone.replace(/\+/g, '').replace(/\s/g, '');
                 window.open(`https://wa.me/${cleanPhone}`, '_blank');
               } else {
                 alert("This user hasn't provided a contact number yet.");
               }
            }}
            className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Connect
          </button>
          {isFlyer && (
            <button 
              onClick={() => {
                 const phone = post.author?.sellerProfile?.phone || '254700000000';
                 const message = `Hi, I saw your asset "${post.title}" on Frontline. Is it still available?`;
                 const url = `https://wa.me/${phone.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
                 window.open(url, '_blank');
              }}
              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Order Now
            </button>
          )}
        </div>
      </div>

      {/* Comment Section (The Systematic Discussion Floor) */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-500 overflow-hidden">
               {localStorage.getItem('profileImage') ? (
                 <img src={localStorage.getItem('profileImage')} alt="Self" className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-4 h-4" />
               )}
            </div>
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                placeholder="Add to the handshake..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isCommenting}
              />
              <button 
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-4 py-2 bg-slate-900 dark:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
              <p className="text-center text-xs text-slate-400 italic py-4">The discussion is just beginning. Be the first to validate.</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="flex gap-3 group">
                   <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100 dark:border-slate-700">
                      {c.author?.profileImage ? (
                        <img src={c.author.profileImage} alt={c.author.username} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-3 h-3" />
                      )}
                   </div>
                   <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter hover:underline cursor-pointer">
                             {c.author?.username || 'Anonymous'}
                           </span>
                           {c.author?.isVerified && (
                             <span className="text-[8px] font-bold text-primary-500 border border-primary-500/30 px-1 rounded uppercase">Verified</span>
                           )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Just now</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{c.text}</p>
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
