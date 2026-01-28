/**
 * Maintenance Page
 *
 * Vehicle maintenance records management using RTK Query
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
  Tab,
  Tabs,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Build as MaintenanceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as VehicleIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
  Warning as WarningIcon,
  LocalGasStation as FuelIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';
import VehicleMaintenanceDialog from '../components/maintenance/VehicleMaintenanceDialog';

// Redux
import {
  useGetMaintenanceRecordsQuery,
  useGetVehiclesQuery,
  useCreateMaintenanceRecordMutation,
  useUpdateMaintenanceRecordMutation,
  useDeleteMaintenanceRecordMutation,
  useGetFuelRecordsQuery,
  useCreateFuelRecordMutation,
  useGetDriversQuery,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatDate } from '../utils/helpers';

// ===========================================
// CONSTANTS
// ===========================================

const MAINTENANCE_TYPES = [
  { value: 'SCHEDULED', label: 'Planlı Bakım' },
  { value: 'REPAIR', label: 'Arıza/Tamir' },
  { value: 'INSPECTION', label: 'Muayene' },
  { value: 'TIRE', label: 'Lastik Değişimi' },
  { value: 'OIL', label: 'Yağ Değişimi' },
  { value: 'BRAKE', label: 'Fren Bakımı' },
  { value: 'OTHER', label: 'Diğer' },
];

const MAINTENANCE_STATUSES = [
  { value: 'SCHEDULED', label: 'Planlandı' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal Edildi' },
];

const initialMaintenanceForm = {
  vehicle_id: '',
  maintenance_type: 'SCHEDULED',
  status: 'SCHEDULED',
  description: '',
  scheduled_date: '',
  completed_date: '',
  odometer_reading: '',
  cost: '',
  service_provider: '',
  notes: '',
};

const initialFuelForm = {
  vehicle_id: '',
  driver_id: '',
  liters: '',
  price_per_liter: '',
  total_cost: '',
  odometer_reading: '',
  fuel_station: '',
  fill_date: '',
};

// ===========================================
// MAINTENANCE COMPONENT
// ===========================================

const Maintenance = () => {
  const dispatch = useDispatch();

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // RTK Query hooks
  const { data: maintenanceRecords = [], isLoading: maintenanceLoading, refetch: refetchMaintenance } = useGetMaintenanceRecordsQuery();
  const { data: fuelRecords = [], isLoading: fuelLoading, refetch: refetchFuel } = useGetFuelRecordsQuery();
  const { data: vehicles = [] } = useGetVehiclesQuery();
  const { data: drivers = [] } = useGetDriversQuery();
  const [createMaintenance, { isLoading: isCreatingMaintenance }] = useCreateMaintenanceRecordMutation();
  const [updateMaintenance, { isLoading: isUpdatingMaintenance }] = useUpdateMaintenanceRecordMutation();
  const [deleteMaintenance] = useDeleteMaintenanceRecordMutation();
  const [createFuel, { isLoading: isCreatingFuel }] = useCreateFuelRecordMutation();

  // Local state
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [fuelOpen, setFuelOpen] = useState(false);
  const [timelinePlate, setTimelinePlate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState(initialMaintenanceForm);
  const [fuelForm, setFuelForm] = useState(initialFuelForm);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Get status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'SCHEDULED': return 'warning';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  // ===========================================
  // MAINTENANCE TABLE COLUMNS
  // ===========================================

  const maintenanceColumns = [
    {
      field: 'vehicle_plate',
      headerName: 'Araç',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          icon={<VehicleIcon />}
          label={row.vehicle_plate || 'N/A'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'maintenance_type',
      headerName: 'Bakım Tipi',
      minWidth: 150,
      renderCell: (row) => (
        <Chip
          icon={<MaintenanceIcon />}
          label={MAINTENANCE_TYPES.find(t => t.value === row.maintenance_type)?.label || row.maintenance_type}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Açıklama',
      minWidth: 200,
    },
    {
      field: 'scheduled_date',
      headerName: 'Planlanan Tarih',
      minWidth: 130,
      type: 'date',
    },
    {
      field: 'cost',
      headerName: 'Maliyet',
      minWidth: 120,
      align: 'right',
      renderCell: (row) => formatCurrency(parseFloat(row.cost) || 0),
    },
    {
      field: 'service_provider',
      headerName: 'Servis',
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Durum',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          icon={row.status === 'COMPLETED' ? <CompletedIcon /> : <ScheduleIcon />}
          label={MAINTENANCE_STATUSES.find(s => s.value === row.status)?.label || row.status}
          size="small"
          color={getStatusColor(row.status)}
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
                handleEditMaintenance(row);
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
                handleDeleteMaintenance(row.id);
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
  // FUEL TABLE COLUMNS
  // ===========================================

  const fuelColumns = [
    {
      field: 'vehicle_plate',
      headerName: 'Araç',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          icon={<VehicleIcon />}
          label={row.vehicle_plate || 'N/A'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'fill_date',
      headerName: 'Tarih',
      minWidth: 130,
      type: 'date',
    },
    {
      field: 'liters',
      headerName: 'Litre',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => `${parseFloat(row.liters).toFixed(2)} L`,
    },
    {
      field: 'price_per_liter',
      headerName: 'Litre Fiyatı',
      minWidth: 120,
      align: 'right',
      renderCell: (row) => formatCurrency(parseFloat(row.price_per_liter) || 0),
    },
    {
      field: 'total_cost',
      headerName: 'Toplam',
      minWidth: 130,
      align: 'right',
      renderCell: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {formatCurrency(parseFloat(row.total_cost) || 0)}
        </Typography>
      ),
    },
    {
      field: 'odometer_reading',
      headerName: 'KM',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => `${row.odometer_reading?.toLocaleString('tr-TR') || 0} km`,
    },
    {
      field: 'fuel_station',
      headerName: 'İstasyon',
      minWidth: 150,
    },
  ];

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleOpenMaintenance = () => {
    setEditMode(false);
    setMaintenanceForm({
      ...initialMaintenanceForm,
      scheduled_date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setGeneralError('');
    setMaintenanceOpen(true);
  };

  const handleEditMaintenance = (record) => {
    setEditMode(true);
    setMaintenanceForm({
      id: record.id,
      vehicle_id: record.vehicle_id || '',
      maintenance_type: record.maintenance_type,
      status: record.status,
      description: record.description || '',
      scheduled_date: record.scheduled_date || '',
      completed_date: record.completed_date || '',
      odometer_reading: record.odometer_reading || '',
      cost: record.cost || '',
      service_provider: record.service_provider || '',
      notes: record.notes || '',
    });
    setErrors({});
    setGeneralError('');
    setMaintenanceOpen(true);
  };

  const handleCloseMaintenance = () => {
    setMaintenanceOpen(false);
    setEditMode(false);
    setMaintenanceForm(initialMaintenanceForm);
    setErrors({});
    setGeneralError('');
  };

  const handleOpenFuel = () => {
    setFuelForm({
      ...initialFuelForm,
      fill_date: new Date().toISOString().slice(0, 16),
    });
    setErrors({});
    setGeneralError('');
    setFuelOpen(true);
  };

  const handleCloseFuel = () => {
    setFuelOpen(false);
    setFuelForm(initialFuelForm);
    setErrors({});
    setGeneralError('');
  };

  const handleMaintenanceChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm({ ...maintenanceForm, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFuelChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...fuelForm, [name]: value };

    // Auto-calculate total cost
    if (name === 'liters' || name === 'price_per_liter') {
      const liters = name === 'liters' ? parseFloat(value) : parseFloat(fuelForm.liters);
      const price = name === 'price_per_liter' ? parseFloat(value) : parseFloat(fuelForm.price_per_liter);
      if (!isNaN(liters) && !isNaN(price)) {
        newForm.total_cost = (liters * price).toFixed(2);
      }
    }

    setFuelForm(newForm);
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmitMaintenance = async () => {
    const newErrors = {};
    if (!maintenanceForm.vehicle_id) newErrors.vehicle_id = 'Araç seçilmelidir';
    if (!maintenanceForm.description?.trim()) newErrors.description = 'Açıklama zorunludur';
    if (!maintenanceForm.scheduled_date) newErrors.scheduled_date = 'Tarih zorunludur';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        ...maintenanceForm,
        cost: Number(maintenanceForm.cost) || 0,
        odometer_reading: maintenanceForm.odometer_reading ? Number(maintenanceForm.odometer_reading) : null,
        completed_date: maintenanceForm.completed_date || null,
      };

      if (editMode) {
        await updateMaintenance(payload).unwrap();
        dispatch(showSuccess('Bakım kaydı güncellendi'));
      } else {
        await createMaintenance(payload).unwrap();
        dispatch(showSuccess('Bakım kaydı oluşturuldu'));
      }

      handleCloseMaintenance();
    } catch (err) {
      setGeneralError('Sunucu hatası!');
      dispatch(showError('İşlem başarısız oldu'));
    }
  };

  const handleSubmitFuel = async () => {
    const newErrors = {};
    if (!fuelForm.vehicle_id) newErrors.vehicle_id = 'Araç seçilmelidir';
    if (!fuelForm.liters) newErrors.liters = 'Litre zorunludur';
    if (!fuelForm.price_per_liter) newErrors.price_per_liter = 'Fiyat zorunludur';
    if (!fuelForm.odometer_reading) newErrors.odometer_reading = 'KM zorunludur';
    if (!fuelForm.fill_date) newErrors.fill_date = 'Tarih zorunludur';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        ...fuelForm,
        liters: Number(fuelForm.liters),
        price_per_liter: Number(fuelForm.price_per_liter),
        total_cost: Number(fuelForm.total_cost),
        odometer_reading: Number(fuelForm.odometer_reading),
        driver_id: fuelForm.driver_id || null,
      };

      await createFuel(payload).unwrap();
      dispatch(showSuccess('Yakıt kaydı oluşturuldu'));
      handleCloseFuel();
    } catch (err) {
      setGeneralError('Sunucu hatası!');
      dispatch(showError('İşlem başarısız oldu'));
    }
  };

  const handleDeleteMaintenance = async (id) => {
    if (window.confirm('Bu bakım kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteMaintenance(id).unwrap();
        dispatch(showSuccess('Bakım kaydı silindi'));
      } catch (err) {
        dispatch(showError('Silme başarısız oldu'));
      }
    }
  };

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const maintenanceCost = maintenanceRecords.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    const fuelCost = fuelRecords.reduce((sum, r) => sum + (parseFloat(r.total_cost) || 0), 0);
    const totalFuel = fuelRecords.reduce((sum, r) => sum + (parseFloat(r.liters) || 0), 0);
    const pendingMaintenance = maintenanceRecords.filter(r => r.status === 'SCHEDULED').length;

    return { maintenanceCost, fuelCost, totalFuel, pendingMaintenance };
  }, [maintenanceRecords, fuelRecords]);

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
          <MaintenanceIcon fontSize="large" color="primary" />
          Bakım ve Yakıt Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FuelIcon />}
            onClick={handleOpenFuel}
            sx={{ borderRadius: 2 }}
          >
            Yakıt Ekle
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenMaintenance}
            sx={{ borderRadius: 2 }}
          >
            Bakım Ekle
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              {formatCurrency(stats.maintenanceCost)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Bakım Gideri</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              {formatCurrency(stats.fuelCost)}
            </Typography>
            <Typography variant="caption" color="text.secondary">Yakıt Gideri</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="info.main">
              {stats.totalFuel.toFixed(0)} L
            </Typography>
            <Typography variant="caption" color="text.secondary">Toplam Yakıt</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="error.main">
              {stats.pendingMaintenance}
            </Typography>
            <Typography variant="caption" color="text.secondary">Bekleyen Bakım</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab icon={<MaintenanceIcon />} label="Bakım Kayıtları" iconPosition="start" />
          <Tab icon={<FuelIcon />} label="Yakıt Kayıtları" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 ? (
        <DataTable
          columns={maintenanceColumns}
          data={maintenanceRecords}
          loading={maintenanceLoading}
          onRefresh={refetchMaintenance}
          onRowClick={(row) => setTimelinePlate(row.vehicle_plate)}
          emptyMessage="Henüz bakım kaydı yok."
        />
      ) : (
        <DataTable
          columns={fuelColumns}
          data={fuelRecords}
          loading={fuelLoading}
          onRefresh={refetchFuel}
          emptyMessage="Henüz yakıt kaydı yok."
        />
      )}

      {/* Maintenance Dialog */}
      <Dialog
        open={maintenanceOpen}
        onClose={handleCloseMaintenance}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MaintenanceIcon color="primary" />
            <Typography variant="h6">
              {editMode ? 'Bakım Kaydı Düzenle' : 'Yeni Bakım Kaydı'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}

          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="vehicle_id"
                label="Araç"
                fullWidth
                required
                value={maintenanceForm.vehicle_id}
                onChange={handleMaintenanceChange}
                error={!!errors.vehicle_id}
                helperText={errors.vehicle_id}
              >
                <MenuItem value=""><em>Araç Seçin</em></MenuItem>
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.plate_number} - {v.brand}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="maintenance_type"
                label="Bakım Tipi"
                fullWidth
                value={maintenanceForm.maintenance_type}
                onChange={handleMaintenanceChange}
              >
                {MAINTENANCE_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                required
                value={maintenanceForm.description}
                onChange={handleMaintenanceChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="scheduled_date"
                label="Planlanan Tarih"
                type="date"
                fullWidth
                required
                value={maintenanceForm.scheduled_date}
                onChange={handleMaintenanceChange}
                error={!!errors.scheduled_date}
                helperText={errors.scheduled_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="cost"
                label="Maliyet"
                type="number"
                fullWidth
                value={maintenanceForm.cost}
                onChange={handleMaintenanceChange}
                InputProps={{ startAdornment: <InputAdornment position="start">TL</InputAdornment> }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                name="status"
                label="Durum"
                fullWidth
                value={maintenanceForm.status}
                onChange={handleMaintenanceChange}
              >
                {MAINTENANCE_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="service_provider"
                label="Servis Sağlayıcı"
                fullWidth
                value={maintenanceForm.service_provider}
                onChange={handleMaintenanceChange}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="odometer_reading"
                label="KM Sayacı"
                type="number"
                fullWidth
                value={maintenanceForm.odometer_reading}
                onChange={handleMaintenanceChange}
                InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                name="notes"
                label="Notlar"
                fullWidth
                multiline
                rows={2}
                value={maintenanceForm.notes}
                onChange={handleMaintenanceChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleCloseMaintenance} color="inherit" size="large">İptal</Button>
          <Button
            onClick={handleSubmitMaintenance}
            variant="contained"
            size="large"
            disabled={isCreatingMaintenance || isUpdatingMaintenance}
            sx={{ px: 4 }}
          >
            {editMode ? 'GÜNCELLE' : 'OLUŞTUR'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vehicle Maintenance Timeline Dialog */}
      <VehicleMaintenanceDialog
        open={!!timelinePlate}
        onClose={() => setTimelinePlate(null)}
        vehiclePlate={timelinePlate}
        allRecords={maintenanceRecords}
        vehicles={vehicles}
      />

      {/* Fuel Dialog */}
      <Dialog
        open={fuelOpen}
        onClose={handleCloseFuel}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FuelIcon color="primary" />
            <Typography variant="h6">Yeni Yakıt Kaydı</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}

          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="vehicle_id"
                label="Araç"
                fullWidth
                required
                value={fuelForm.vehicle_id}
                onChange={handleFuelChange}
                error={!!errors.vehicle_id}
                helperText={errors.vehicle_id}
              >
                <MenuItem value=""><em>Araç Seçin</em></MenuItem>
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.plate_number}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="driver_id"
                label="Sürücü (Opsiyonel)"
                fullWidth
                value={fuelForm.driver_id}
                onChange={handleFuelChange}
              >
                <MenuItem value=""><em>Sürücü Seçin</em></MenuItem>
                {drivers.map((d) => (
                  <MenuItem key={d.id} value={d.id}>{d.first_name} {d.last_name}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="fill_date"
                label="Tarih"
                type="datetime-local"
                fullWidth
                required
                value={fuelForm.fill_date}
                onChange={handleFuelChange}
                error={!!errors.fill_date}
                helperText={errors.fill_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="odometer_reading"
                label="KM Sayacı"
                type="number"
                fullWidth
                required
                value={fuelForm.odometer_reading}
                onChange={handleFuelChange}
                error={!!errors.odometer_reading}
                helperText={errors.odometer_reading}
                InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="liters"
                label="Litre"
                type="number"
                fullWidth
                required
                value={fuelForm.liters}
                onChange={handleFuelChange}
                error={!!errors.liters}
                helperText={errors.liters}
                InputProps={{ endAdornment: <InputAdornment position="end">L</InputAdornment> }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="price_per_liter"
                label="Litre Fiyatı"
                type="number"
                fullWidth
                required
                value={fuelForm.price_per_liter}
                onChange={handleFuelChange}
                error={!!errors.price_per_liter}
                helperText={errors.price_per_liter}
                InputProps={{ startAdornment: <InputAdornment position="start">TL</InputAdornment> }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="total_cost"
                label="Toplam"
                type="number"
                fullWidth
                value={fuelForm.total_cost}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">TL</InputAdornment>,
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                name="fuel_station"
                label="İstasyon"
                fullWidth
                value={fuelForm.fuel_station}
                onChange={handleFuelChange}
                placeholder="Örn: Shell, BP, Opet..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleCloseFuel} color="inherit" size="large">İptal</Button>
          <Button
            onClick={handleSubmitFuel}
            variant="contained"
            size="large"
            disabled={isCreatingFuel}
            sx={{ px: 4 }}
          >
            KAYDET
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Maintenance;
