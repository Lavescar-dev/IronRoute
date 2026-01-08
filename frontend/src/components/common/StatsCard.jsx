import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)' } // Ufak bir animasyon
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mt: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          bgcolor: `${color}20`, 
          p: 1.5, 
          borderRadius: '50%',
          color: color,
          display: 'flex'
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

export default StatsCard;
