import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Engineering',
    price: '',
    duration: '',
    skillLevel: 'All Levels',
    flyerImage: '',
    curriculum: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
        if (res.data.role !== 'seller') {
          navigate('/marketplace');
        }
      } catch {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a course.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const payload = {
        ...formData,
        type: user?.businessType || 'service',
        curriculum: formData.curriculum.split('\n').filter(item => item.trim() !== '') // Convert text area to array
      };

      await api.post(`/api/courses`, payload, config);
      navigate('/marketplace');
    } catch (err) {
       console.error(err);
       setError(err.response?.data?.msg || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.businessType === 'product' ? 'List New Product' : 'Create New Service'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {user?.businessType === 'product' 
                ? 'Add a physical or digital item to your warehouse.'
                : 'Share your competence and services with the community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {user?.businessType === 'product' ? 'Product Name' : 'Service Title'}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                  placeholder={user?.businessType === 'product' ? "e.g. High-Torque Electric Motor" : "e.g. Architectural Visualization Masterclass"}
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  name="category"
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skill Level</label>
                <select
                  name="skillLevel"
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                  value={formData.skillLevel}
                  onChange={handleChange}
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (KES)</label>
                <input
                  type="number"
                  name="price"
                  required
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                  placeholder="e.g. 6000"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {user?.businessType === 'product' ? 'Lead Time / Stock' : 'Duration'}
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                  placeholder={user?.businessType === 'product' ? "e.g. In Stock / 3 Days" : "e.g. 4 Weeks"}
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                required
                className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Curriculum */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {user?.businessType === 'product' ? 'Specifications' : 'Curriculum'} (One per line)
              </label>
              <textarea
                name="curriculum"
                rows={4}
                className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3"
                placeholder={user?.businessType === 'product' ? "Material: Titanium&#10;Weight: 200g&#10;Color: Matte Black" : "Introduction to Interface&#10;Drawing Basic Shapes&#10;3D Modeling"}
                value={formData.curriculum}
                onChange={handleChange}
              />
            </div>

            {/* Flyer Image URL (Simplification for now) */}
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Flyer Image</label>
              <div className="mt-1 flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 cursor-pointer transition-all">
                  <PhotoIcon className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">
                    {formData.flyerImage ? 'Flyer Uploaded ✓' : 'Click to upload flyer'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, flyerImage: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {formData.flyerImage && (
                  <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={formData.flyerImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">Upload your pricing flyer (PNG, JPG up to 5MB)</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
