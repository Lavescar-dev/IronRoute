import axios from 'axios';

// 1. Temel API Ayarı
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. İSTEK AJANI (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    // Hafızadan (LocalStorage) anahtarı al
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            // Eğer anahtar varsa, isteğin başlığına zımbala
            if (user && user.access) {
                config.headers.Authorization = `Bearer ${user.access}`;
            }
        } catch (e) {
            console.error("Token okuma hatası:", e);
        }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. CEVAP AJANI (Response Interceptor)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Eğer sunucu "401 (Kovuldun)" derse
    if (error.response && error.response.status === 401) {
      console.warn("Oturum süresi doldu, çıkış yapılıyor...");
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
