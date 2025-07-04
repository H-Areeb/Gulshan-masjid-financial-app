import axios from 'axios';

const instance = axios.create({
 //baseURL: 'http://localhost:5000/api', // Update if different
   baseURL: 'https://mosque-api.up.railway.app/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach token if available
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
