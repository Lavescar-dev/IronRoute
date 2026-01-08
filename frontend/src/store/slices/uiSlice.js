/**
 * UI Slice
 *
 * Manages UI state including theme, notifications, loading states
 */

import { createSlice } from '@reduxjs/toolkit';

// ===========================================
// INITIAL STATE
// ===========================================

const initialState = {
  // Theme
  theme: 'dark', // 'dark' | 'light'

  // Sidebar
  sidebarCollapsed: false,
  sidebarMobileOpen: false,

  // Global Loading
  globalLoading: false,
  loadingMessage: '',

  // Notifications
  notifications: [],

  // Modal State
  activeModal: null,
  modalData: null,

  // Page Title
  pageTitle: 'Dashboard',

  // Breadcrumbs
  breadcrumbs: [],
};

// ===========================================
// SLICE
// ===========================================

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarMobile: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    setSidebarMobileOpen: (state, action) => {
      state.sidebarMobileOpen = action.payload;
    },

    // Global Loading
    setGlobalLoading: (state, action) => {
      if (typeof action.payload === 'boolean') {
        state.globalLoading = action.payload;
        state.loadingMessage = '';
      } else {
        state.globalLoading = action.payload.loading;
        state.loadingMessage = action.payload.message || '';
      }
    },

    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'info', // 'success' | 'error' | 'warning' | 'info'
        message: '',
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },

    // Page Title
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },

    // Breadcrumbs
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
  },
});

// ===========================================
// NOTIFICATION HELPERS
// ===========================================

/**
 * Show success notification
 */
export const showSuccess = (message, duration = 5000) =>
  uiSlice.actions.addNotification({
    type: 'success',
    message,
    duration,
  });

/**
 * Show error notification
 */
export const showError = (message, duration = 7000) =>
  uiSlice.actions.addNotification({
    type: 'error',
    message,
    duration,
  });

/**
 * Show warning notification
 */
export const showWarning = (message, duration = 6000) =>
  uiSlice.actions.addNotification({
    type: 'warning',
    message,
    duration,
  });

/**
 * Show info notification
 */
export const showInfo = (message, duration = 5000) =>
  uiSlice.actions.addNotification({
    type: 'info',
    message,
    duration,
  });

// ===========================================
// EXPORTS
// ===========================================

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarMobile,
  setSidebarMobileOpen,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setPageTitle,
  setBreadcrumbs,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectSidebarMobileOpen = (state) => state.ui.sidebarMobileOpen;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectNotifications = (state) => state.ui.notifications;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectModalData = (state) => state.ui.modalData;
export const selectPageTitle = (state) => state.ui.pageTitle;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;

export default uiSlice.reducer;
