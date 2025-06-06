import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiError } from '../types';
import { logger } from '../utils/logger';

// Default API URL if environment variable is not set
const DEFAULT_API_URL = 'http://localhost:8080/api/v1';

// Get API URL from environment or use default
const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] || DEFAULT_API_URL;

// Log the API URL being used
logger.info('Using API URL:', API_BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.api.request(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', config.data);
    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    logger.api.response(response.config.method?.toUpperCase() || 'UNKNOWN', response.config.url || '', response.data);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    logger.api.error(
      error.config?.method?.toUpperCase() || 'UNKNOWN',
      error.config?.url || '',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 