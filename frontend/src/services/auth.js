/**
 * Authentication Service
 *
 * Handles login, logout, and token management
 * Works with Redux store for state management
 */

import { store } from '../store';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

/**
 * Login user with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} User data with tokens
 */
export const login = async (username, password) => {
  try {
    const result = await store.dispatch(
      loginAction({ username, password })
    ).unwrap();

    store.dispatch(showSuccess('Giris basarili! Hosgeldiniz.'));
    return result;
  } catch (error) {
    const message =
      typeof error === 'string'
        ? error
        : error?.message || 'Giris basarisiz. Lutfen tekrar deneyin.';
    store.dispatch(showError(message));
    throw new Error(message);
  }
};

/**
 * Logout current user
 */
export const logout = () => {
  store.dispatch(logoutAction());
  store.dispatch(showSuccess('Basariyla cikis yapildi.'));
};

/**
 * Get current user from Redux store
 * @returns {object|null} Current user object
 */
export const getCurrentUser = () => {
  const state = store.getState();
  return state.auth?.user || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const state = store.getState();
  return state.auth?.isAuthenticated || false;
};

/**
 * Get access token from Redux store
 * @returns {string|null}
 */
export const getAccessToken = () => {
  const state = store.getState();
  return state.auth?.accessToken || null;
};

/**
 * Get refresh token from Redux store
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  const state = store.getState();
  return state.auth?.refreshToken || null;
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
};
