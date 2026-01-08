/**
 * Settings Page
 *
 * Application settings and user preferences
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Palette as ThemeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

// Redux
import { selectUser, updateProfile } from '../store/slices/authSlice';
import { selectTheme, toggleTheme } from '../store/slices/uiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Config
import config from '../config';

// ===========================================
// SETTINGS SECTION COMPONENT
// ===========================================

const SettingsSection = ({ title, icon, children }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {icon}
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 3 }} />
    {children}
  </Paper>
);

// ===========================================
// SETTINGS COMPONENT
// ===========================================

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const currentTheme = useSelector(selectTheme);

  // Local state for form
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    shipment_updates: true,
    maintenance_alerts: true,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleNotificationChange = (name) => {
    setNotifications({ ...notifications, [name]: !notifications[name] });
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    dispatch(showSuccess(`Tema ${currentTheme === 'dark' ? 'açık' : 'koyu'} moda geçti`));
  };

  const handleProfileSave = async () => {
    try {
      // Validate
      const newErrors = {};
      if (!profileData.username?.trim()) {
        newErrors.username = 'Kullanıcı adı zorunludur';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // In real app, this would call an API
      dispatch(updateProfile(profileData));
      setSuccess('Profil başarıyla güncellendi');
      dispatch(showSuccess('Profil guncellendi'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      dispatch(showError('Profil güncellenemedi'));
    }
  };

  const handlePasswordSave = async () => {
    try {
      // Validate
      const newErrors = {};
      if (!passwordData.current_password) {
        newErrors.current_password = 'Mevcut şifre zorunludur';
      }
      if (!passwordData.new_password) {
        newErrors.new_password = 'Yeni şifre zorunludur';
      } else if (passwordData.new_password.length < 8) {
        newErrors.new_password = 'Sifre en az 8 karakter olmalıdır';
      }
      if (passwordData.new_password !== passwordData.confirm_password) {
        newErrors.confirm_password = 'Şifreler eşleşmiyor';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // In real app, this would call an API
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      dispatch(showSuccess('Sifre başarıyla değiştirildi'));
    } catch (err) {
      dispatch(showError('Sifre değiştirilemedi'));
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    dispatch(showSuccess('Önbellek temizlendi. Sayfa yenileniyor...'));
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, mb: 3 }}
      >
        <SettingsIcon fontSize="large" color="primary" />
        Ayarlar
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Profile Settings */}
          <SettingsSection title="Profil Bilgileri" icon={<PersonIcon color="primary" />}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}>
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user?.username || 'Kullanıcı'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'email@example.com'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="username"
                  label="Kullanıcı Adi"
                  fullWidth
                  value={profileData.username}
                  onChange={handleProfileChange}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="email"
                  label="E-posta"
                  type="email"
                  fullWidth
                  value={profileData.email}
                  onChange={handleProfileChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="first_name"
                  label="Ad"
                  fullWidth
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="last_name"
                  label="Soyad"
                  fullWidth
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid size={12}>
                <Button variant="contained" onClick={handleProfileSave}>
                  Profili Kaydet
                </Button>
              </Grid>
            </Grid>
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection title="Güvenlik" icon={<SecurityIcon color="primary" />}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Şifrenizi düzenli olarak değiştirmeniz önerilir.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="current_password"
                  label="Mevcut Şifre"
                  type="password"
                  fullWidth
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  error={!!errors.current_password}
                  helperText={errors.current_password}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="new_password"
                  label="Yeni Şifre"
                  type="password"
                  fullWidth
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!errors.new_password}
                  helperText={errors.new_password}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="confirm_password"
                  label="Şifre Tekrar"
                  type="password"
                  fullWidth
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password}
                />
              </Grid>
              <Grid size={12}>
                <Button variant="outlined" color="warning" onClick={handlePasswordSave}>
                  Şifreyi Değiştir
                </Button>
              </Grid>
            </Grid>
          </SettingsSection>

          {/* Notification Settings */}
          <SettingsSection title="Bildirimler" icon={<NotificationsIcon color="primary" />}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="E-posta Bildirimleri"
                  secondary="Önemli güncellemeler için e-posta al"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.email_notifications}
                    onChange={() => handleNotificationChange('email_notifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Push Bildirimleri"
                  secondary="Anlık bildirimler al"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.push_notifications}
                    onChange={() => handleNotificationChange('push_notifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Sevkiyat Güncellemeleri"
                  secondary="Sevkiyat durumu değişikliklerinde bildirim al"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.shipment_updates}
                    onChange={() => handleNotificationChange('shipment_updates')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Bakım Uyarıları"
                  secondary="Arac bakim hatırlatmaları"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications.maintenance_alerts}
                    onChange={() => handleNotificationChange('maintenance_alerts')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsSection>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Theme Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ThemeIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Tema
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={currentTheme === 'light' ? 'contained' : 'outlined'}
                  startIcon={<LightModeIcon />}
                  onClick={() => currentTheme === 'dark' && handleThemeToggle()}
                  fullWidth
                >
                  Açık
                </Button>
                <Button
                  variant={currentTheme === 'dark' ? 'contained' : 'outlined'}
                  startIcon={<DarkModeIcon />}
                  onClick={() => currentTheme === 'light' && handleThemeToggle()}
                  fullWidth
                >
                  Koyu
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LanguageIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Dil
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Türkçe</Typography>
                <CheckIcon color="success" />
              </Box>
            </CardContent>
          </Card>

          {/* Storage Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StorageIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Depolama
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Yerel önbelleği temizleyerek uygulamayi sıfırlayın.
              </Typography>
              <Button variant="outlined" color="error" fullWidth onClick={handleClearCache}>
                Onbellegi Temizle
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Uygulama Bilgisi
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Uygulama
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {config.app.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Versiyon
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    v{config.app.version}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Ortam
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {import.meta.env.MODE}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
