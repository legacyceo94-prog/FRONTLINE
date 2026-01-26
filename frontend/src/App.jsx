import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { 
  SunIcon, 
  MoonIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon 
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
import axios from 'axios'
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`); // Using courses as a global catalog for now
      setFeed(res.data.slice(0, 6));
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-xl overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{localStorage.getItem('username') || 'Member'}</h3>
                    <p className="text-xs text-slate-500">Professional Profile</p>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">Your Communities</h3>
                <Link to="/communities" className="text-xs text-primary-500 hover:underline">Browse all communities</Link>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:w-3/4">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Trending in Frontline</h2>
               {loading ? (
                 <div className="text-center py-20">Loading Feed...</div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {feed.map(item => <CourseCard key={item._id} course={item} />)}
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
            <Link to="/communities" className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 rounded-full shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105">
              Explore the Pulse
            </Link>
            <Link 
              to="/dashboard"
              className="px-8 py-3.5 text-base font-semibold text-primary-600 bg-white dark:bg-slate-800 border-2 border-primary-100 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-full transition-all"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-primary-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
               <UserGroupIcon className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Network of Buyers</h3>
            <p className="text-slate-600 dark:text-slate-400">Don't sell alone. Plug into active communities ready for your value.</p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-primary-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
               <AcademicCapIcon className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sell Knowledge</h3>
            <p className="text-slate-600 dark:text-slate-400">From courses to consultations. Monetize your competence effortlessly.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-primary-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
               <BriefcaseIcon className="w-6 h-6"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Build a Brand</h3>
            <p className="text-slate-600 dark:text-slate-400">Turn one-time sales into long-term trust and community reputation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Redundant Home removed

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
    
    return token ? { username: username || 'Member', profileImage, role } : null;
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
    const path = window.location.pathname;
    
    if (role === 'seller' && path === '/') {
      navigate('/dashboard');
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                F
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Frontline
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {location.pathname !== '/dashboard' && (
                <>
                  <Link to="/communities" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Marketplace Pulse
                  </Link>
                  <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    About
                  </Link>
                </>
              )}
              {user && user.role === 'seller' && (
                <Link to="/dashboard" className={`text-sm font-bold transition-colors ${location.pathname === '/dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-primary-600'}`}>
                  Dashboard
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

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 border-t border-slate-100 dark:border-slate-800 ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-4 pt-2 pb-6 space-y-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
               {user?.role !== 'seller' && (
                 <>
                   <Link to="/communities" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Communities</Link>
                   <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">About</Link>
                 </>
               )}
               {user && user.role === 'seller' && (
                 <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-bold text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</Link>
               )}
               {!user && (
                 <div className="pt-4 flex flex-col gap-2">
                   <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Login</Link>
                   <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl font-bold bg-primary-600 text-white">Sign Up</Link>
                 </div>
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
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
