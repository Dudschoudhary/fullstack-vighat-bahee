// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5010",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}); 

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Token expired/invalid पर auto-logout
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // अगर user data save है
      // Do not force navigation to /login (route may be removed).
      // Instead emit a custom event so the app can decide what to do (optional)
      try {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      } catch (e) {
        // ignore
      }
      // NOTE: No window.location change here to avoid navigation to an undefined route.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
