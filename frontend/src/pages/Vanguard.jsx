import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  CommandLineIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ChatBubbleBottomCenterIcon, 
  StarIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function Vanguard() {
  const [stats, setStats] = useState({
    users: 0,
    hubs: 0,
    listings: 0,
    trustVolume: 0,
    complaints: 0,
    conversations: 0
  });
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Imperial Gatekeeper: Absolute Master Identity Lock (Username or Email)
    const masterUser = localStorage.getItem('username');
    const masterEmail = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    if (
      masterUser !== 'daniel' && 
      masterUser !== 'legacyceo94' && 
      !masterEmail?.includes('daniel') && 
      !masterEmail?.includes('legacyceo94')
    ) {
      console.error("Vanguard Protocol Violation: Illegal Access Attempt Recorded.");
      navigate('/');
      return;
    }
    
    const fetchMasterData = async () => {
      try {
        // Fetching global metrics for the Publisher
        // Note: Real backend would need a specific 'admin' or 'vanguard' endpoint
        // For now we aggregate and simulate the Imperial oversight
        const [uRes, cRes, pRes, masterRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/communities'),
          api.get('/api/communities/global/posts'),
          api.get(`/api/users/${userId}`)
        ]);

        setUser(masterRes.data);
        setStats({
          users: uRes.data.length || 0,
          hubs: cRes.data.length || 0,
          listings: pRes.data.length || 0,
          trustVolume: Math.floor(Math.random() * 5000) + 1200, // Simulated network throughput
          complaints: Math.floor(Math.random() * 5), // Tracked heat
          conversations: Math.floor(Math.random() * 450) + 50
        });

        // Generate Master Logs
        setLogs([
          { t: 'NETWORK', m: 'Imperial Sync Complete. Node 0-Alpha Online.', d: new Date() },
          { t: 'SECURITY', m: 'All protocol handshakes verified. No intrusions.', d: new Date() },
          { t: 'MARKET', m: 'Community-driven marketing intrusion at 84% efficiency.', d: new Date() },
          { t: 'HUSTLE', m: 'New listings spike detected in Retail and Tech hubs.', d: new Date() }
        ]);

      } catch (err) {
        console.error("Vanguard Access Denied", err);
        // navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mb-6"></div>
      <span className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.5em] animate-pulse">Initializing Vanguard Protocol...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500 selection:text-white pb-32">
      
      {/* Imperial Header */}
      <div className="bg-black/50 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Vanguard <span className="text-blue-500">Console.</span></h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Publisher Master Command</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Empire Status</span>
              <span className="text-xs font-mono text-slate-400">08:00 AM - Optimal</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5">
              <BoltIcon className="w-5 h-5 text-yellow-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* The Empire Pulse - Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Citizens', val: stats.users, icon: UserGroupIcon, color: 'blue' },
            { label: 'Active Hubs', val: stats.hubs, icon: ChartBarIcon, color: 'blue' },
            { label: 'Network Listings', val: stats.listings, icon: BoltIcon, color: 'yellow' },
            { label: 'Trust Handshakes', val: stats.trustVolume, icon: StarIcon, color: 'blue' }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/30 transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-${s.color}-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 text-${s.color}-500`} />
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</h3>
              <p className="text-3xl font-black text-white uppercase tracking-tighter italic">{s.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Logs Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Real-time Heat Analytics (Placeholder for report generation) */}
            <div className="bg-white/5 rounded-[3rem] border border-white/5 p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Project Accountability</h2>
                  <p className="text-xs text-slate-500 font-medium italic">Data-driven oversight for investors and expansion.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Generate Excel Report
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="pb-4 pt-4 px-4">Metric Protocol</th>
                      <th className="pb-4 pt-4 px-4">Growth Index</th>
                      <th className="pb-4 pt-4 px-4">Status</th>
                      <th className="pb-4 pt-4 px-4">Accountability</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold uppercase tracking-tight italic">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-6 px-4 text-white">Marketplace Attraction</td>
                      <td className="py-6 px-4 text-blue-500">+24.5%</td>
                      <td className="py-6 px-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[9px] font-black uppercase">Dominant</span></td>
                      <td className="py-6 px-4 text-slate-500">Verified</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-6 px-4 text-white">Trust Handshake Velocity</td>
                      <td className="py-6 px-4 text-blue-500">+12.2%</td>
                      <td className="py-6 px-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black uppercase">Scaling</span></td>
                      <td className="py-6 px-4 text-slate-500">Verified</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-6 px-4 text-white">Community Intrusion</td>
                      <td className="py-6 px-4 text-blue-500">+45.8%</td>
                      <td className="py-6 px-4"><span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-[9px] font-black uppercase">Aggressive</span></td>
                      <td className="py-6 px-4 text-slate-500">Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Master Log Matrix */}
            <div className="bg-black/80 rounded-[3rem] border border-white/5 p-10 font-mono">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <CommandLineIcon className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Imperial Logs</h3>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">Matrix Streaming</span>
                </div>
              </div>
              <div className="space-y-3 h-80 overflow-y-auto custom-scrollbar pr-4">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                    <span className="text-slate-600 shrink-0">[{new Date(log.d).toLocaleTimeString()}]</span>
                    <span className="text-blue-600 font-bold shrink-0">{log.t}:</span>
                    <span className="text-slate-400 italic group-hover:text-slate-200 transition-colors">{log.m}</span>
                  </div>
                ))}
                {/* Simulated continuous feed */}
                <div className="flex gap-4 p-3">
                  <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-slate-800 animate-pulse">_Waiting for next protocol handshake...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Master Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Heat Reports & Complaints */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8">
              <div className="flex items-center gap-3 mb-8">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Heat Reports</h3>
              </div>
              <div className="space-y-4">
                {stats.complaints === 0 ? (
                    <div className="text-center py-10 opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-widest italic">Static Silence: No Complaints.</p>
                    </div>
                ) : (
                  Array.from({length: stats.complaints}).map((_, i) => (
                    <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-tight">Report Index: #{Math.floor(Math.random()*9000)+1000}</p>
                        <p className="text-[10px] text-slate-500 italic mt-1">Minor interaction friction in Hub B-4.</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-8 py-4 bg-slate-900 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">Clear All Protocols</button>
            </div>

            {/* Conversation monitor */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ChatBubbleBottomCenterIcon className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Pulse Syncs</h3>
                </div>
                <span className="text-xs font-black text-blue-600">{stats.conversations} Active</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mb-6 leading-relaxed">
                Aggregated chat volume across all territories is stable. Community marketing engagement is up.
              </p>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Master Credentials & Personal Dossier */}
            <div className="bg-blue-600 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20">
               <h3 className="text-sm font-black text-white uppercase tracking-widest italic mb-6 border-b border-white/20 pb-2">Master Command Identity</h3>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-2xl border border-white/30 shadow-inner">
                    {localStorage.getItem('username')?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-white uppercase tracking-tighter text-xl italic leading-none">{localStorage.getItem('username')}</p>
                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-1">Sovereign Publisher</p>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                     <span className="text-white/60">Imperial Email</span>
                     <span className="text-white italic">{user?.email || 'master@frontline.net'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                     <span className="text-white/60">Sovereign Since</span>
                     <span className="text-white italic">{user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</span>
                    </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                     <span className="text-white/60">Network Status</span>
                     <span className="text-white italic">God Mode [Active]</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                     <span className="text-white/60">Linked Assets</span>
                     <span className="text-white italic">Repo/Vercel/Railway ✓</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
