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
    // लेकिन login/register/forgot-password requests के लिए redirect नहीं करना
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest = ['/login', '/register', '/forgot-password', '/reset-password'].some(
        path => requestUrl.includes(path)
      );
      
      // Only redirect if it's NOT an auth request and user is logged in
      // This prevents flickering on login page when credentials are wrong
      if (!isAuthRequest && localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
