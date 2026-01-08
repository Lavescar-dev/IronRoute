/**
 * Vehicles Page
 *
 * Fleet management with CRUD operations using RTK Query
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
  MenuItem,
  Alert,
  Autocomplete,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  LocalShipping as VehicleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';

// Redux
import {
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { exportVehicles } from '../utils/exportUtils';
import { getStatusColor, getStatusLabel, formatPlateNumber, isValidPlateNumber } from '../utils/helpers';
import config from '../config';

// ===========================================
// CONSTANTS
// ===========================================

const BRANDS = config.vehicles.brands;
const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);
const VEHICLE_TYPES = config.vehicles.types;

const initialFormData = {
  plate_number: '',
  brand: '',
  model_year: new Date().getFullYear(),
  vehicle_type: 'TRUCK',
  capacity_kg: '',
};

// ===========================================
// VEHICLES COMPONENT
// ===========================================

const Vehicles = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: vehicles = [], isLoading, refetch } = useGetVehiclesQuery();
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

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
      field: 'plate_number',
      headerName: 'Plaka',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          label={row.plate_number}
          sx={{
            borderRadius: 1,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        />
      ),
    },
    {
      field: 'brand',
      headerName: 'Marka / Model',
      minWidth: 150,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.brand}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.model_year}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'vehicle_type',
      headerName: 'Tip',
      minWidth: 120,
      renderCell: (row) => getStatusLabel(row.vehicle_type),
    },
    {
      field: 'capacity_kg',
      headerName: 'Kapasite',
      minWidth: 120,
      align: 'right',
      renderCell: (row) => `${row.capacity_kg?.toLocaleString('tr-TR') || 0} kg`,
    },
    {
      field: 'status',
      headerName: 'Durum',
      minWidth: 120,
      type: 'status',
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

  const handleEdit = (vehicle) => {
    setEditMode(true);
    setFormData({
      id: vehicle.id,
      plate_number: vehicle.plate_number,
      brand: vehicle.brand,
      model_year: vehicle.model_year,
      vehicle_type: vehicle.vehicle_type,
      capacity_kg: vehicle.capacity_kg,
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
    let { name, value } = e.target;

    if (name === 'plate_number') {
      value = formatPlateNumber(value);
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleBrandChange = (event, newValue) => {
    setFormData({ ...formData, brand: newValue || '' });
    if (errors.brand) setErrors({ ...errors, brand: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plate_number) {
      newErrors.plate_number = 'Plaka zorunludur';
    } else if (!isValidPlateNumber(formData.plate_number)) {
      newErrors.plate_number = 'Geçersiz plaka formatı (Örn: 06 ABC 123)';
    }

    if (!formData.brand) {
      newErrors.brand = 'Marka seçilmelidir';
    }

    if (!formData.capacity_kg) {
      newErrors.capacity_kg = 'Kapasite girilmelidir';
    } else if (formData.capacity_kg < 100) {
      newErrors.capacity_kg = 'Kapasite en az 100 kg olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        capacity_kg: Number(formData.capacity_kg),
      };

      if (editMode) {
        await updateVehicle(payload).unwrap();
        dispatch(showSuccess('Araç başarıyla güncellendi'));
      } else {
        await createVehicle(payload).unwrap();
        dispatch(showSuccess('Araç başarıyla eklendi'));
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
    if (window.confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      try {
        await deleteVehicle(id).unwrap();
        dispatch(showSuccess('Araç başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Araç silinemedi'));
      }
    }
  };

  const handleExport = (format) => {
    try {
      exportVehicles(vehicles, format);
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
          <VehicleIcon fontSize="large" color="primary" />
          Filo Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Araç Ekle
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={vehicles}
        loading={isLoading}
        onExport={handleExport}
        onRefresh={refetch}
        emptyMessage="Filo boş. Operasyona başlamak için araç ekleyin."
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
            <VehicleIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Araç Düzenle' : 'Yeni Araç Tanımla'}
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
            {/* Plate Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="plate_number"
                label="Plaka (Örn: 06 ANK 123)"
                fullWidth
                required
                value={formData.plate_number}
                onChange={handleChange}
                error={!!errors.plate_number}
                helperText={errors.plate_number || 'Format: 99 AAA 9999'}
                disabled={editMode}
                InputProps={{
                  style: {
                    fontSize: '1.2rem',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                  },
                }}
              />
            </Grid>

            {/* Vehicle Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="vehicle_type"
                label="Araç Tipi"
                fullWidth
                value={formData.vehicle_type}
                onChange={handleChange}
              >
                {VEHICLE_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Brand */}
            <Grid size={12}>
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

            {/* Model Year */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="model_year"
                label="Model Yılı"
                fullWidth
                value={formData.model_year}
                onChange={handleChange}
              >
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Capacity */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="capacity_kg"
                label="Kapasite"
                type="number"
                fullWidth
                required
                value={formData.capacity_kg}
                onChange={handleChange}
                error={!!errors.capacity_kg}
                helperText={errors.capacity_kg}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                sx={{
                  '& input[type=number]': { MozAppearance: 'textfield' },
                  '& input[type=number]::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  '& input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
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

export default Vehicles;
