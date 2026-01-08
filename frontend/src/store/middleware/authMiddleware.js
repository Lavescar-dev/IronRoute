/**
 * Auth Middleware
 *
 * Handles authentication-related side effects
 */

import { logout } from '../slices/authSlice';
import { showError } from '../slices/uiSlice';

/**
 * Middleware to handle authentication side effects
 */
export const authMiddleware = (store) => (next) => (action) => {
  // Handle logout action
  if (logout.fulfilled.match(action)) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Handle 401 errors from API
  if (action.type?.endsWith('/rejected')) {
    const payload = action.payload;

    // Check if it's an authentication error
    if (
      payload?.status === 401 ||
      payload?.message?.includes('401') ||
      payload?.message?.includes('Unauthorized')
    ) {
      // Dispatch logout
      store.dispatch(logout());
      store.dispatch(
        showError('Oturum suresi doldu. Lutfen tekrar giris yapin.')
      );
    }
  }

  // Handle token refresh failures
  if (action.type === 'auth/refreshToken/rejected') {
    store.dispatch(logout());
    store.dispatch(
      showError('Oturum suresi doldu. Lutfen tekrar giris yapin.')
    );
  }

  return next(action);
};

export default authMiddleware;
