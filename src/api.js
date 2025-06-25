// api.js
import axios from "axios";
import baseUrl from "./baseUrl.js";
console.log("baseUrl",baseUrl);
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Automatically attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
