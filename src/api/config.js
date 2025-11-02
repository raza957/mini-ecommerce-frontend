import axios from 'axios';


const getApiBaseUrl = () => {
 
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_PROD_API_URL || 'https://hopeful-clarity-production-3316.up.railway.app/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL); 

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, 
});

//  Request interceptor for logging
API.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;