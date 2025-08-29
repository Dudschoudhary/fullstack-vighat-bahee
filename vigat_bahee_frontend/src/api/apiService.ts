import type { AxiosRequestConfig } from "axios";
import axios from "./axiosInstance";

export interface ApiParams {
  [key: string]: any;
}

export const apiService = {
  // POST request
  post: async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.post<T>(url, data, config);
    return response.data;
  },

  // GET request
  get: async <T = any>(url: string, params?: ApiParams, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.get<T>(url, { params, ...config });
    return response.data;
  },

  // PUT request
  put: async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.put<T>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axios.delete<T>(url, config);
    return response.data;
  }
};

export default apiService;
