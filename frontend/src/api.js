// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API
});

// request: add token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('vc_token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

// response: if 401 -> clear and redirect to login
API.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem('vc_token');
      localStorage.removeItem('vc_user');
      // redirect to login page
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
