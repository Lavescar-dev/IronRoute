/**
 * Invoices Page
 *
 * Invoice management with CRUD operations using RTK Query
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
  Paper,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Receipt as InvoiceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PaidIcon,
  Schedule as PendingIcon,
  Cancel as CancelIcon,
  Business as CustomerIcon,
  Paid as PayIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';

// Redux
import {
  useGetInvoicesQuery,
  useGetCustomersQuery,
  useGetShipmentsQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useMarkInvoicePaidMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatDate } from '../utils/helpers';

// ===========================================
// CONSTANTS
// ===========================================

const INVOICE_STATUSES = [
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'SENT', label: 'Gönderildi' },
  { value: 'PAID', label: 'Ödendi' },
  { value: 'OVERDUE', label: 'Gecikmiş' },
  { value: 'CANCELLED', label: 'İptal' },
];

const initialFormData = {
  customer_id: '',
  shipment_id: '',
  due_date: '',
  tax_rate: 20,
  discount: 0,
  notes: '',
  status: 'DRAFT',
};

// ===========================================
// INVOICES COMPONENT
// ===========================================

const Invoices = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: invoices = [], isLoading, refetch } = useGetInvoicesQuery();
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: shipments = [] } = useGetShipmentsQuery();
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [markPaid] = useMarkInvoicePaidMutation();

  // Local state
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Filter unpaid shipments for invoicing
  const uninvoicedShipments = shipments.filter(
    (s) => s.status === 'DELIVERED' || editMode
  );

  // Get status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'SENT': return 'info';
      case 'DRAFT': return 'default';
      case 'OVERDUE': return 'error';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <PaidIcon fontSize="small" />;
      case 'OVERDUE': return <CancelIcon fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  // ===========================================
  // TABLE COLUMNS
  // ===========================================

  const columns = [
    {
      field: 'invoice_number',
      headerName: 'Fatura No',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          label={row.invoice_number || `#${row.id?.slice(0, 8)}`}
          size="small"
          variant="outlined"
          icon={<InvoiceIcon />}
        />
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Müşteri',
      minWidth: 180,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CustomerIcon fontSize="small" color="action" />
          <Typography variant="body2">{row.customer_name || 'Bilinmiyor'}</Typography>
        </Box>
      ),
    },
    {
      field: 'subtotal',
      headerName: 'Ara Toplam',
      minWidth: 120,
      align: 'right',
      renderCell: (row) => formatCurrency(parseFloat(row.subtotal) || 0),
    },
    {
      field: 'tax_amount',
      headerName: 'KDV',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => formatCurrency(parseFloat(row.tax_amount) || 0),
    },
    {
      field: 'total_amount',
      headerName: 'Toplam',
      minWidth: 130,
      align: 'right',
      renderCell: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {formatCurrency(parseFloat(row.total_amount) || 0)}
        </Typography>
      ),
    },
    {
      field: 'due_date',
      headerName: 'Vade Tarihi',
      minWidth: 120,
      type: 'date',
    },
    {
      field: 'status',
      headerName: 'Durum',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          icon={getStatusIcon(row.status)}
          label={INVOICE_STATUSES.find(s => s.value === row.status)?.label || row.status}
          size="small"
          color={getStatusColor(row.status)}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      minWidth: 150,
      align: 'right',
      sortable: false,
      renderCell: (row) => (
        <Box>
          {row.status !== 'PAID' && row.status !== 'CANCELLED' && (
            <Tooltip title="Ödendi Olarak İşaretle">
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkPaid(row.id);
                }}
              >
                <PayIcon fontSize="small" />
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
    setFormData({
      ...initialFormData,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setErrors({});
    setGeneralError('');
    setOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditMode(true);
    setFormData({
      id: invoice.id,
      customer_id: invoice.customer_id || '',
      shipment_id: invoice.shipment_id || '',
      due_date: invoice.due_date || '',
      tax_rate: invoice.tax_rate || 20,
      discount: invoice.discount || 0,
      notes: invoice.notes || '',
      status: invoice.status,
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

    if (!formData.due_date) {
      newErrors.due_date = 'Vade tarihi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        tax_rate: Number(formData.tax_rate),
        discount: Number(formData.discount),
        shipment_id: formData.shipment_id || null,
      };

      if (editMode) {
        await updateInvoice(payload).unwrap();
        dispatch(showSuccess('Fatura başarıyla güncellendi'));
      } else {
        await createInvoice(payload).unwrap();
        dispatch(showSuccess('Fatura başarıyla oluşturuldu'));
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
    if (window.confirm('Bu faturayı silmek istediğinize emin misiniz?')) {
      try {
        await deleteInvoice(id).unwrap();
        dispatch(showSuccess('Fatura başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Fatura silinemedi'));
      }
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await markPaid(id).unwrap();
      dispatch(showSuccess('Fatura ödendi olarak işaretlendi'));
    } catch (err) {
      dispatch(showError('İşlem başarısız oldu'));
    }
  };

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
    const paid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
    const pending = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED').reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
    const overdue = invoices.filter(inv => inv.status === 'OVERDUE').length;

    return { total, paid, pending, overdue };
  }, [invoices]);

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
          <InvoiceIcon fontSize="large" color="primary" />
          Fatura Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Fatura
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              {formatCurrency(stats.total)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Toplam Fatura</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {formatCurrency(stats.paid)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Tahsil Edilen</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              {formatCurrency(stats.pending)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Bekleyen</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="error.main">
              {stats.overdue}
            </Typography>
            <Typography variant="caption" color="text.secondary">Gecikmiş Fatura</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={invoices}
        loading={isLoading}
        onRefresh={refetch}
        emptyMessage="Henüz fatura oluşturulmamış."
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
            <InvoiceIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Fatura Düzenle' : 'Yeni Fatura Oluştur'}
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
                  <em>Müşteri Seçin</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Shipment */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="shipment_id"
                label="Sevkiyat (Opsiyonel)"
                fullWidth
                value={formData.shipment_id}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Sevkiyat Seçin</em>
                </MenuItem>
                {uninvoicedShipments.map((shipment) => (
                  <MenuItem key={shipment.id} value={shipment.id}>
                    #{shipment.id} - {shipment.origin} → {shipment.destination}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Due Date */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="due_date"
                label="Vade Tarihi"
                type="date"
                fullWidth
                required
                value={formData.due_date}
                onChange={handleChange}
                error={!!errors.due_date}
                helperText={errors.due_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Tax Rate */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="tax_rate"
                label="KDV Oranı"
                type="number"
                fullWidth
                value={formData.tax_rate}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            {/* Discount */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="discount"
                label="İndirim"
                type="number"
                fullWidth
                value={formData.discount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">TL</InputAdornment>,
                }}
              />
            </Grid>

            {/* Status */}
            {editMode && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  name="status"
                  label="Durum"
                  fullWidth
                  value={formData.status}
                  onChange={handleChange}
                >
                  {INVOICE_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

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
                placeholder="Fatura ile ilgili özel notlar..."
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

export default Invoices;
