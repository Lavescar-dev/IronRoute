/**
 * Notification Provider Component
 *
 * Displays notifications (toasts) from Redux store using MUI Snackbar
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Slide } from '@mui/material';
import {
  selectNotifications,
  removeNotification,
} from '../../store/slices/uiSlice';

/**
 * Slide transition for notifications
 */
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

/**
 * Single Notification Component
 */
const Notification = ({ notification, onClose }) => {
  const { id, type, message, duration } = notification;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(id);
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => onClose(id)}
        severity={type}
        variant="filled"
        sx={{
          width: '100%',
          minWidth: 300,
          boxShadow: 3,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

/**
 * Notification Provider
 *
 * Renders all active notifications from Redux store
 */
const NotificationProvider = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  // Only show the most recent 3 notifications
  const visibleNotifications = notifications.slice(-3);

  return (
    <>
      {visibleNotifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={(event, reason) => {
            if (reason !== 'clickaway') {
              handleClose(notification.id);
            }
          }}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: `${24 + index * 60}px !important`,
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{
              width: '100%',
              minWidth: 300,
              boxShadow: 3,
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationProvider;
