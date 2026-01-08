/**
 * Main Application Component
 *
 * Sets up providers, routing, and global components
 */

import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Store
import { store, persistor } from './store';

// Theme
import { getTheme } from './theme';
import { selectTheme } from './store/slices/uiSlice';
import { selectIsAuthenticated } from './store/slices/authSlice';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import NotificationProvider from './components/common/NotificationProvider';
import { FullPageLoader } from './components/common/LoadingSpinner';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Shipments from './pages/Shipments';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// ===========================================
// PROTECTED ROUTE COMPONENT
// ===========================================

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ===========================================
// APP CONTENT (With Theme)
// ===========================================

const AppContent = () => {
  const themeMode = useSelector(selectTheme);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

// ===========================================
// MAIN APP COMPONENT
// ===========================================

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<FullPageLoader />} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
