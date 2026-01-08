import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e1e1e', // Dark Mode
        borderRadius: 2,
        boxShadow: 3,
        height: '100%' // Grid içinde tam boy
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5, fontSize: '0.85rem' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
          {value}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          backgroundColor: `${color}20`, // Rengin %20 opağı
          p: 1.5, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color 
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

export default StatsCard;
