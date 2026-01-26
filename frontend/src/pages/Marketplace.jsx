import { useState, useEffect } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CourseCard from '../components/CourseCard';

export default function Marketplace() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: ''
  });

  const categories = ['Engineering', 'Design', 'Technology', 'Business', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  // Debounce search or fetch on filter change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.level) params.append('level', filters.level);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses?${params.toString()}`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
     setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Competence</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Find the perfect course or service to elevate your skills.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Search courses, skills, or sellers..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Simple Filters */}
            <select 
              className="block w-full md:w-48 pl-3 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              className="block w-full md:w-48 pl-3 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="">All Levels</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
           <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
             <p className="mt-4 text-slate-500">Loading competence...</p>
           </div>
        ) : (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <FunnelIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No courses found</h3>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
