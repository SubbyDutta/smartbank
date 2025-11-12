import axios from "axios";

// Base Axios instance
const API = axios.create({
  baseURL: "https://subbybankbackend.onrender.com/api", // your deployed backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // no use of  cookies
});

//  interceptor to attach JWT token only for protected routes
API.interceptors.request.use((config) => {
  // Skip adding token for auth endpoints (login/signup)
  if (!config.url.includes("/auth/")) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor for global error handling (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error: Check backend URL or CORS settings");
    }
    return Promise.reject(error);
  }
);

export default API;
