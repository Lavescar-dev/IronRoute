/**
 * API Service
 *
 * Centralized Axios instance with authentication and error handling
 */

import axios from 'axios';
import { store } from '../store';
import { setTokens, logout } from '../store/slices/authSlice';
import { showError } from '../store/slices/uiSlice';

// ===========================================
// CONFIGURATION
// ===========================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===========================================
// REQUEST INTERCEPTOR
// ===========================================

api.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===========================================
// RESPONSE INTERCEPTOR WITH TOKEN REFRESH
// ===========================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const refreshToken = state.auth?.refreshToken;

      if (!refreshToken) {
        // No refresh token, logout
        store.dispatch(logout());
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // Update store with new token
        store.dispatch(
          setTokens({
            accessToken: newAccessToken,
            refreshToken: refreshToken,
          })
        );

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        store.dispatch(logout());
        store.dispatch(
          showError('Oturum suresi doldu. Lutfen tekrar giris yapin.')
        );
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.detail;

      switch (status) {
        case 400:
          // Validation errors are handled by the calling component
          break;
        case 403:
          store.dispatch(showError('Bu islemi yapmaya yetkiniz yok.'));
          break;
        case 404:
          store.dispatch(showError('Istenen kaynak bulunamadi.'));
          break;
        case 500:
          store.dispatch(
            showError('Sunucu hatasi olustu. Lutfen daha sonra tekrar deneyin.')
          );
          break;
        default:
          if (message) {
            store.dispatch(showError(message));
          }
      }
    } else if (error.request) {
      // Network error
      store.dispatch(
        showError('Sunucuya baglanilamiyor. Internet baglantinizi kontrol edin.')
      );
    }

    return Promise.reject(error);
  }
);

// ===========================================
// EXPORTS
// ===========================================

export default api;

// Re-export for convenience
export { API_URL };
