import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  CheckBadgeIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  SignalIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon, 
  BoltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Cinematic Hero: The Operating System of Truth */}
      <div className="relative pt-48 pb-32 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-10 border border-emerald-500/20">
               Network Genesis
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] mb-12 uppercase italic">
               Art of <span className="text-emerald-600">Proof.</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-16 italic">
               "Frontline is a fair system built on real skills and proof. It grows people's reputation based on solid evidence — not just talk or popularity. We've created order and fairness by focusing only on real competence instead of the usual online chaos."
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Core Philosophy: Competence as Currency */}
        <div className="mb-48 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 block">Manifesto 01</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-8">
              Zero-Base <br />Truth Protocol
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
              On Frontline, you don't grow by being loud; you grow by being **Provable**. Every professional enters the network at **0% Trust**. 
              Your reputation is a direct outcome of your proofs-of-work, your Hub activity, and your real-world network reception.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <BoltIcon className="w-8 h-8 text-emerald-600 mb-6" />
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">Eliminate Noise</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">No vanity metrics. Just verified handshakes and earned status.</p>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <WrenchScrewdriverIcon className="w-8 h-8 text-emerald-600 mb-6" />
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">High Fidelity</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Turn your skills into Seller Assets that communicate for you.</p>
               </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
             <div className="absolute -inset-4 bg-emerald-600/20 blur-[100px] rounded-full"></div>
             <div className="relative aspect-square bg-slate-900 dark:bg-slate-950 rounded-[4rem] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-slate-900/20"></div>
                <div className="text-center relative z-10">
                   <div className="text-9xl font-black text-white italic mb-2 tracking-tighter">0%</div>
                   <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Baseline Truth</div>
                </div>
             </div>
          </div>
        </div>

        {/* The Divergent Engine: Dual-Path Infrastructure */}
        <div className="mb-48">
           <div className="text-center mb-24">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 block">The Divergent Engine</span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">A Tale of Two Cockpits</h2>
              <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium italic">One platform, two specialized operating systems tailored to your specific business identity.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* The Service Studio */}
              <div className="group relative bg-slate-900 dark:bg-slate-950 rounded-[4rem] p-16 overflow-hidden border border-white/10 transition-all hover:border-emerald-500/50 shadow-2xl">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Service Studio</h3>
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-8">Expertise & Time</div>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                    For the **Knowledge Producer**. A high-integrity cockpit where you formalize your expertise into Seller Bundles.
                 </p>
                 <ul className="space-y-5">
                    {['Territory Discovery', 'Live Truth Broadcast', 'Seller Bundle Navigation', 'Verified Buyer Portal'].map(feature => (
                       <li key={feature} className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                          {feature}
                       </li>
                    ))}
                 </ul>
              </div>

              {/* The Product Store */}
              <div className="group relative bg-slate-50 dark:bg-slate-900 rounded-[4rem] p-16 overflow-hidden border border-slate-200 dark:border-white/5 transition-all hover:border-emerald-500/50 shadow-xl shadow-slate-200/50 dark:shadow-none">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-2">Product Store</h3>
                 <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-8">Physical & Digital Goods</div>
                 <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed mb-12">
                    For the **Merchant Pilot**. A volume-focused cockpit designed for inventory management and scaling reach.
                 </p>
                 <ul className="space-y-5">
                    {['Inventory Health', 'Warehouse Velocity', 'Shipping Hubs', 'Catalog Scaling'].map(feature => (
                       <li key={feature} className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/20"></div>
                          {feature}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* The WhatsApp Pulse Fallback */}
        <div className="mb-48 relative group">
           <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-[5rem] animate-pulse"></div>
           <div className="relative bg-white dark:bg-slate-950 rounded-[4rem] p-12 md:p-20 border border-emerald-500/20 dark:border-white/10 overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                 <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
                       Crisis Navigation Fallback
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-10">
                       The WhatsApp <br />Pulse Protocol
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                       We understand that in real-world commerce, the cloud can flicker. Every listing on Frontline is armed with a **WhatsApp Pulse**—a direct communication bridge that ensures buyers never get "stranded" and transactions never stop.
                    </p>
                 </div>
                 <div className="w-full lg:w-96 flex justify-center">
                    <div className="w-64 h-64 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_100px_rgba(16,185,129,0.3)] animate-pulse relative">
                       <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping"></div>
                       <SignalIcon className="w-32 h-32" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* The Trust Transmission Unit */}
        <div className="py-32 border-y border-slate-100 dark:border-white/5 mb-48">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-10 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <StarIconSolid className="w-10 h-10" />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 italic">Handshake Logic</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic text-sm">
                    Replaced likes with **Handshakes**. A rating is a locked validation of truth. One Vote. One Handshake. Zero Noise.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-10 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon className="w-10 h-10" />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 italic">Trust Transmission</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic text-sm">
                   Reputation is not static; it is **Transmitted** through Hub activity and proof-of-work broadcasts. Scale your signal power from 0 to 99%.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-10 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <CurrencyDollarIcon className="w-10 h-10" />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 italic">Seller Assets</h4>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic text-sm">
                    Turn your skills into **Seller Assets**. Not just a portfolio, but a verifiable proof of value that buyers can trust instantly.
                 </p>
              </div>
           </div>
        </div>

        {/* System Capabilities */}
        <div className="mb-48">
           <div className="text-center mb-20">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4 block">The Feature Stack</span>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Engineered for Power</h2>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                 { title: "Real-Time Pulse", desc: "Live community feeds and instant interaction updates.", icon: <SignalIcon className="w-7 h-7"/> },
                 { title: "Secure Handshakes", desc: "Review system locked to verified transactions.", icon: <ShieldCheckIcon className="w-7 h-7"/> },
                 { title: "Dark Mode Native", desc: "Designed for late-night production sessions.", icon: <GlobeAltIcon className="w-7 h-7"/> },
                 { title: "Asset Management", desc: "Full studio tools to curate your professional portfolio.", icon: <BriefcaseIcon className="w-7 h-7"/> },
                 { title: "Hub Logic", desc: "Organized territories for niche-specific dominance.", icon: <UserGroupIcon className="w-7 h-7"/> },
                 { title: "Zero-Latency", desc: "Optimized indexing for instant data retrieval.", icon: <BoltIcon className="w-7 h-7"/> },
                 { title: "Identity Proof", desc: "Verification badges for proven experts.", icon: <CheckBadgeIcon className="w-7 h-7"/> },
                 { title: "Value Bundles", desc: "Sell outcomes, not just hours.", icon: <CurrencyDollarIcon className="w-7 h-7"/> }
              ].map((card, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none group">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-600 mb-8 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                       {card.icon}
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 italic">{card.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-relaxed">{card.desc}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Final Visionary CTA */}
        <div className="relative rounded-[5rem] bg-slate-900 dark:bg-slate-950 p-20 md:p-32 text-center overflow-hidden shadow-2xl border border-white/10">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 via-transparent to-slate-900"></div>
           
           <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-12">The Network of Experts</span>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic mb-14">
                Deploy Your <br />Innovation.
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                 <Link to="/signup" className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                    Initialize Cockpit
                 </Link>
                 <Link to="/communities" className="px-12 py-6 bg-transparent border-2 border-white/20 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all">
                    Browse the Pulse
                 </Link>
              </div>
           </div>
        </div>

      </div>

      <footer className="py-24 border-t border-slate-100 dark:border-white/5 text-center bg-white dark:bg-slate-950">
         <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg italic shadow-xl">F</div>
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] text-sm">Frontline v1.0</span>
         </div>
         <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.6em] mb-8">The Meritocratic Engine for Professional Truth</p>
         <div className="flex justify-center gap-10 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-emerald-500 transition-colors">Protocol</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Territories</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Algorithm</a>
         </div>
      </footer>

    </div>
  );
}
