import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://mom-s-taste.onrender.com";

const api = axios.create({
  baseURL: `${apiUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("moms_taste_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
