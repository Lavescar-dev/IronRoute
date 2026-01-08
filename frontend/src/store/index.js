/**
 * Redux Store Configuration
 *
 * Centralized state management for IronRoute application
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slices
import authReducer from './slices/authSlice';
import fleetReducer from './slices/fleetSlice';
import shipmentReducer from './slices/shipmentSlice';
import uiReducer from './slices/uiSlice';

// API Slice
import { apiSlice } from './api/apiSlice';

// Middleware
import { authMiddleware } from './middleware/authMiddleware';

// ===========================================
// PERSIST CONFIGURATION
// ===========================================

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'sidebarCollapsed'],
};

// ===========================================
// ROOT REDUCER
// ===========================================

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  fleet: fleetReducer,
  shipment: shipmentReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// ===========================================
// STORE CONFIGURATION
// ===========================================

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, authMiddleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

// ===========================================
// TYPES
// ===========================================

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */

export default store;
