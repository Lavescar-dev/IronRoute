import { Grid, Paper, Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Operasyon Merkezi
      </Typography>

      <Grid container spacing={3}>
        {/* Özet Kartları */}
        {[
            { title: 'Aktif Tırlar', value: '12', color: '#1a237e' },
            { title: 'Yoldaki Yükler', value: '5', color: '#004d40' },
            { title: 'Toplam Kazanç', value: '₺ 450.000', color: '#b71c1c' }
        ].map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: card.color, // Karta özel renk
                color: 'white'
              }}
            >
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <Typography color="text.secondary">
           [Buraya Ayın Sevkiyat Grafiği Gelecek]
         </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
