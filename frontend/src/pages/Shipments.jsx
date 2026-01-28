/**
 * Shipments Page
 *
 * Shipment management with CRUD operations using RTK Query
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
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Inventory as ShipmentsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as VehicleIcon,
  Person as CustomerIcon,
  LocationOn as LocationIcon,
  PhotoLibrary as PhotoIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';
import ShipmentPhotosDialog from '../components/shipments/ShipmentPhotosDialog';

// Redux
import {
  useGetShipmentsQuery,
  useGetVehiclesQuery,
  useGetCustomersQuery,
  useCreateShipmentMutation,
  useUpdateShipmentMutation,
  useDeleteShipmentMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { exportShipments } from '../utils/exportUtils';
import { getStatusColor, getStatusLabel, formatCurrency, formatDate } from '../utils/helpers';
import config from '../config';

// ===========================================
// CONSTANTS
// ===========================================

const SHIPMENT_STATUSES = config.shipments.statuses;

const initialFormData = {
  customer_id: '',
  vehicle_id: '',
  origin: '',
  destination: '',
  weight_kg: '',
  price: '',
  status: 'PENDING',
  notes: '',
};

// ===========================================
// SHIPMENTS COMPONENT
// ===========================================

const Shipments = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: shipments = [], isLoading, refetch } = useGetShipmentsQuery();
  const { data: vehicles = [] } = useGetVehiclesQuery();
  const { data: customers = [] } = useGetCustomersQuery();
  const [createShipment, { isLoading: isCreating }] = useCreateShipmentMutation();
  const [updateShipment, { isLoading: isUpdating }] = useUpdateShipmentMutation();
  const [deleteShipment] = useDeleteShipmentMutation();

  // Local state
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [photosShipment, setPhotosShipment] = useState(null);

  // Filter available vehicles (IDLE status)
  const availableVehicles = vehicles.filter(
    (v) => v.status === 'IDLE' || (editMode && v.id === formData.vehicle_id)
  );

  // ===========================================
  // TABLE COLUMNS
  // ===========================================

  const columns = [
    {
      field: 'id',
      headerName: 'Sevkiyat No',
      minWidth: 100,
      renderCell: (row) => (
        <Chip label={`#${row.id}`} size="small" variant="outlined" />
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Müşteri',
      minWidth: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CustomerIcon fontSize="small" color="action" />
          <Typography variant="body2">{row.customer_name || 'Bilinmiyor'}</Typography>
        </Box>
      ),
    },
    {
      field: 'route',
      headerName: 'Güzergah',
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="success" />
            {row.origin}
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="error" />
            {row.destination}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'plate_number',
      headerName: 'Araç',
      minWidth: 120,
      renderCell: (row) =>
        row.plate_number ? (
          <Chip
            icon={<VehicleIcon />}
            label={row.plate_number}
            size="small"
            variant="outlined"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Atanmadı
          </Typography>
        ),
    },
    {
      field: 'weight_kg',
      headerName: 'Ağırlık',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => `${row.weight_kg?.toLocaleString('tr-TR') || 0} kg`,
    },
    {
      field: 'price',
      headerName: 'Ücret',
      minWidth: 120,
      align: 'right',
      type: 'currency',
    },
    {
      field: 'status',
      headerName: 'Durum',
      minWidth: 130,
      type: 'status',
    },
    {
      field: 'created_at',
      headerName: 'Tarih',
      minWidth: 120,
      type: 'date',
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      minWidth: 120,
      align: 'right',
      sortable: false,
      renderCell: (row) => (
        <Box>
          {row.photos && row.photos.length > 0 && (
            <Tooltip title="Fotograflar">
              <IconButton
                size="small"
                color="info"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotosShipment(row);
                }}
              >
                <PhotoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
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

  const handleEdit = (shipment) => {
    setEditMode(true);
    setFormData({
      id: shipment.id,
      customer_id: shipment.customer_id || '',
      vehicle_id: shipment.vehicle_id || '',
      origin: shipment.origin,
      destination: shipment.destination,
      weight_kg: shipment.weight_kg,
      price: shipment.price,
      status: shipment.status,
      notes: shipment.notes || '',
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_id) {
      newErrors.customer_id = 'Müşteri seçilmelidir';
    }

    if (!formData.origin?.trim()) {
      newErrors.origin = 'Çıkış noktası zorunludur';
    }

    if (!formData.destination?.trim()) {
      newErrors.destination = 'Varış noktası zorunludur';
    }

    if (!formData.weight_kg) {
      newErrors.weight_kg = 'Ağırlık zorunludur';
    } else if (formData.weight_kg < 1) {
      newErrors.weight_kg = 'Ağırlık en az 1 kg olmalıdır';
    }

    if (!formData.price) {
      newErrors.price = 'Ücret zorunludur';
    } else if (formData.price < 0) {
      newErrors.price = 'Ücret negatif olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        weight_kg: Number(formData.weight_kg),
        price: Number(formData.price),
        vehicle_id: formData.vehicle_id || null,
      };

      if (editMode) {
        await updateShipment(payload).unwrap();
        dispatch(showSuccess('Sevkiyat başarıyla güncellendi'));
      } else {
        await createShipment(payload).unwrap();
        dispatch(showSuccess('Sevkiyat başarıyla oluşturuldu'));
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
    if (window.confirm('Bu sevkiyati silmek istediğinize emin misiniz?')) {
      try {
        await deleteShipment(id).unwrap();
        dispatch(showSuccess('Sevkiyat başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Sevkiyat silinemedi'));
      }
    }
  };

  const handleExport = (format) => {
    try {
      exportShipments(shipments, format);
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
          <ShipmentsIcon fontSize="large" color="primary" />
          Sevkiyat Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Sevkiyat
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={shipments}
        loading={isLoading}
        onExport={handleExport}
        onRefresh={refetch}
        emptyMessage="Henuz sevkiyat oluşturulmamış."
      />

      {/* Shipment Photos Dialog */}
      <ShipmentPhotosDialog
        open={!!photosShipment}
        onClose={() => setPhotosShipment(null)}
        shipment={photosShipment}
      />

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShipmentsIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Sevkiyat Düzenle' : 'Yeni Sevkiyat Oluştur'}
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
            {/* Customer */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="customer_id"
                label="Müşteri"
                fullWidth
                required
                value={formData.customer_id}
                onChange={handleChange}
                error={!!errors.customer_id}
                helperText={errors.customer_id}
              >
                <MenuItem value="">
                  <em>Müşteri Secin</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Vehicle */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="vehicle_id"
                label="Araç (Opsiyonel)"
                fullWidth
                value={formData.vehicle_id}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Araç Secin</em>
                </MenuItem>
                {availableVehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate_number} - {vehicle.brand}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Origin */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="origin"
                label="Çıkış Noktası"
                fullWidth
                required
                value={formData.origin}
                onChange={handleChange}
                error={!!errors.origin}
                helperText={errors.origin}
                placeholder="Örn: Istanbul, Kadikoy"
              />
            </Grid>

            {/* Destination */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="destination"
                label="Varış Noktası"
                fullWidth
                required
                value={formData.destination}
                onChange={handleChange}
                error={!!errors.destination}
                helperText={errors.destination}
                placeholder="Örn: Ankara, Kecioren"
              />
            </Grid>

            {/* Weight */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="weight_kg"
                label="Ağırlık"
                type="number"
                fullWidth
                required
                value={formData.weight_kg}
                onChange={handleChange}
                error={!!errors.weight_kg}
                helperText={errors.weight_kg}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
            </Grid>

            {/* Price */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="price"
                label="Ücret"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">TL</InputAdornment>,
                }}
              />
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                name="status"
                label="Durum"
                fullWidth
                value={formData.status}
                onChange={handleChange}
              >
                {SHIPMENT_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Notes */}
            <Grid size={12}>
              <TextField
                name="notes"
                label="Notlar"
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Sevkiyat ile ilgili özel notlar..."
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
            {editMode ? 'GÜNCELLE' : 'OLUŞTUR'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shipments;
