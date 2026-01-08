/**
 * Authentication Slice
 *
 * Manages user authentication state including tokens and user info
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// ===========================================
// INITIAL STATE
// ===========================================

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ===========================================
// ASYNC THUNKS
// ===========================================

/**
 * Login user with username and password
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}token/`, {
        username,
        password,
      });

      return {
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
        user: { username },
      };
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Giris basarisiz. Kullanici adi veya sifre hatali.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}token/refresh/`, {
        refresh: auth.refreshToken,
      });

      return {
        accessToken: response.data.access,
      };
    } catch (error) {
      return rejectWithValue('Oturum suresi doldu. Lutfen tekrar giris yapin.');
    }
  }
);

/**
 * Logout user
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear any server-side session if needed
  return null;
});

// ===========================================
// SLICE
// ===========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Update tokens directly (for refresh)
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    // Update user info
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Update user profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

// ===========================================
// EXPORTS
// ===========================================

export const { clearError, setTokens, setUser, updateProfile } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
