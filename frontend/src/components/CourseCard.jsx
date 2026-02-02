import { Link } from 'react-router-dom';
import { CheckBadgeIcon, RocketLaunchIcon, CubeIcon } from '@heroicons/react/24/solid';
import { UserIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function CourseCard({ course }) {
  const flyerImage = course.media?.flyerImage;
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-full group hover:border-blue-500/30 transition-all duration-500">
      {/* Flyer Image Area */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {flyerImage ? (
          <>
            <img 
              src={flyerImage} 
              alt={course.title} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden flex-col items-center gap-3 text-slate-300 dark:text-slate-700">
               {course.type === 'product' ? <CubeIcon className="w-12 h-12 opacity-20" /> : <RocketLaunchIcon className="w-12 h-12 opacity-20" />}
               <span className="text-[8px] font-black uppercase tracking-[0.3em]">No Visual Uplink</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-300 dark:text-slate-700">
             {course.type === 'product' ? <CubeIcon className="w-12 h-12 opacity-20" /> : <RocketLaunchIcon className="w-12 h-12 opacity-20" />}
             <span className="text-[8px] font-black uppercase tracking-[0.3em]">No Visual Uplink</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
           <div className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
              {course.type === 'product' ? <CubeIcon className="w-3 h-3" /> : <RocketLaunchIcon className="w-3 h-3" />}
              {course.type === 'product' ? 'Product' : 'Service'}
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="mb-4">
           <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{course.category}</span>
           <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white line-clamp-2 uppercase tracking-tighter italic leading-tight group-hover:text-blue-600 transition-colors mt-2">
             {course.title}
           </h3>
        </div>

        <Link to={`/profile/${course.seller?._id}`} className="flex items-center gap-3 mb-6 md:mb-8 group/seller transition-all">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden ring-2 ring-transparent group-hover/seller:ring-blue-500 transition-all">
            {course.seller?.profileImage ? (
              <img src={course.seller.profileImage} alt={course.seller.username} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col">
             <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">
                  {course.seller?.username || 'Anonymous'}
                </span>
                {course.seller?.isVerified && (
                  <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500" />
                )}
             </div>
             <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Inventory Node</span>
          </div>
        </Link>

        {/* Pricing & Logistics */}
        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                 {course.type === 'product' ? <CubeIcon className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />}
                 <span className="text-[10px] font-black uppercase tracking-widest">{course.type === 'product' ? 'In Stock' : (course.skuDetails?.duration || 'Flexible')}</span>
              </div>
              <div className="text-right">
                 <span className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter italic">
                    {course.skuDetails?.price ? `KES ${course.skuDetails.price.toLocaleString()}` : 'NEGOTIABLE'}
                 </span>
              </div>
           </div>

           {course.seller?.sellerProfile?.phone && (
             <a 
               href={`https://wa.me/${course.seller.sellerProfile.phone.replace(/\D/g, '').replace(/^0/, '254')}?text=${encodeURIComponent(`Protocol Check: interested in Asset "${course.title}". Confirm status?`)}`}
               target="_blank"
               rel="noreferrer"
               className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95"
             >
               Sync Protocol
             </a>
           )}
        </div>
      </div>
    </div>
  );
}
