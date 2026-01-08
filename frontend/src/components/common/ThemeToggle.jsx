/**
 * Theme Toggle Component
 *
 * Allows users to switch between dark and light themes
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Tooltip title={isDark ? 'Acik Tema' : 'Koyu Tema'}>
      <IconButton
        onClick={handleToggle}
        color="inherit"
        sx={{
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
