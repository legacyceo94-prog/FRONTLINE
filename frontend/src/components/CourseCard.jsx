import { Link } from 'react-router-dom';
import { CurrencyDollarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { UserIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function CourseCard({ course }) {
  // Fallback image if no flyer is uploaded
  const flyerImage = course.media?.flyerImage || 'https://via.placeholder.com/400x300?text=No+Flyer';
  
  return (
    <div className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Flyer Image */}
      <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img 
          src={flyerImage} 
          alt={course.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-slate-800 dark:text-slate-200 shadow-sm">
          {course.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
            {course.title}
          </h3>
        </div>

        {/* Seller Info */}
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.

        <Link to={`/profile/${course.seller?._id}`} className="flex items-center gap-1 mb-4 hover:opacity-80 transition-opacity">
          <UserIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {course.seller?.username || 'Unknown Seller'}
          </span>
          {course.seller?.isVerified && (
             <CheckBadgeIcon className="w-4 h-4 text-primary-500" title="Verified Competence" />
          )}
        </Link>

        {/* Details Row */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="flex items-center gap-1">
             <ClockIcon className="w-4 h-4" />
             {course.skuDetails?.duration || 'Flexible'}
          </span>
          <span className="font-bold text-primary-600 dark:text-primary-400 text-lg flex items-center">
             {course.skuDetails?.price ? `KES ${course.skuDetails.price.toLocaleString()}` : 'Free'}
          </span>
        </div>
      </div>
    </div>
  );
}
