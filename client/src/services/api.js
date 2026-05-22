import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 120000, // 2 minutes timeout for slow Gemini API responses
});

// Automatically inject JWT token into requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

// Resume and report endpoints
export const uploadResume = async (formData, onUploadProgress) => {
  const response = await API.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const getReportsHistory = async () => {
  const response = await API.get('/resume/history');
  return response.data;
};

export const getReportById = async (id) => {
  const response = await API.get(`/resume/report/${id}`);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await API.delete(`/resume/report/${id}`);
  return response.data;
};

export default API;
