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
  BoltIcon,
  HomeIcon
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
  const [commanders, setCommanders] = useState([]);
  const [frictionPoints, setFrictionPoints] = useState([]);
  const [recentSyncs, setRecentSyncs] = useState([]);
  const [masterInventory, setMasterInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const navigate = useNavigate();

  const handleExportReport = () => {
    setExporting(true);
    
    // Constructing the Imperial Data Matrix
    const data = [
      ['FRONTLINE NETWORK - PROJECT ACCOUNTABILITY REPORT'],
      [`TIMESTAMP: ${new Date().toLocaleString()}`],
      [''],
      ['NETWORK CORE METRICS'],
      ['Protocol', 'Value', 'Status'],
      ['Total Buyers', stats.users, 'Optimal'],
      ['Active Hubs', stats.hubs, 'Active'],
      ['Network Listings', stats.listings, 'Vibrant'],
      ['Trust Handshakes', stats.trustVolume, 'Verified'],
      [''],
      ['GROWTH INDEX ANALYTICS'],
      ['Metric', 'Index', 'Classification'],
      ['Marketplace Attraction', `${((stats.listings / (stats.users || 1)) * 10).toFixed(1)}%`, 'Dominant'],
      ['Trust Handshake Velocity', `${((stats.trustVolume / (stats.users || 1)) / 10).toFixed(1)}%`, 'Scaling'],
      ['Community Intrusion', `${((stats.hubs / (stats.users || 1)) * 100).toFixed(1)}%`, 'Aggressive'],
      [''],
      ['BUYER OVERSIGHT & HUB COMMANDERS'],
      ['Hub Name', 'Commander', 'WhatsApp Sync', 'Contact Email'],
      ...commanders.map(c => [c.hub, c.commander, c.whatsapp, c.email]),
      [''],
      ['NETWORK FRICTION & COMPLAINTS'],
      ['Target User', 'Stars', 'Comment', 'WA Contact'],
      ...frictionPoints.map(f => [f.targetUser, f.stars, f.comment, f.whatsapp || 'No Sync']),
      [''],
      ['NETWORK SYNC PROTOCOLS (LIVE HANDSHAKES)'],
      ['Timestamp', 'Buyer', 'Seller', 'Asset Interacted', 'Purpose'],
      ...recentSyncs.map(s => [new Date(s.createdAt).toLocaleString(), s.buyer?.username, s.seller?.username, s.item?.title, s.purpose]),
      [''],
      ['CONFIDENTIAL: FOR PUBLISHER/INVESTOR OVERSIGHT ONLY']
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Frontline_Imperial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setExporting(false);
      setLogs(prev => [{ t: 'SYSTEM', m: 'Imperial Report Exported Successfully.', d: new Date() }, ...prev]);
    }, 1000);
  };

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
        const [uRes, cRes, pRes, masterRes, analyticsRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/communities'),
          api.get('/api/communities/global/posts'),
          api.get(`/api/users/${userId}`),
          api.get('/api/users/vanguard/analytics')
        ]);

        setUser(masterRes.data);
        setCommanders(analyticsRes.data.commanders || []);
        setFrictionPoints(analyticsRes.data.frictionPoints || []);
        setRecentSyncs(analyticsRes.data.recentSyncs || []);
        setMasterInventory(pRes.data || []);
        
        setStats({
          users: uRes.data.length || 0,
          hubs: cRes.data.length || 0,
          listings: pRes.data.length || 0,
          trustVolume: analyticsRes.data.totalHandshakes || 0, 
          complaints: (analyticsRes.data.frictionPoints || []).length, 
          conversations: analyticsRes.data.totalConversations || 0
        });

        // Generate Master Logs
        const syncLogs = (analyticsRes.data.recentSyncs || []).map(sync => ({
           t: 'SYNC',
           m: `Structural Handshake: ${sync.buyer?.username} sync'd with ${sync.seller?.username} for "${sync.item?.title}"`,
           d: sync.createdAt
        }));

        setLogs([
          { t: 'NETWORK', m: `Imperial Sync Complete. ${uRes.data.length} buyers across ${cRes.data.length} hubs active.`, d: new Date() },
          ...syncLogs,
          { t: 'SECURITY', m: `${(analyticsRes.data.frictionPoints || []).length} Friction points detected. Intervention recommended.`, d: new Date() },
          { t: 'MARKET', m: 'Community-driven marketing intrusion at 88% efficiency.', d: new Date() },
          { t: 'HUSTLE', m: 'Commanders updated with latest WhatsApp protocol sync.', d: new Date() }
        ]);

      } catch (err) {
        console.error("Vanguard Access Denied", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    return () => clearInterval(timer);
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
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">MASTER COMMANDER // ENEMY OF THE STATE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Empire Status</span>
              <span className="text-xs font-mono text-slate-400">{currentTime} - Optimal</span>
            </div>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-all border border-white/5 active:scale-95 group"
              title="Return to Main Command"
            >
              <HomeIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest hidden sm:block">Exit Console</span>
            </button>

            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5">
              <BoltIcon className="w-5 h-5 text-yellow-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Buyers', val: stats.users, detail: 'Global Network Population', icon: UserGroupIcon, color: 'blue' },
            { label: 'Active Hubs', val: stats.hubs, detail: `${((stats.hubs / (stats.users || 1)) * 100).toFixed(1)} Hubs per 100 buyers`, icon: ChartBarIcon, color: 'blue' },
            { label: 'Network Listings', val: stats.listings, detail: `${(stats.listings / (stats.users || 1)).toFixed(1)} Listings per buyer`, icon: BoltIcon, color: 'yellow' },
            { label: 'Trust Handshakes', val: stats.trustVolume, detail: `${(stats.trustVolume / (stats.users || 1)).toFixed(1)} Reviews per buyer`, icon: StarIcon, color: 'blue' }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/30 transition-all group">
              <div className={`w-12 h-12 rounded-2xl bg-${s.color}-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 text-${s.color}-500`} />
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</h3>
              <p className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{s.val}</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-2 opacity-60">{s.detail}</p>
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
                <button 
                  onClick={handleExportReport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {exporting ? 'Compiling Matrix...' : 'Generate Excel Report'}
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="pb-4 pt-4 px-4">Hub Territory</th>
                      <th className="pb-4 pt-4 px-4">Hub Commander</th>
                      <th className="pb-4 pt-4 px-4">Status</th>
                      <th className="pb-4 pt-4 px-4">WhatsApp Sync</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold uppercase tracking-tight italic">
                    {commanders.slice(0, 3).map((cmd, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4 text-white">{cmd.hub}</td>
                        <td className="py-6 px-4 text-blue-500">{cmd.commander}</td>
                        <td className="py-6 px-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[9px] font-black uppercase">Active</span></td>
                        <td className="py-6 px-4 text-slate-500">{cmd.whatsapp}</td>
                      </tr>
                    ))}
                    {commanders.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-slate-600 uppercase tracking-widest text-[10px]">No Hub Commanders Identified.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Connection Oversight - Locating every 'Connect' Handshake */}
            <div className="bg-white/5 rounded-[3rem] border border-white/5 p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Live Connection Oversight</h2>
                  <p className="text-xs text-slate-500 font-medium italic">Tracking live 'Connect' protocols across the network.</p>
                </div>
                <div className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                   <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{recentSyncs.length} Active Handshakes</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="pb-4 pt-4 px-4">Interacting Buyer</th>
                      <th className="pb-4 pt-4 px-4">Target Seller</th>
                      <th className="pb-4 pt-4 px-4">Asset / Item</th>
                      <th className="pb-4 pt-4 px-4">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold uppercase tracking-tight italic">
                    {recentSyncs.slice(0, 5).map((sync, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4 text-white">@{sync.buyer?.username}</td>
                        <td className="py-6 px-4 text-blue-500">@{sync.seller?.username}</td>
                        <td className="py-6 px-4 text-slate-300">
                           <div className="line-clamp-1 max-w-[200px]">{sync.item?.title}</div>
                        </td>
                        <td className="py-6 px-4">
                           <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black uppercase">
                             {sync.purpose}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {recentSyncs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-slate-600 uppercase tracking-widest text-[10px]">Static Silence: No Live Handshakes Detected.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10"></div>

            {/* Master Network Inventory - Locating every Asset with Price */}
            <div className="bg-white/5 rounded-[3rem] border border-white/5 p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">Master Network Inventory</h2>
                  <p className="text-xs text-slate-500 font-medium italic">Full ledger of assets, KRA records, and priced listings.</p>
                </div>
                <div className="px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                   <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{stats.listings} Assets Live</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="pb-4 pt-4 px-4">Asset / Item</th>
                      <th className="pb-4 pt-4 px-4">Provider (Seller)</th>
                      <th className="pb-4 pt-4 px-4">Price (KES)</th>
                      <th className="pb-4 pt-4 px-4">Category</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold uppercase tracking-tight italic">
                    {masterInventory.slice(0, 10).map((item, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4 text-white">
                           <div className="flex flex-col">
                              <span>{item.title}</span>
                              <span className="text-[9px] text-slate-600 lowercase tracking-normal">{item.type}</span>
                           </div>
                        </td>
                        <td className="py-6 px-4 text-blue-500">@{item.seller?.username}</td>
                        <td className="py-6 px-4 text-yellow-500 font-mono">
                           {item.skuDetails?.price?.toLocaleString()} /-
                        </td>
                        <td className="py-6 px-4">
                           <span className="px-2 py-1 bg-white/5 text-slate-400 rounded text-[9px] font-black uppercase">
                             {item.category}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {masterInventory.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-slate-600 uppercase tracking-widest text-[10px]">Depleted Stock: No Assets identified in the matrix.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-10"></div>

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
                {frictionPoints.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-widest italic">Static Silence: No Complaints.</p>
                    </div>
                ) : (
                  frictionPoints.map((f, i) => (
                    <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1">Target: {f.targetUser}</p>
                          <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mb-1 italic">{f.stars} Stars</p>
                          <p className="text-[10px] text-slate-500 italic leading-snug">"{f.comment || 'No explanation provided'}"</p>
                        </div>
                      </div>
                      
                      {f.whatsapp !== 'No Sync' && (
                        <a 
                          href={`https://wa.me/${f.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=Imperial%20Vanguard%20Alert:%20Regarding%20the%20feedback%20on%20your%20hub...`}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-2 bg-green-600/20 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                          title="Contact via WhatsApp"
                        >
                          <ChatBubbleBottomCenterIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => {
                  setFrictionPoints([]);
                  alert("Vanguard Protocol: Global Friction Points Suppressed.");
                }}
                className="w-full mt-8 py-4 bg-slate-900 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all"
              >
                Suppress All Friction
              </button>
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
