import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon, 
  HandThumbUpIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Simple Hero: The Goal */}
      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-500/10">
               Welcome to Frontline
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-8 uppercase italic">
               Real Skills. <br />Real <span className="text-blue-600">Proof.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 italic">
              Frontline is a simple community where people grow based on what they can actually do. We focus on real work and honest reviews, giving everyone a fair chance to succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link to="/signup" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                  Get Started
               </Link>
               <Link to="/marketplace" className="px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all active:scale-95">
                  Browse Marketplace
               </Link>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* The Simple Promise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20">
              <ShieldCheckIcon className="w-10 h-10 text-blue-600 mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">No Fake Talk</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">We value honest results. Your reputation is built on the ratings you earn from real people.</p>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-blue-600 mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Direct Chat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">No middle-men. Once you find what you need, chat directly on WhatsApp to get things moving.</p>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20">
              <SparklesIcon className="w-10 h-10 text-blue-600 mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Fair For All</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Whether you are selling a product or a service, Frontline gives you the tools to grow.</p>
           </div>
        </div>

        {/* How it Works: Two Simple Sides */}
        <div className="mb-32">
           <div className="bg-slate-900 dark:bg-slate-950 rounded-[4rem] p-10 md:p-20 overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
                 {/* For Sellers */}
                 <div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 block">For Professionals</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-8">Grow Your <br /><span className="text-blue-500">Business.</span></h2>
                    <ul className="space-y-6">
                       {[
                         { title: "List Your Skills", desc: "Post your services or products easily." },
                         { title: "Get Rated", desc: "Build trust with reviews from happy customers." },
                         { title: "Manage Orders", desc: "Keep track of everything in your dashboard." }
                       ].map((item, idx) => (
                          <li key={idx} className="flex gap-4">
                             <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-500 font-black text-[10px]">{idx + 1}</div>
                             <div>
                                <h4 className="text-white font-black uppercase tracking-tighter italic text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                             </div>
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* For Buyers */}
                 <div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 block">For Seekers</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-8">Find What You <br /><span className="text-blue-500">Need.</span></h2>
                    <ul className="space-y-6">
                       {[
                         { title: "Search Simply", desc: "Filter by category to find exactly what you want." },
                         { title: "See the Proof", desc: "Check ratings and previous work before you buy." },
                         { title: "Connect Fast", desc: "Start a conversation on WhatsApp with one click." }
                       ].map((item, idx) => (
                          <li key={idx} className="flex gap-4">
                             <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-500 font-black text-[10px]">{idx + 1}</div>
                             <div>
                                <h4 className="text-white font-black uppercase tracking-tighter italic text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                             </div>
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Closing Call */}
        <div className="text-center py-20">
           <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-10">
              Ready to <span className="text-blue-600">Join?</span>
           </h2>
           <div className="flex justify-center gap-6">
              <Link to="/signup" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Create Account</Link>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <a href="https://wa.me/254712345678" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Contact Support</a>
           </div>
        </div>

      </div>

      <footer className="py-20 border-t border-slate-100 dark:border-white/5 text-center bg-slate-50 dark:bg-slate-900/50">
         <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black italic">F</div>
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] text-xs">Frontline</span>
         </div>
         <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.5em]">Real Results. No Games.</p>
      </footer>

    </div>
  );
}
