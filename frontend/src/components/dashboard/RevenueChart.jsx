import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RevenueChart = ({ data }) => {
  // Veriyi Frontend için formatla (Eğer boşsa boş array dönsün)
  const chartData = data ? [
    { name: 'Yolda', value: data.active_vehicles || 0, color: '#66bb6a' },
    { name: 'Hazır', value: data.available_vehicles || 0, color: '#42a5f5' },
    { name: 'Bakımda', value: data.maintenance_vehicles || 0, color: '#ef5350' },
  ] : [];

  return (
<Paper sx={{ 
  p: 3, 
  bgcolor: '#1e1e1e', 
  borderRadius: 2, 
  height: '100%', // Kapsayıcısının boyunu alsın
  width: '100%',  // Genişlik %100 olsun, Grid karar verecek
  display: 'flex', 
  flexDirection: 'column' 
}}>
      <Box sx={{ borderBottom: '2px solid #ff9800', display: 'inline-block', mb: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
          FİLO DURUM ANALİZİ
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#888" tick={{ fill: '#aaa' }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#ffffff10' }}
              contentStyle={{ backgroundColor: '#252525', border: '1px solid #444', borderRadius: '8px', color: '#fff' }} 
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} animationDuration={1500}>
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

export default RevenueChart;
