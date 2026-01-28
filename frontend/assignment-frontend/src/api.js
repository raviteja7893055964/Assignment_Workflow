import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    const auth = JSON.parse(raw);
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default api;
