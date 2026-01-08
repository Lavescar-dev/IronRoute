/**
 * Loading Spinner Component
 *
 * Displays a loading indicator with optional message
 */

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

/**
 * Inline Loading Spinner
 */
export const LoadingSpinner = ({
  size = 40,
  message = '',
  color = 'primary',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

/**
 * Full Page Loading Spinner
 */
export const FullPageLoader = ({ message = 'Yukleniyor...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

/**
 * Overlay Loading Spinner
 */
export const LoadingOverlay = ({ open, message = 'Islem yapiliyor...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={50} />
      <Typography variant="body1">{message}</Typography>
    </Backdrop>
  );
};

/**
 * Button Loading Spinner
 */
export const ButtonLoader = ({ size = 24 }) => {
  return (
    <CircularProgress
      size={size}
      sx={{
        color: 'inherit',
      }}
    />
  );
};

export default LoadingSpinner;
