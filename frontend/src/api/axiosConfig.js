import axios from 'axios';

// Base URLs for the two microservices
const AUTH_URL = `http://${window.location.hostname}:8090/api/auth`;
const API_URL = `http://${window.location.hostname}:8081/api`;

// Create an axios instance that automatically adds the JWT token to every request
const api = axios.create({ baseURL: API_URL });

// REQUEST INTERCEPTOR: Before every request, add the JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: If the server returns 401 (unauthorized), redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API calls (these go to the auth-service, NOT the main backend)
export const authAPI = {
  login: (data) => axios.post(`${AUTH_URL}/login`, data),
  register: (data) => axios.post(`${AUTH_URL}/register`, data),
  getMe: (token) => axios.get(`${AUTH_URL}/me`, { headers: { Authorization: `Bearer ${token}` } }),
};

// Logged-in API calls (these go to the main backend WITH the JWT token)
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export default api;
