import axios from "axios";

const API = axios.create({
  baseURL: "https://subbybankbackend.onrender.com/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  if (!config.url.includes("/auth/")) {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
