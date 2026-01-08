/**
 * Customers Page
 *
 * Customer management with CRUD operations using RTK Query
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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Business as CustomersIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as AddressIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';

// Redux
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { isValidEmail, isValidPhone } from '../utils/helpers';

// ===========================================
// CONSTANTS
// ===========================================

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  tax_number: '',
  notes: '',
};

// ===========================================
// CUSTOMERS COMPONENT
// ===========================================

const Customers = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: customers = [], isLoading, refetch } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

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
      headerName: 'Müşteri',
      minWidth: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
            {row.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.name}
            </Typography>
            {row.tax_number && (
              <Typography variant="caption" color="text.secondary">
                VKN: {row.tax_number}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'E-posta',
      minWidth: 200,
      renderCell: (row) =>
        row.email ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.email}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    {
      field: 'phone',
      headerName: 'Telefon',
      minWidth: 150,
      renderCell: (row) =>
        row.phone ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    {
      field: 'address',
      headerName: 'Adres',
      minWidth: 250,
      renderCell: (row) =>
        row.address ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
            <AddressIcon fontSize="small" color="action" sx={{ mt: 0.25 }} />
            <Typography
              variant="body2"
              sx={{
                maxWidth: 220,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.address}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        ),
    },
    {
      field: 'total_shipments',
      headerName: 'Sevkiyat',
      minWidth: 100,
      align: 'center',
      renderCell: (row) => (
        <Chip
          label={row.total_shipments || 0}
          size="small"
          color={row.total_shipments > 0 ? 'primary' : 'default'}
          variant="outlined"
        />
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

  const handleEdit = (customer) => {
    setEditMode(true);
    setFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      tax_number: customer.tax_number || '',
      notes: customer.notes || '',
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

    if (!formData.name?.trim()) {
      newErrors.name = 'Müşteri adı zorunludur';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Geçersiz e-posta adresi';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Geçersiz telefon numarası';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = { ...formData };

      if (editMode) {
        await updateCustomer(payload).unwrap();
        dispatch(showSuccess('Müşteri başarıyla güncellendi'));
      } else {
        await createCustomer(payload).unwrap();
        dispatch(showSuccess('Müşteri başarıyla eklendi'));
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
    if (window.confirm('Bu musteriyi silmek istediğinize emin misiniz?')) {
      try {
        await deleteCustomer(id).unwrap();
        dispatch(showSuccess('Müşteri başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Müşteri silinemedi'));
      }
    }
  };

  const handleExport = (format) => {
    try {
      // Custom export for customers
      const columns = [
        { header: 'Müşteri', key: 'name', width: 25 },
        { header: 'E-posta', key: 'email', width: 25 },
        { header: 'Telefon', key: 'phone', width: 15 },
        { header: 'Adres', key: 'address', width: 40 },
        { header: 'VKN', key: 'tax_number', width: 15 },
      ];

      // Import dynamically based on format
      import('../utils/exportUtils').then((module) => {
        const fileName = `musteriler_${new Date().toISOString().split('T')[0]}`;
        switch (format) {
          case 'excel':
            module.exportToExcel(customers, fileName, 'Müşteriler', columns);
            break;
          case 'csv':
            module.exportToCSV(customers, fileName, columns);
            break;
          case 'pdf':
            module.exportToPDF(customers, fileName, 'Müşteri Listesi', columns);
            break;
        }
        dispatch(showSuccess(`${format.toUpperCase()} dosyası indirildi`));
      });
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
          <CustomersIcon fontSize="large" color="primary" />
          Müşteri Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={isLoading}
        onExport={handleExport}
        onRefresh={refetch}
        emptyMessage="Henüz musteri eklenmemiş."
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
            <CustomersIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
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
            {/* Name */}
            <Grid size={12}>
              <TextField
                name="name"
                label="Müşteri / Firma Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="email"
                label="E-posta"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="phone"
                label="Telefon"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="0532 123 45 67"
              />
            </Grid>

            {/* Tax Number */}
            <Grid size={12}>
              <TextField
                name="tax_number"
                label="Vergi Kimlik Numarası (VKN)"
                fullWidth
                value={formData.tax_number}
                onChange={handleChange}
                placeholder="10 haneli VKN"
                inputProps={{ maxLength: 11 }}
              />
            </Grid>

            {/* Address */}
            <Grid size={12}>
              <TextField
                name="address"
                label="Adres"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            {/* Notes */}
            <Grid size={12}>
              <TextField
                name="notes"
                label="Notlar"
                fullWidth
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Müşteri ile ilgili özel notlar..."
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

export default Customers;
