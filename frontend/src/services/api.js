// src/services/api.js
import axios from 'axios';

// Django sunucumuzun adresi (Backend Portu: 8000)
const API_URL = 'http://127.0.0.1:8000/api/';

// Axios örneği (Instance) oluşturuyoruz.
// Bu, her isteğin varsayılan ayarlarını tutar.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
