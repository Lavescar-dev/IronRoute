// src/services/auth.js
import api from './api';

// Giriş Fonksiyonu
export const login = async (username, password) => {
  try {
    // Django'nun /token/ adresine POST isteği atıyoruz
    const response = await api.post('token/', { username, password });
    
    // Eğer cevap başarılıysa (200 OK), Tokenları alıyoruz
    if (response.data.access) {
      // Token'ı tarayıcının "Cebi"ne (localStorage) koyuyoruz.
      // Böylece sayfayı yenilesen de çıkış yapmaz.
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    // Hata olursa fırlat (Login sayfasında yakalayacağız)
    throw error;
  }
};

// Çıkış Fonksiyonu
export const logout = () => {
  localStorage.removeItem('user'); // Cebi boşalt
};

// Mevcut kullanıcıyı getir
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
