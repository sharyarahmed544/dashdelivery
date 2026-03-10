import axios from 'axios';
import { auth } from './firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for Firebase ID Token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
         // Optionally redirect to login or handle session expiry
         console.warn('Unauthorized request, session may have expired.');
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then((res) => res.data.data);
