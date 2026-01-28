import axios from 'axios';

// The centralized Neural Link for Frontline
// This file determines the definitive backend URL once, eliminating component-level errors.

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// URL Hardening Protocol: Ensure protocol exists and remove trailing slash
if (!rawUrl.startsWith('http')) {
  rawUrl = `https://${rawUrl}`;
}
const API_URL = rawUrl.replace(/\/$/, '');

console.log('Frontline Signal Uplink (Final):', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically attach the token to every verified request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Note: Removed 'x-auth-token' legacy header if present
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling (e.g., auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - Clean Slate protocol
      localStorage.clear(); 
      // Optional: Redirect to login if using a router outside a component context
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
