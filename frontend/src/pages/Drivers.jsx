/**
 * Drivers Page
 *
 * Driver management with CRUD operations using RTK Query
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  People as DriversIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';

// Redux
import {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { exportDrivers } from '../utils/exportUtils';
import { isValidPhone } from '../utils/helpers';

// ===========================================
// CONSTANTS
// ===========================================

const initialFormData = {
  first_name: '',
  last_name: '',
  phone: '',
  license_number: '',
  is_available: true,
};

// ===========================================
// DRIVERS COMPONENT
// ===========================================

const Drivers = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: drivers = [], isLoading, refetch } = useGetDriversQuery();
  const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
  const [deleteDriver] = useDeleteDriverMutation();

  // Local state
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // ===========================================
  // TABLE COLUMNS
  // ===========================================

  const columns = [
    {
      field: 'name',
      headerName: 'Sürücü',
      minWidth: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
            {row.first_name?.charAt(0)}
            {row.last_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.first_name} {row.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.license_number}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'Telefon',
      minWidth: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{row.phone}</Typography>
        </Box>
      ),
    },
    {
      field: 'license_number',
      headerName: 'Ehliyet No',
      minWidth: 150,
      renderCell: (row) => (
        <Chip
          icon={<BadgeIcon />}
          label={row.license_number}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'is_available',
      headerName: 'Durum',
      minWidth: 120,
      renderCell: (row) => (
        <Chip
          label={row.is_available ? 'Müsait' : 'Meşgul'}
          color={row.is_available ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'current_vehicle',
      headerName: 'Atanmış Araç',
      minWidth: 130,
      renderCell: (row) =>
        row.current_vehicle ? (
          <Chip label={row.current_vehicle} size="small" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      minWidth: 120,
      align: 'right',
      sortable: false,
      renderCell: (row) => (
        <Box>
          <Tooltip title="Düzenle">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleOpen = () => {
    setEditMode(false);
    setFormData(initialFormData);
    setErrors({});
    setGeneralError('');
    setOpen(true);
  };

  const handleEdit = (driver) => {
    setEditMode(true);
    setFormData({
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      phone: driver.phone,
      license_number: driver.license_number,
      is_available: driver.is_available,
    });
    setErrors({});
    setGeneralError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setFormData(initialFormData);
    setErrors({});
    setGeneralError('');
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const formatPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as 0XXX XXX XX XX
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) setErrors({ ...errors, phone: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'Ad zorunludur';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Soyad zorunludur';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefon zorunludur';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Geçersiz telefon numarası';
    }

    if (!formData.license_number?.trim()) {
      newErrors.license_number = 'Ehliyet numarası zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        phone: formData.phone.replace(/\s/g, ''), // Remove spaces
      };

      if (editMode) {
        await updateDriver(payload).unwrap();
        dispatch(showSuccess('Sürücü başarıyla güncellendi'));
      } else {
        await createDriver(payload).unwrap();
        dispatch(showSuccess('Sürücü başarıyla eklendi'));
      }

      handleClose();
    } catch (err) {
      if (err.data) {
        const backendErrors = {};
        Object.keys(err.data).forEach((key) => {
          const messages = err.data[key];
          backendErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(backendErrors);
        if (err.data.detail) {
          setGeneralError(err.data.detail);
        }
      } else {
        setGeneralError('Sunucu hatası!');
        dispatch(showError('İşlem başarısız oldu'));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu sürücüyü silmek istediğinize emin misiniz?')) {
      try {
        await deleteDriver(id).unwrap();
        dispatch(showSuccess('Sürücü başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Sürücü silinemedi'));
      }
    }
  };

  const handleExport = (format) => {
    try {
      exportDrivers(drivers, format);
      dispatch(showSuccess(`${format.toUpperCase()} dosyası indirildi`));
    } catch (err) {
      dispatch(showError('Dışa aktarma başarısız'));
    }
  };

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
        >
          <DriversIcon fontSize="large" color="primary" />
          Sürücü Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Sürücü Ekle
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={drivers}
        loading={isLoading}
        onExport={handleExport}
        onRefresh={refetch}
        emptyMessage="Henüz sürücü eklenmemiş."
      />

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DriversIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Sürücü Düzenle' : 'Yeni Sürücü Ekle'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* First Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="first_name"
                label="Ad"
                fullWidth
                required
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="last_name"
                label="Soyad"
                fullWidth
                required
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="phone"
                label="Telefon"
                fullWidth
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                error={!!errors.phone}
                helperText={errors.phone || 'Örn: 0532 123 45 67'}
                inputProps={{ maxLength: 14 }}
              />
            </Grid>

            {/* License Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="license_number"
                label="Ehliyet Numarası"
                fullWidth
                required
                value={formData.license_number}
                onChange={handleChange}
                error={!!errors.license_number}
                helperText={errors.license_number}
              />
            </Grid>

            {/* Availability */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleChange}
                    color="success"
                  />
                }
                label={formData.is_available ? 'Müsait' : 'Meşgul'}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} color="inherit" size="large">
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
            disabled={isCreating || isUpdating}
            sx={{ px: 4 }}
          >
            {editMode ? 'GÜNCELLE' : 'EKLE'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drivers;
