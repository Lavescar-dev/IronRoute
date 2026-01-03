import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Grid, Alert, Autocomplete, InputAdornment
} from '@mui/material';
import { Add, Delete, Edit, LocalShipping } from '@mui/icons-material';
import { getVehicles, createVehicle, deleteVehicle } from '../services/logistics';

// --- KATALOG ---
const BRANDS = ['Mercedes-Benz', 'Scania', 'Volvo', 'Ford Trucks', 'Renault Trucks', 'MAN', 'DAF', 'Iveco', 'BMC'];
const YEARS = Array.from({length: 20}, (_, i) => 2026 - i);
const VEHICLE_TYPES = [
    { value: 'TRUCK', label: 'Tır (Çekici)' },
    { value: 'VAN', label: 'Kamyonet / Panelvan' }
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model_year: 2024,
    vehicle_type: 'TRUCK',
    capacity_kg: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Veri hatası:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setGeneralError('');
    setFormData({
        plate_number: '',
        brand: '',
        model_year: 2024,
        vehicle_type: 'TRUCK',
        capacity_kg: ''
    });
  };

  // --- TÜRK PLAKA FORMATLAYICI (HARDCORE MOD) ---
  const formatTurkishPlate = (value) => {
    // 1. Sadece Harf ve Rakamları al, Büyüt
    let raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = "";

    // KURAL 1: İlk karakter kesinlikle RAKAM olmalı
    if (raw.length > 0) {
        if (!/[0-9]/.test(raw[0])) return ""; // Harfle başlayamaz
        formatted += raw[0];
    }
    // KURAL 2: İkinci karakter kesinlikle RAKAM olmalı
    if (raw.length > 1) {
        if (!/[0-9]/.test(raw[1])) return formatted; 
        formatted += raw[1];
    }

    // İl Kodundan sonra geri kalan kısım
    if (raw.length > 2) {
        let remainder = raw.slice(2);
        
        // Harf kısmı ve Rakam kısmını ayırt et
        // Regex: En başta harfler olsun (1-3 arası), sonra rakamlar gelsin
        // Kullanıcı yazarken dinamik olması için manuel loop daha güvenli
        
        let letters = "";
        let numbers = "";
        let isNumberPartStarted = false;

        for (let i = 0; i < remainder.length; i++) {
            const char = remainder[i];

            if (!isNumberPartStarted) {
                // Harf kısmındayız
                if (/[A-Z]/.test(char)) {
                    if (letters.length < 3) { // Max 3 harf (TR kuralı)
                        letters += char;
                    }
                    // 3 harf dolduysa ve hala harf yazıyorsa, onu yoksay (veya rakama geçmesini bekle)
                } else if (/[0-9]/.test(char)) {
                    // Rakama geçiş yapıldı
                    if (letters.length > 0) { // En az 1 harf yazıldıysa rakama geç
                        isNumberPartStarted = true;
                        numbers += char;
                    }
                }
            } else {
                // Rakam kısmındayız (Artık harf kabul etme)
                if (/[0-9]/.test(char)) {
                    if (numbers.length < 5) { // Max 5 rakam
                        numbers += char;
                    }
                }
            }
        }

        if (letters.length > 0) formatted += " " + letters;
        if (numbers.length > 0) formatted += " " + numbers;
    }

    return formatted;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'plate_number') {
        // Eski değeri silmeye çalışıyorsa (Backspace) izin ver
        // Yeni karakter ekliyorsa formata zorla
        if (value.length < formData.plate_number.length) {
            // Silme işlemi: Sadece güncelle, formatı sonra uygular
             setFormData({ ...formData, [name]: value });
             return;
        }
        value = formatTurkishPlate(value);
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleBrandChange = (event, newValue) => {
    setFormData({ ...formData, brand: newValue });
    if (errors.brand) setErrors({ ...errors, brand: null });
  };

  const handleSubmit = async () => {
    setErrors({});
    setGeneralError('');

    const newErrors = {};
    
    // Plaka Kontrolü (Regex: 2 Rakam - Boşluk - 1/3 Harf - Boşluk - 2/5 Rakam)
    const plateRegex = /^\d{2}\s[A-Z]{1,3}\s\d{2,5}$/;

    if (!formData.plate_number) newErrors.plate_number = "Plaka zorunludur.";
    else if (!plateRegex.test(formData.plate_number)) newErrors.plate_number = "Geçersiz format (Örn: 06 ABC 123)";
    
    if (!formData.brand) newErrors.brand = "Marka seçilmelidir.";
    if (!formData.capacity_kg) newErrors.capacity_kg = "Kapasite girilmelidir.";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    try {
      await createVehicle(formData);
      handleClose();
      loadVehicles();
    } catch (err) {
      if (err.response && err.response.data) {
          const backendErrors = {};
          Object.keys(err.response.data).forEach((key) => {
              const messages = err.response.data[key];
              backendErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(backendErrors);
          if (err.response.data.detail) setGeneralError(err.response.data.detail);
      } else {
          setGeneralError('Sunucu hatası!');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu aracı silmek istediğine emin misin?")) {
      await deleteVehicle(id);
      loadVehicles();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <LocalShipping fontSize="large" sx={{ color: 'primary.main' }} /> Filo Yönetimi
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ borderRadius: 2 }}>
          Yeni Araç Ekle
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a1a1a' }}>
            <TableRow>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>PLAKA</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>MARKA / MODEL</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>TİP</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>KAPASİTE</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>DURUM</TableCell>
              <TableCell align="right" sx={{ color: '#aaa', fontWeight: 'bold' }}>İŞLEMLER</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} hover>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <Chip label={vehicle.plate_number} sx={{ borderRadius: 1, fontWeight: 'bold', bgcolor: '#333', color: '#fff' }} />
                </TableCell>
                <TableCell>{vehicle.brand} <span style={{color: '#666'}}>({vehicle.model_year})</span></TableCell>
                <TableCell>{vehicle.vehicle_type === 'TRUCK' ? 'Tır' : 'Panelvan'}</TableCell>
                <TableCell>{vehicle.capacity_kg.toLocaleString()} kg</TableCell>
                <TableCell>
                  <Chip 
                    label={vehicle.status} 
                    color={vehicle.status === 'TRANSIT' ? 'success' : 'default'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small"><Edit /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(vehicle.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                   Filo boş. Operasyona başlamak için araç ekleyin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- YENİ ARAÇ MODALI --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" 
        PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="primary" /> 
                <Typography variant="h6">Yeni Araç Tanımla</Typography>
            </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
            
            {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}
            
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
                
                {/* 1. SATIR: PLAKA ve TİP */}
                <Grid item xs={12} sm={6}>
                    <TextField 
                        name="plate_number" 
                        label="Plaka (Örn: 06 ANK 123)" 
                        fullWidth required 
                        value={formData.plate_number} 
                        onChange={handleChange}
                        helperText={errors.plate_number || "Format: 99 AAA 9999"}
                        error={!!errors.plate_number}
                        InputProps={{
                            style: { fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 'bold', fontFamily: 'monospace' }
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField 
                        select 
                        name="vehicle_type" 
                        label="Araç Tipi" 
                        fullWidth 
                        value={formData.vehicle_type} 
                        onChange={handleChange}
                    >
                        {VEHICLE_TYPES.map((type) => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* 2. SATIR: MARKA (Tam Genişlik - Patron Gibi) */}
                <Grid item xs={12}>
                    <Autocomplete
                        options={BRANDS}
                        value={formData.brand}
                        onChange={handleBrandChange}
                        freeSolo 
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Marka Seç veya Yaz" 
                                required
                                error={!!errors.brand}
                                helperText={errors.brand}
                            />
                        )}
                    />
                </Grid>

                {/* 3. SATIR: YIL ve KAPASİTE */}
                <Grid item xs={6}>
                    <TextField 
                        select 
                        name="model_year" 
                        label="Model Yılı" 
                        fullWidth 
                        value={formData.model_year} 
                        onChange={handleChange}
                    >
                        {YEARS.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={6}>
                    <TextField 
                        name="capacity_kg" 
                        label="Kapasite" 
                        type="number" 
                        fullWidth required 
                        value={formData.capacity_kg} 
                        onChange={handleChange}
                        error={!!errors.capacity_kg}
                        helperText={errors.capacity_kg}
                        InputProps={{ 
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                        sx={{
                            '& input[type=number]': { '-moz-appearance': 'textfield' },
                            '& input[type=number]::-webkit-outer-spin-button': { '-webkit-appearance': 'none', margin: 0 },
                            '& input[type=number]::-webkit-inner-spin-button': { '-webkit-appearance': 'none', margin: 0 }
                        }}
                    />
                </Grid>

            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
            <Button onClick={handleClose} color="inherit" size="large">İptal</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" size="large" sx={{ px: 4 }}>
                EKLE
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;