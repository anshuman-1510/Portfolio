import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://portfolio-builder-2n4d.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_builder_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export default api;
