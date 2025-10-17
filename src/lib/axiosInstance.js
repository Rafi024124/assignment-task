import axios from "axios";
import { store } from "../redux/store";

const axiosInstance = axios.create({
  baseURL: "https://api.bitechx.com", // API base URL
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token from Redux store to every request
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
