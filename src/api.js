import axios from 'axios';




const API = axios.create({
 baseURL:  "http://100.52.40.139:8080/api",
});




API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;