import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  XMarkIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon, 
  CubeIcon, 
  ClockIcon, 
  BoltIcon,
  CheckBadgeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

export default function DossierModal({ isOpen, onClose, course }) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('Inquiry');
  const [step, setStep] = useState(1);
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuth = !!token;
  const isService = course?.type === 'service';

  const handleSync = async () => {
    if (!isAuth) {
       navigate('/login');
       return;
    }

    setStep(2);
    try {
      await api.post('/api/connections', {
        sellerId: course.seller?._id,
        itemId: course._id,
        itemModel: 'Course',
        purpose
      });
      
      setTimeout(() => {
        setStep(3);
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) return;
      setStep(1);
      alert("Sync Protocol Interrupted. Please check connectivity.");
    }
  };

  if (!isOpen || !course) return null;

  const flyerImage = course.media?.flyerImage;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Full-Screen Mobile / Centered Desktop */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-black w-full md:max-w-2xl max-h-[100vh] md:max-h-[90vh] md:rounded-[2rem] border-t md:border border-white/10 overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
        >
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>

        {step === 1 && (
          <div className="flex flex-col overflow-y-auto">
            
            {/* HERO IMAGE SECTION */}
            <div className="relative h-56 md:h-72 flex-shrink-0 overflow-hidden">
              {flyerImage ? (
                <>
                  <img 
                    src={flyerImage} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-slate-900 flex flex-col items-center justify-center">
                  {isService ? <RocketLaunchIcon className="w-16 h-16 text-blue-500/30" /> : <CubeIcon className="w-16 h-16 text-blue-500/30" />}
                </div>
              )}
              
              {/* Floating Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="px-3 py-1.5 bg-blue-600 text-[9px] font-black text-white uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/30">
                  {isService ? <RocketLaunchIcon className="w-3 h-3" /> : <CubeIcon className="w-3 h-3" />}
                  {isService ? 'Service' : 'Product'}
                </div>
                <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full">
                  {course.category}
                </div>
              </div>

              {/* Title Overlay on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
                  {course.title}
                </h2>
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="p-5 md:p-6 flex flex-col gap-5">
              
              {/* Seller Row */}
              <Link to={`/profile/${course.seller?._id}`} onClick={onClose} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-blue-500 transition-all">
                  {course.seller?.profileImage ? (
                    <img src={course.seller.profileImage} alt={course.seller.username} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-white">@{course.seller?.username}</span>
                    {course.seller?.isVerified && <CheckBadgeIcon className="w-4 h-4 text-blue-500" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seller</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-500">
                    {course.skuDetails?.price ? `KES ${course.skuDetails.price.toLocaleString()}` : 'TBD'}
                  </span>
                </div>
              </Link>

              {/* Description */}
              {course.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {course.description}
                </p>
              )}

              {/* SPEC CARDS */}
              <div className="grid grid-cols-2 gap-3">
                {isService ? (
                  <>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <BoltIcon className="w-5 h-5 text-blue-500 mb-2" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Level</span>
                      <span className="text-sm font-black text-white">{course.skuDetails?.skillLevel || 'Intermediate'}</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <ClockIcon className="w-5 h-5 text-blue-500 mb-2" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Duration</span>
                      <span className="text-sm font-black text-white">{course.skuDetails?.duration || 'Flexible'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-4 rounded-2xl border ${course.skuDetails?.stockCount > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <CubeIcon className={`w-5 h-5 mb-2 ${course.skuDetails?.stockCount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Stock</span>
                      <span className={`text-sm font-black ${course.skuDetails?.stockCount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {course.skuDetails?.stockCount > 0 ? `${course.skuDetails.stockCount} Available` : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <SparklesIcon className="w-5 h-5 text-blue-500 mb-2" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Condition</span>
                      <span className="text-sm font-black text-white">New</span>
                    </div>
                  </>
                )}
              </div>

              {/* Roadmap for Services */}
              {isService && course.skuDetails?.roadmap?.filter(s => s && s.trim()).length > 0 && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-3">Delivery Process</span>
                  <div className="space-y-2">
                    {course.skuDetails.roadmap.filter(s => s && s.trim()).map((roadmapStep, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm text-white">{roadmapStep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications for Products */}
              {!isService && course.skuDetails?.specifications?.filter(s => s.key && s.key.trim()).length > 0 && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-3">Specifications</span>
                  <div className="grid grid-cols-2 gap-2">
                    {course.skuDetails.specifications.filter(s => s.key && s.key.trim()).map((spec, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{spec.key}</span>
                        <span className="text-sm font-bold text-white">{spec.value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Bridge */}
              <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    See live reviews and updates in our <span className="text-blue-400 font-bold">Community Hubs</span>.
                  </p>
                </div>
                <Link to="/communities" onClick={onClose} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline shrink-0">
                  View →
                </Link>
              </div>

              {/* Purpose Selector */}
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Your Intent</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Inquiry', 'Purchase', 'Support', 'Custom'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all ${purpose === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleSync}
                className="w-full py-4 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-wide hover:bg-blue-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 mb-16 md:mb-0"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                Connect with Seller
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-32 text-center animate-in zoom-in-95 duration-500">
             <div className="w-14 h-14 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
             <h4 className="text-sm font-black text-white uppercase tracking-widest">Connecting...</h4>
             <p className="text-xs text-slate-500 mt-2">Logging handshake protocol</p>
          </div>
        )}

        {step === 3 && (
          <div className="py-20 px-8 text-center animate-in fade-in slide-in-from-bottom-4">
             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-green-500" />
             </div>
             <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Connection Verified</h4>
             <p className="text-sm text-slate-400 mb-8">You can now contact the seller directly.</p>
             
             <a 
               href={`https://wa.me/${course.seller?.sellerProfile?.phone?.replace(/\D/g, '')?.replace(/^0/, '254')}?text=${encodeURIComponent(`Hi! I'm interested in "${course.title}" [${purpose}]`)}`}
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-sm font-black uppercase tracking-wide transition-all shadow-xl shadow-green-500/20"
             >
               <ChatBubbleLeftRightIcon className="w-5 h-5" />
               Open WhatsApp
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
