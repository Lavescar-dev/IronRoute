// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import {
  Box, Button, TextField, Typography, Paper, Container, Alert
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { login } from '../services/auth'; // Yazdığımız ajanı çağırdık

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Hata mesajı için
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Önceki hataları temizle

    try {
      // Ajanı göreve gönderiyoruz
      await login(username, password);

      // Başarılı olursa Dashboard'a gönder (Henüz yapmadık ama yönlensin)
      navigate('/dashboard');

    } catch (err) {
      // Hata olursa (Şifre yanlışsa vs.)
      setError('Giriş başarısız! Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

    <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
    IronRoute Giriş
    </Typography>

    {/* Hata Mesajı Kutusu */}
    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
    <TextField
    margin="normal" required fullWidth label="Kullanıcı Adı" autoFocus
    value={username} onChange={(e) => setUsername(e.target.value)}
    />
    <TextField
    margin="normal" required fullWidth label="Şifre" type="password"
    value={password} onChange={(e) => setPassword(e.target.value)}
    />
    <Button
    type="submit" fullWidth variant="contained"
    sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
    >
    Sisteme Gir
    </Button>
    </Box>
    </Paper>
    </Box>
    </Container>
  );
};

export default Login;
