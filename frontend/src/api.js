import axios from 'axios';
const API = axios.create({
  baseURL: process.env.REACT_APP_API || 'http://localhost:5000/api'
});

// Add token automatically if present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('vc_token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export default API;
