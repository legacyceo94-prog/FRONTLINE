import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { 
  SunIcon, 
  MoonIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  UserIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import Communities from './pages/Communities'
import CommunityFeed from './pages/CommunityFeed'
import Profile from './pages/Profile'
import CreateCourse from './pages/CreateCourse'
import About from './pages/About'
import AccountSettings from './pages/AccountSettings'
import Dashboard from './pages/Dashboard'
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Choice from './pages/Choice';
import api from './utils/api';
import CourseCard from './components/CourseCard' // Added CourseCard import

// Landing Page Component
function Home() {
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'seller') {
        navigate('/dashboard');
      } else {
        setUser({ username: 'Member' });
        fetchGlobalFeed();
      }
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const fetchGlobalFeed = async () => {
    try {
      // Fetch latest posts across all communities
      const res = await api.get('/api/courses'); // Using courses as a global catalog for now
      setFeed(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
    } catch (e) { 
      console.error(e);
      setFeed([]); 
    }
    finally { setLoading(false) }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-24 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar: Pilot Dashboard */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-950 p-1 shadow-xl ring-2 ring-emerald-500/20 mb-4 overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover rounded-[1.75rem]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-300 font-black text-3xl">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter italic text-xl">{localStorage.getItem('username') || 'Member'}</h3>
                  <div className="mt-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-500/10 text-[8px] font-black uppercase tracking-widest">
                     Certified Node
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Trust Score</span>
                      <span className="text-emerald-600">{user?.trustScore || 85}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${user?.trustScore || 85}%` }}></div>
                   </div>
                </div>

                <div className="mt-10">
                   <Link to="/communities" className="block w-full py-4 bg-slate-900 dark:bg-slate-950 text-white text-center text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                      Enter the Pulse
                   </Link>
                </div>
              </div>
            </div>

            {/* Main Feed: The Global Stream */}
            <div className="lg:w-3/4">
               <div className="mb-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Global Transmission</span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">The <span className="text-emerald-600">Inventory.</span></h2>
                  </div>
                  <Link to="/marketplace" className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-2">
                     Scan All Assets
                     <RocketLaunchIcon className="w-4 h-4" />
                  </Link>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1,2,4].map(i => (
                       <div key={i} className="h-80 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] animate-pulse"></div>
                    ))}
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {feed.length === 0 ? (
                      <div className="col-span-full py-32 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">
                         <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No broadcasts detected in this sector.</span>
                      </div>
                   ) : (
                      feed.map(item => <CourseCard key={item._id} course={item} />)
                   )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate">
      {/* Hero Section Container */}
      <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
        {/* Animated Background Gradient Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
              The <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">Social Network</span> for<br />
              <span className="relative inline-block mt-2">
                Real Competence
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-primary-200 dark:bg-primary-900/30 -z-10 rounded-full"></div>
              </span>
            </h1>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/communities" className="px-8 py-3.5 text-base font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95">
              Explore the Pulse
            </Link>
            <Link 
              to="/dashboard"
              className="px-8 py-3.5 text-base font-black uppercase tracking-widest text-emerald-600 bg-white dark:bg-slate-800 border-2 border-emerald-50 dark:border-white/5 hover:border-emerald-500 rounded-full transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-emerald-500/10 transition-all group">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
               <UserGroupIcon className="w-7 h-7"/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">Network of Buyers</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Don't sell alone. Plug into active communities ready to validate and acquire your professional output.</p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-emerald-500/10 transition-all group">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
               <AcademicCapIcon className="w-7 h-7"/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">Monetize Truth</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">From curated courses to deep consultations. Transform your verified competence into scalable Seller Assets.</p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-emerald-500/10 transition-all group">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg">
               <BriefcaseIcon className="w-7 h-7"/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter italic">Infinite Reputation</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Every handshake transmits trust. Build an immutable professional identity that scales across the entire network.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Redundant Home removed

function BottomNav({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', icon: HomeIcon, path: '/', active: location.pathname === '/' },
    { label: 'Market', icon: MagnifyingGlassIcon, path: '/marketplace', active: location.pathname === '/marketplace' },
    { label: 'Pulse', icon: UserGroupIcon, path: '/communities', active: location.pathname === '/communities' },
    { label: user?.role === 'seller' ? 'Engine' : 'You', icon: user?.role === 'seller' ? RocketLaunchIcon : UserIcon, path: user?.role === 'seller' ? '/dashboard' : '/settings', active: user?.role === 'seller' ? location.pathname === '/dashboard' : location.pathname === '/settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100]">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-2 flex items-center justify-around h-16 ring-1 ring-slate-900/5 dark:ring-white/5">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${item.active ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  // Initialize state directly from localStorage/system to avoid cascading renders
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [user, setUser] = useState(() => {
    // Check both persistent and session storage for the auth token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const username = localStorage.getItem('username') || sessionStorage.getItem('username');
    const profileImage = localStorage.getItem('profileImage'); // Images usually stay in local
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');
    
    return token ? { username: username || 'Buyer', profileImage, role } : null;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // If user hasn't hard-coded a preference in localStorage, follow the system
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Sync class list with darkMode state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // MODE ORIENTATION: Redirect to Dashboard only on initial login or Home visit
  useEffect(() => {
    const role = localStorage.getItem('role');
    const bType = localStorage.getItem('businessType');
    const path = window.location.pathname;
    
    if (role === 'seller') {
      if (!bType && path !== '/choice' && path !== '/settings') {
        navigate('/choice');
      } else if (path === '/') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileImage');
    setUser(null);
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-navbar transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link 
              to={user?.role === 'seller' ? "/dashboard" : "/"} 
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                Frontline
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-10">
              <Link to="/marketplace" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 flex items-center gap-2 ${location.pathname === '/marketplace' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                <ShoppingBagIcon className="w-4 h-4" />
                Inventory Scan
              </Link>
              <Link to="/communities" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 flex items-center gap-2 ${location.pathname === '/communities' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                <UserGroupIcon className="w-4 h-4" />
                Community Pulse
              </Link>
              <Link to="/about" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 ${location.pathname === '/about' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                About
              </Link>
              {user && user.role === 'seller' && (
                <Link to="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                  <RocketLaunchIcon className="w-4 h-4" />
                  Cockpit
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
              
              {user ? (
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">Hello, {user.username}</span>
                     <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-slate-800 overflow-hidden">
                       {user.profileImage ? (
                         <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                       ) : (
                         user.username.charAt(0).toUpperCase()
                       )}
                     </div>
                   </div>
                   <Link 
                     to="/settings"
                     className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                   >
                     Settings
                   </Link>
                   <button 
                     onClick={handleLogout}
                     className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                   >
                     Logout
                   </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors">Login</Link>
                  <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg shadow-primary-500/20 transition-all">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 pt-2 pb-6 space-y-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
               <div className="grid grid-cols-2 gap-3">
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">About</Link>
                  <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Inventory</Link>
               </div>
               {!user ? (
                 <div className="flex flex-col gap-2">
                   <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5">Login</Link>
                   <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center rounded-2xl font-black uppercase tracking-widest text-xs bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">Sign Up</Link>
                 </div>
               ) : (
                 <button 
                   onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                   className="w-full py-4 text-center rounded-2xl font-black uppercase tracking-widest text-xs bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-900/30"
                 >
                   Terminate Session
                 </button>
               )}
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityFeed />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/choice" element={<Choice />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </main>

      {/* Mobile-First Navigation Layer */}
      <BottomNav user={user} />
    </div>
  )
}

export default App
