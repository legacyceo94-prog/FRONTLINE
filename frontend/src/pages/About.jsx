import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  FireIcon,
  CpuChipIcon,
  SignalIcon,
  StarIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  ScaleIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white">
      
      {/* Cinematic Hero: The Operating System of Truth */}
      <div className="relative pt-40 pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-primary-600/10 text-white dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700 border border-white/10 dark:border-primary-500/20">
               Operating System for Professional Truth
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-10 italic uppercase">
              The Art of <br />
              <span className="text-primary-600">Proof.</span>
            </h1>
            <p className="max-w-3xl text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Frontline is a **Meritocratic Engine** designed to scale reputation through evidence. We’ve replaced the "Cloud of Noise" with a **Systematic Protocol of Competence.**
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <Link to="/signup" className="px-12 py-6 bg-primary-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-primary-500/40">
                 Claim Your Cockpit
               </Link>
               <Link to="/communities" className="px-12 py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white dark:hover:bg-slate-700 transition-all">
                 Enter the Pulse
               </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        
        {/* Core Philosophy: Competence as Currency */}
        <div className="mb-40 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 block">Manifesto 01</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-8">
              Zero-Base <br />Truth Protocol
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
              On Frontline, you don't grow by being loud; you grow by being **Provable**. Every professional enters the network at **0% Trust**. 
              Your reputation is a direct outcome of your proofs-of-work, your Hub activity, and your real-world network reception.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <BoltIcon className="w-6 h-6 text-primary-600 mb-3" />
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Eliminate Noise</h4>
                  <p className="text-sm text-slate-500 font-medium">No vanity metrics. Just verified handshakes and earned status.</p>
               </div>
               <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-primary-600 mb-3" />
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">High Fidelity</h4>
                  <p className="text-sm text-slate-500 font-medium">Turn your skills into Expert Assets that communicate for you.</p>
               </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
             <div className="absolute -inset-4 bg-primary-600/20 blur-[100px] rounded-full"></div>
             <div className="relative aspect-square bg-slate-900 rounded-[3rem] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-indigo-600/20"></div>
                <div className="text-center relative z-10">
                   <div className="text-8xl font-black text-white italic mb-2 tracking-tighter transition-all hover:scale-110">0%</div>
                   <div className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em]">Baseline Truth</div>
                </div>
             </div>
          </div>
        </div>

        {/* Dual Mode Infrastructure */}
        <div className="mb-40">
           <div className="text-center mb-20">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 block">The Binary OS</span>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">A Tale of Two Worlds</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* The Studio */}
              <div className="group relative bg-slate-900 rounded-[4rem] p-16 overflow-hidden border border-white/5 transition-all hover:border-primary-500/50 shadow-2xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6">The Private Studio</h3>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                    For the **Producer**. A high-integrity cockpit where you formalize your work into Expert Bundles. It’s not a profile; it’s a **Studio for reputation construction.**
                 </p>
                 <ul className="space-y-4">
                    {['Asset Construction', 'Workshop Metrics', 'Network Reception Feed', 'Trust Transmission Control'].map(feature => (
                       <li key={feature} className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                          {feature}
                       </li>
                    ))}
                 </ul>
              </div>

              {/* The Pulse */}
              <div className="group relative bg-white dark:bg-slate-800 rounded-[4rem] p-16 overflow-hidden border border-slate-100 dark:border-slate-700 transition-all hover:border-primary-500/50 shadow-xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-6">The Market Pulse</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed mb-10">
                    For the **Consumer**. A live broadcast of competence. Join Territories, discover innovations, and initiate the **Handshake Economy.**
                 </p>
                 <ul className="space-y-4">
                    {['Territory Discovery', 'Live Truth Broadcast', 'Expert Bundle Navigation', 'Verified Participant Portal'].map(feature => (
                       <li key={feature} className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                          {feature}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* The Trust Transmission Unit */}
        <div className="py-32 border-y border-slate-200 dark:border-slate-800 mb-40">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-500 mb-8 border border-amber-100 dark:border-amber-900/20">
                    <StarIconSolid className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Handshake Logic</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    We replaced likes with **Handshakes**. A rating is a locked validation of truth. One Vote. One Handshake. Zero Noise.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-3xl bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 mb-8 border border-primary-100 dark:border-primary-900/20">
                    <ShieldCheckIcon className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Trust Transmission</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                   Reputation is not static; it is **Transmitted** through Hub activity and proof-of-work broadcasts. Scale your signal power from 0 to 99%.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-3xl bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-green-600 mb-8 border border-green-100 dark:border-green-900/20">
                    <CurrencyDollarIcon className="w-10 h-10" />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Outcome Bundles</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    You don't just sell services; you deploy **Solution Bundles**. An organized asset that buyers can handshake on instantly.
                 </p>
              </div>
           </div>
        </div>
        {/* System Capabilities - The Features */}
        <div className="mb-40">
           <div className="text-center mb-20">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4 block">The Feature Stack</span>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Engineered for Power</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                 { title: "Real-Time Pulse", desc: "Live community feeds and instant interaction updates.", icon: <SignalIcon className="w-6 h-6"/> },
                 { title: "Secure Handshakes", desc: "Review system locked to verified transactions.", icon: <ShieldCheckIcon className="w-6 h-6"/> },
                 { title: "Dark Mode Native", desc: "Designed for late-night production sessions.", icon: <GlobeAltIcon className="w-6 h-6"/> },
                 { title: "Asset Management", desc: "Full studio tools to curate your professional portfolio.", icon: <BriefcaseIcon className="w-6 h-6"/> },
                 { title: "Territory Logic", desc: "Organized hubs for niche-specific dominance.", icon: <UserGroupIcon className="w-6 h-6"/> },
                 { title: "Zero-Latency", desc: "Optimized indexing for instant data retrieval.", icon: <BoltIcon className="w-6 h-6"/> },
                 { title: "Identity Proof", desc: "Verification badges for proven experts.", icon: <CheckBadgeIcon className="w-6 h-6"/> },
                 { title: "Value Bundles", desc: "Sell outcomes, not just hours.", icon: <CurrencyDollarIcon className="w-6 h-6"/> }
              ].map((card, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-primary-500 transition-all hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-none">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                       {card.icon}
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{card.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                 </div>
              ))}
           </div>
        </div>
        {/* Final Visionary CTA */}
        <div className="relative rounded-[5rem] bg-slate-900 p-20 md:p-32 text-center overflow-hidden shadow-2xl border border-white/5">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-indigo-600/20"></div>
           <div className="absolute p-96 bg-primary-600/20 blur-[150px] rounded-full -top-48 -right-48 animate-pulse"></div>
           
           <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em] mb-10">The Network of experts</span>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic mb-12">
                Deploy Your <br />Innovation.
              </h2>
              <p className="max-w-2xl text-2xl text-slate-400 font-medium leading-relaxed mb-16">
                Move away from noisy social feeds toward a dedicated **Operating System** for your professional future.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                 <Link to="/signup" className="px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-white/10 shadow-2xl">
                    Claim Your Cockpit
                 </Link>
                 <Link to="/communities" className="px-16 py-7 bg-slate-800 text-white border border-white/10 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-slate-700 transition-all">
                    Browse the Pulse
                 </Link>
              </div>
           </div>
        </div>

      </div>

      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900/50">
         <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-primary-600 flex items-center justify-center text-white font-black text-xs border border-white/10 shadow-lg">F</div>
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] text-sm">Frontline v1.0</span>
         </div>
         <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.5em] mb-4">The Meritocratic Engine for Professional Truth</p>
         <div className="flex justify-center gap-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-primary-500 transition-colors">Protocol</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Territories</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Truth Algorithm</a>
         </div>
      </footer>

    </div>
  );
}
