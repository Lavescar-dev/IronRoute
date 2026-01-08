import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FleetChart = ({ stats }) => {
  // Veriyi Recharts formatına çevir
  const chartData = [
    { name: 'Yolda', value: stats?.active_vehicles || 0, color: '#66bb6a' },
    { name: 'Hazır', value: stats?.available_vehicles || 0, color: '#42a5f5' },
    { name: 'Bakımda', value: stats?.maintenance_vehicles || 0, color: '#ef5350' },
  ];

  return (
    <Paper sx={{ p: 3, bgcolor: '#1e1e1e', borderRadius: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderBottom: '2px solid #ff9800', display: 'inline-block' }}>
        CANLI FİLO ANALİZİ
      </Typography>
      
      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#888" tick={{ fill: '#aaa' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2b2b2b', border: '1px solid #444', color: '#fff', borderRadius: '8px' }}
              cursor={{ fill: '#ffffff10' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default FleetChart;

