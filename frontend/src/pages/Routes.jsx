/**
 * Routes Page
 *
 * Route planning and optimization management using RTK Query
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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Add as AddIcon,
  Route as RouteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as VehicleIcon,
  Person as DriverIcon,
  PlayArrow as OptimizeIcon,
  Schedule as TimeIcon,
  LocationOn as LocationIcon,
  Flag as FlagIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';

// Components
import DataTable from '../components/common/DataTable';
import RouteDetailDialog from '../components/routes/RouteDetailDialog';

// Redux
import {
  useGetRoutesQuery,
  useGetVehiclesQuery,
  useGetDriversQuery,
  useGetShipmentsQuery,
  useCreateRouteMutation,
  useOptimizeRouteMutation,
  useDeleteRouteMutation,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { formatDate } from '../utils/helpers';

// ===========================================
// CONSTANTS
// ===========================================

const ROUTE_STATUSES = [
  { value: 'PLANNED', label: 'Planlandı' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal' },
];

const initialFormData = {
  name: '',
  vehicle_id: '',
  driver_id: '',
  planned_date: '',
  notes: '',
  shipment_ids: [],
};

// ===========================================
// ROUTES COMPONENT
// ===========================================

const Routes = () => {
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: routes = [], isLoading, refetch } = useGetRoutesQuery();
  const { data: vehicles = [] } = useGetVehiclesQuery();
  const { data: drivers = [] } = useGetDriversQuery();
  const { data: shipments = [] } = useGetShipmentsQuery();
  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [optimizeRoute, { isLoading: isOptimizing }] = useOptimizeRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();

  // Local state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Filter pending shipments for route planning
  const pendingShipments = shipments.filter(
    (s) => s.status === 'PENDING' || s.status === 'DISPATCHED'
  );

  // Available vehicles (IDLE)
  const availableVehicles = vehicles.filter((v) => v.status === 'IDLE');

  // Available drivers
  const availableDrivers = drivers.filter((d) => d.is_available);

  // Get status styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'PLANNED': return 'warning';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  // ===========================================
  // TABLE COLUMNS
  // ===========================================

  const columns = [
    {
      field: 'name',
      headerName: 'Rota Adı',
      minWidth: 180,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteIcon color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight={500}>{row.name}</Typography>
        </Box>
      ),
    },
    {
      field: 'vehicle_plate',
      headerName: 'Araç',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          icon={<VehicleIcon />}
          label={row.vehicle_plate || 'Atanmadı'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'driver_name',
      headerName: 'Sürücü',
      minWidth: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DriverIcon fontSize="small" color="action" />
          <Typography variant="body2">{row.driver_name || 'Atanmadı'}</Typography>
        </Box>
      ),
    },
    {
      field: 'stops_count',
      headerName: 'Durak',
      minWidth: 80,
      align: 'center',
      renderCell: (row) => (
        <Chip
          label={row.stops_count || 0}
          size="small"
          color="primary"
        />
      ),
    },
    {
      field: 'total_distance_km',
      headerName: 'Mesafe',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => `${parseFloat(row.total_distance_km || 0).toFixed(1)} km`,
    },
    {
      field: 'total_duration_mins',
      headerName: 'Süre',
      minWidth: 100,
      align: 'right',
      renderCell: (row) => {
        const mins = row.total_duration_mins || 0;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return hours > 0 ? `${hours}s ${remainingMins}d` : `${mins} dk`;
      },
    },
    {
      field: 'planned_date',
      headerName: 'Planlanan Tarih',
      minWidth: 130,
      type: 'date',
    },
    {
      field: 'status',
      headerName: 'Durum',
      minWidth: 130,
      renderCell: (row) => (
        <Chip
          label={ROUTE_STATUSES.find(s => s.value === row.status)?.label || row.status}
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
          {row.status === 'PLANNED' && (
            <Tooltip title="Rotayı Optimize Et">
              <IconButton
                size="small"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptimize(row.id);
                }}
                disabled={isOptimizing}
              >
                <OptimizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Detaylar">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoute(row);
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
    setFormData({
      ...initialFormData,
      planned_date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setGeneralError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setErrors({});
    setGeneralError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleShipmentToggle = (shipmentId) => {
    const current = formData.shipment_ids || [];
    const isSelected = current.includes(shipmentId);

    setFormData({
      ...formData,
      shipment_ids: isSelected
        ? current.filter((id) => id !== shipmentId)
        : [...current, shipmentId],
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Rota adı zorunludur';
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Araç seçilmelidir';
    }

    if (!formData.planned_date) {
      newErrors.planned_date = 'Tarih zorunludur';
    }

    if (!formData.shipment_ids || formData.shipment_ids.length === 0) {
      newErrors.shipments = 'En az bir sevkiyat seçilmelidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        driver_id: formData.driver_id || null,
      };

      await createRoute(payload).unwrap();
      dispatch(showSuccess('Rota başarıyla oluşturuldu'));
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

  const handleOptimize = async (id) => {
    try {
      await optimizeRoute(id).unwrap();
      dispatch(showSuccess('Rota optimize edildi'));
    } catch (err) {
      dispatch(showError('Optimizasyon başarısız oldu'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu rotayı silmek istediğinize emin misiniz?')) {
      try {
        await deleteRoute(id).unwrap();
        dispatch(showSuccess('Rota başarıyla silindi'));
      } catch (err) {
        dispatch(showError('Rota silinemedi'));
      }
    }
  };

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const totalRoutes = routes.length;
    const activeRoutes = routes.filter(r => r.status === 'IN_PROGRESS').length;
    const completedRoutes = routes.filter(r => r.status === 'COMPLETED').length;
    const totalDistance = routes.reduce((sum, r) => sum + (parseFloat(r.total_distance_km) || 0), 0);

    return { totalRoutes, activeRoutes, completedRoutes, totalDistance };
  }, [routes]);

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
          <RouteIcon fontSize="large" color="primary" />
          Rota Planlama
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Yeni Rota
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              {stats.totalRoutes}
            </Typography>
            <Typography variant="caption" color="text.secondary">Toplam Rota</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="info.main">
              {stats.activeRoutes}
            </Typography>
            <Typography variant="caption" color="text.secondary">Aktif Rota</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {stats.completedRoutes}
            </Typography>
            <Typography variant="caption" color="text.secondary">Tamamlanan</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              {stats.totalDistance.toFixed(0)} km
            </Typography>
            <Typography variant="caption" color="text.secondary">Toplam Mesafe</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={routes}
        loading={isLoading}
        onRefresh={refetch}
        onRowClick={(row) => setSelectedRoute(row)}
        emptyMessage="Henüz rota oluşturulmamış."
      />

      {/* Create Route Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RouteIcon color="primary" />
            <Typography variant="h6">Yeni Rota Oluştur</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* Route Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="name"
                label="Rota Adı"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Örn: İstanbul-Ankara Hattı"
              />
            </Grid>

            {/* Planned Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="planned_date"
                label="Planlanan Tarih"
                type="date"
                fullWidth
                required
                value={formData.planned_date}
                onChange={handleChange}
                error={!!errors.planned_date}
                helperText={errors.planned_date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Vehicle */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="vehicle_id"
                label="Araç"
                fullWidth
                required
                value={formData.vehicle_id}
                onChange={handleChange}
                error={!!errors.vehicle_id}
                helperText={errors.vehicle_id}
              >
                <MenuItem value="">
                  <em>Araç Seçin</em>
                </MenuItem>
                {availableVehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate_number} - {vehicle.brand} ({vehicle.capacity_kg} kg)
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Driver */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="driver_id"
                label="Sürücü (Opsiyonel)"
                fullWidth
                value={formData.driver_id}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Sürücü Seçin</em>
                </MenuItem>
                {availableDrivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.first_name} {driver.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Shipments Selection */}
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" fontSize="small" />
                Sevkiyatları Seçin
                {errors.shipments && (
                  <Typography variant="caption" color="error">
                    ({errors.shipments})
                  </Typography>
                )}
              </Typography>

              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                {pendingShipments.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Bekleyen sevkiyat bulunmuyor
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {pendingShipments.map((shipment, index) => {
                      const isSelected = formData.shipment_ids?.includes(shipment.id);
                      return (
                        <React.Fragment key={shipment.id}>
                          <ListItem
                            button
                            onClick={() => handleShipmentToggle(shipment.id)}
                            sx={{
                              bgcolor: isSelected ? 'action.selected' : 'transparent',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <ListItemIcon>
                              <Chip
                                size="small"
                                label={isSelected ? formData.shipment_ids.indexOf(shipment.id) + 1 : '-'}
                                color={isSelected ? 'primary' : 'default'}
                                sx={{ width: 32 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {shipment.origin} → {shipment.destination}
                                  </Typography>
                                  <Chip
                                    label={shipment.status}
                                    size="small"
                                    color={shipment.status === 'PENDING' ? 'warning' : 'info'}
                                    sx={{ height: 20 }}
                                  />
                                </Box>
                              }
                              secondary={`${shipment.customer_name} • ${shipment.weight_kg} kg`}
                            />
                            <ListItemSecondaryAction>
                              <Typography variant="caption" color="text.secondary">
                                #{shipment.id}
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < pendingShipments.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                )}
              </Paper>

              {formData.shipment_ids?.length > 0 && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  {formData.shipment_ids.length} sevkiyat seçildi
                </Typography>
              )}
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
                placeholder="Rota ile ilgili özel notlar..."
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
            disabled={isCreating}
            sx={{ px: 4 }}
          >
            OLUŞTUR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Route Detail Dialog (fullscreen with map) */}
      <RouteDetailDialog
        open={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        route={selectedRoute}
      />
    </Box>
  );
};

export default Routes;
