import axios from 'axios';

// Get base URL from env, or fallback to default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, we could clear the token and force re-login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // We can't easily use context hooks here, but clearing the token is a good start
    }
    return Promise.reject(error);
  }
);
