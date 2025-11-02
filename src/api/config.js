// src/api/config.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PROD_API_URL 
  : process.env.REACT_APP_API_URL;

export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default API;