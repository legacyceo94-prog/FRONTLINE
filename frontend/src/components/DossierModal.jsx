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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

export default function DossierModal({ isOpen, onClose, course }) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('Inquiry');
  const [step, setStep] = useState(1); // 1: Dossier, 2: Syncing, 3: Contact Ready
  
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-5xl max-h-[95vh] rounded-[1.5rem] md:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Close Button - positioned relative to modal container */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 md:p-3 bg-black/70 hover:bg-white/10 rounded-full transition-colors"
        >
          <XMarkIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {step === 1 && (
          <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[95vh]">
            {/* LEFT: Visual Impact */}
            <div className="lg:w-1/2 h-48 md:h-64 lg:h-auto lg:min-h-[600px] bg-slate-800 flex-shrink-0 relative">
              {flyerImage ? (
                <img 
                  src={flyerImage} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                  {isService ? <RocketLaunchIcon className="w-16 h-16 md:w-20 md:h-20 opacity-30" /> : <CubeIcon className="w-16 h-16 md:w-20 md:h-20 opacity-30" />}
                  <span className="text-[10px] font-black uppercase tracking-widest mt-4">No Visual Uplink</span>
                </div>
              )}
              {/* Type Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600/90 backdrop-blur-md text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg">
                {isService ? <RocketLaunchIcon className="w-3 h-3 md:w-4 md:h-4" /> : <CubeIcon className="w-3 h-3 md:w-4 md:h-4" />}
                {isService ? 'Service' : 'Product'}
              </div>
            </div>

            {/* RIGHT: Technical Specs - scrollable on all devices */}
            <div className="lg:w-1/2 p-6 md:p-10 flex flex-col">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{course.category}</span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-tight mt-2">
                  {course.title}
                </h2>
              </div>

              {/* Seller Info */}
              <Link to={`/profile/${course.seller?._id}`} onClick={onClose} className="flex items-center gap-3 mb-6 md:mb-8 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                  {course.seller?.profileImage ? (
                    <img src={course.seller.profileImage} alt={course.seller.username} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-white uppercase tracking-tighter">@{course.seller?.username}</span>
                    {course.seller?.isVerified && <CheckBadgeIcon className="w-4 h-4 text-blue-500" />}
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inventory Node</span>
                </div>
              </Link>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-400 font-medium italic mb-6 md:mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Dynamic Spec Sheet */}
              <div className="bg-black/30 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/5">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
                  {isService ? 'Service Blueprint' : 'Technical Specifications'}
                </h4>

                {isService ? (
                  // --- SERVICE: Roadmap + Badges ---
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
                      <div className="px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-2">
                        <BoltIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                        <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">{course.skuDetails?.skillLevel || 'Intermediate'}</span>
                      </div>
                      <div className="px-2.5 py-1.5 md:px-3 md:py-2 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-2">
                        <ClockIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                        <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">{course.skuDetails?.duration || 'Flexible'}</span>
                      </div>
                    </div>
                    
                    {course.skuDetails?.roadmap?.length > 0 && (
                      <div className="space-y-2 md:space-y-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Delivery Roadmap</span>
                        {course.skuDetails.roadmap.map((roadmapStep, i) => (
                          <div key={i} className="flex items-start gap-2 md:gap-3">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-xs md:text-sm text-white font-medium italic">{roadmapStep}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // --- PRODUCT: Specs + Stock ---
                  <div className="space-y-4">
                    {course.skuDetails?.stockCount > 0 && (
                      <div className="px-3 py-2 md:px-4 md:py-3 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-2">
                        <CubeIcon className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                        <span className="text-xs md:text-sm font-black text-green-500 uppercase tracking-tight">
                          {course.skuDetails.stockCount <= 5 ? `Only ${course.skuDetails.stockCount} Left!` : `${course.skuDetails.stockCount} In Stock`}
                        </span>
                      </div>
                    )}

                    {course.skuDetails?.specifications?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hardware Specs</span>
                        <div className="grid grid-cols-2 gap-2">
                          {course.skuDetails.specifications.map((spec, i) => (
                            <div key={i} className="p-2 md:p-3 bg-slate-800 rounded-xl border border-white/5">
                              <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{spec.key}</span>
                              <span className="text-xs md:text-sm font-black text-white uppercase tracking-tight">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Community Bridge (Bottomline) */}
              <div className="p-3 md:p-4 bg-blue-500/5 rounded-xl border-l-4 border-blue-600 mb-6 md:mb-8">
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 italic leading-relaxed">
                  <span className="text-white font-black">Static specs are just the foundation.</span> Follow the pulse and see live deployments in our <span className="text-blue-500 font-black uppercase">Community Hubs</span>.
                </p>
                <Link to="/communities" onClick={onClose} className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 inline-block hover:underline">
                  Enter the Pulse →
                </Link>
              </div>

              {/* Price & Sync Action */}
              <div className="mt-auto pt-4 md:pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment</span>
                  <span className="text-2xl md:text-3xl font-black text-blue-500 tracking-tighter italic">
                    {course.skuDetails?.price ? `KES ${course.skuDetails.price.toLocaleString()}` : 'NEGOTIABLE'}
                  </span>
                </div>

                {/* Purpose Selector */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3">Protocol Purpose</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Inquiry', 'Purchase', 'Support', 'Custom'].map(p => (
                      <button 
                        key={p}
                        onClick={() => setPurpose(p)}
                        className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border ${purpose === p ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleSync}
                  className="w-full py-4 md:py-5 bg-white text-slate-900 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 md:gap-3 mb-4"
                >
                  <ShieldCheckIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Authenticate Handshake
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-32 text-center animate-in zoom-in-95 duration-500">
             <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
             <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Logging Handshake Protocol...</h4>
             <p className="text-xs text-slate-500 italic mt-4">Structural records update in progress.</p>
          </div>
        )}

        {step === 3 && (
          <div className="py-24 px-10 text-center animate-in fade-in slide-in-from-bottom-4">
             <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <ShieldCheckIcon className="w-10 h-10 text-green-500" />
             </div>
             <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Protocol Verified.</h4>
             <p className="text-xs text-slate-500 italic mb-10">Connectivity established via Imperial Network Sync.</p>
             
             <a 
               href={`https://wa.me/${course.seller?.sellerProfile?.phone?.replace(/\D/g, '')?.replace(/^0/, '254')}?text=${encodeURIComponent(`Sync Protocol Verified [${purpose}]: Checking on "${course.title}" status.`)}`}
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 active:scale-95"
             >
               <ChatBubbleLeftRightIcon className="w-5 h-5" />
               Launch Live Connection
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
