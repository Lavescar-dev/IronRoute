import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Close as CloseIcon,
  LocalShipping as VehicleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Inventory as CargoIcon,
  Route as RouteIcon,
  Build as BuildIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import VehicleLocationMap from './VehicleLocationMap';
import VehicleMaintenanceDialog from '../maintenance/VehicleMaintenanceDialog';
import { formatCurrency } from '../../utils/helpers';

const statusMap = {
  TRANSIT: { label: 'Yolda', color: 'success' },
  IDLE: { label: 'Beklemede', color: 'warning' },
  MAINTENANCE: { label: 'Bakimda', color: 'error' },
};

const InfoCard = ({ title, icon, children, action }) => (
  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={600}>{title}</Typography>
      </Box>
      {action}
    </Box>
    {children}
  </Paper>
);

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value || '-'}</Typography>
  </Box>
);

const VehicleDetailDialog = ({
  open,
  onClose,
  vehicleId,
  vehicles,
  drivers,
  shipments,
  routes,
  maintenanceRecords,
}) => {
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);

  const vehicle = useMemo(() => {
    if (!vehicleId) return null;
    return vehicles?.find((v) => v.id === vehicleId) || null;
  }, [vehicleId, vehicles]);

  const driver = useMemo(() => {
    if (!vehicle) return null;
    return drivers?.find((d) => d.current_vehicle === vehicle.plate_number) || null;
  }, [vehicle, drivers]);

  const activeShipments = useMemo(() => {
    if (!vehicleId) return [];
    return (shipments || []).filter(
      (s) => s.vehicle_id === vehicleId && s.status === 'DISPATCHED'
    );
  }, [vehicleId, shipments]);

  const activeRoute = useMemo(() => {
    if (!vehicleId) return null;
    return (routes || []).find(
      (r) => r.vehicle_id === vehicleId && r.status === 'IN_PROGRESS'
    ) || null;
  }, [vehicleId, routes]);

  const vehicleMaintenance = useMemo(() => {
    if (!vehicleId) return [];
    return (maintenanceRecords || []).filter((m) => m.vehicle_id === vehicleId);
  }, [vehicleId, maintenanceRecords]);

  const maintenanceSummary = useMemo(() => {
    const completed = vehicleMaintenance.filter((m) => m.status === 'COMPLETED');
    const totalCost = completed.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    const lastCompleted = completed
      .sort((a, b) => new Date(b.completed_date || 0) - new Date(a.completed_date || 0))[0];
    const nextScheduled = vehicleMaintenance
      .filter((m) => m.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))[0];
    return { totalCost, count: completed.length, lastCompleted, nextScheduled };
  }, [vehicleMaintenance]);

  if (!vehicle) return null;

  const status = statusMap[vehicle.status] || statusMap.IDLE;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VehicleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {vehicle.plate_number}
                  </Typography>
                  <Chip label={status.label} color={status.color} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {vehicle.brand} - {vehicle.model_year} | {vehicle.vehicle_type} | {vehicle.capacity_kg?.toLocaleString('tr-TR')} kg
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column - Info Cards */}
            <Grid size={{ xs: 12, md: 5 }}>
              {/* Driver Card */}
              <InfoCard
                title="Surucu"
                icon={<PersonIcon fontSize="small" color="primary" />}
              >
                {driver ? (
                  <>
                    <InfoRow label="Ad Soyad" value={`${driver.first_name} ${driver.last_name}`} />
                    <InfoRow
                      label="Telefon"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 14 }} />
                          {driver.phone}
                        </Box>
                      }
                    />
                    <InfoRow
                      label="Ehliyet"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BadgeIcon sx={{ fontSize: 14 }} />
                          {driver.license_number}
                        </Box>
                      }
                    />
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    Surucu atanmamis
                  </Typography>
                )}
              </InfoCard>

              {/* Active Shipment Card */}
              <InfoCard
                title="Aktif Sevkiyat"
                icon={<CargoIcon fontSize="small" color="info" />}
              >
                {activeShipments.length > 0 ? (
                  activeShipments.map((shipment) => (
                    <Box key={shipment.id} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        <Typography variant="body2" fontWeight={600}>
                          {shipment.origin} → {shipment.destination}
                        </Typography>
                      </Box>
                      <InfoRow label="Musteri" value={shipment.customer_name} />
                      <InfoRow label="Agirlik" value={`${(shipment.weight_kg || 0).toLocaleString('tr-TR')} kg`} />
                      <InfoRow label="Ucret" value={formatCurrency(parseFloat(shipment.price) || 0)} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    Aktif sevkiyat yok
                  </Typography>
                )}
              </InfoCard>

              {/* Active Route Card */}
              <InfoCard
                title="Aktif Rota"
                icon={<RouteIcon fontSize="small" color="success" />}
              >
                {activeRoute ? (
                  <>
                    <InfoRow label="Rota" value={activeRoute.name} />
                    <InfoRow
                      label="Mesafe"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SpeedIcon sx={{ fontSize: 14 }} />
                          {parseFloat(activeRoute.total_distance_km).toLocaleString('tr-TR')} km
                        </Box>
                      }
                    />
                    <InfoRow label="Sure" value={`${Math.round(activeRoute.total_duration_mins / 60)} saat ${activeRoute.total_duration_mins % 60} dk`} />
                    <InfoRow label="Durak Sayisi" value={activeRoute.stops_count} />
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    Aktif rota yok
                  </Typography>
                )}
              </InfoCard>

              {/* Maintenance Summary Card */}
              <InfoCard
                title="Bakim Ozeti"
                icon={<BuildIcon fontSize="small" color="warning" />}
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setMaintenanceDialogOpen(true)}
                  >
                    Tam Gecmisi Gor
                  </Button>
                }
              >
                <InfoRow label="Toplam Bakim" value={maintenanceSummary.count} />
                <InfoRow
                  label="Toplam Maliyet"
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      {formatCurrency(maintenanceSummary.totalCost)}
                    </Box>
                  }
                />
                <InfoRow
                  label="Son Bakim"
                  value={
                    maintenanceSummary.lastCompleted
                      ? new Date(maintenanceSummary.lastCompleted.completed_date).toLocaleDateString('tr-TR')
                      : '-'
                  }
                />
                <InfoRow
                  label="Sonraki Planlanan"
                  value={
                    maintenanceSummary.nextScheduled
                      ? new Date(maintenanceSummary.nextScheduled.scheduled_date).toLocaleDateString('tr-TR')
                      : '-'
                  }
                />
              </InfoCard>
            </Grid>

            {/* Right Column - Mini Map */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper variant="outlined" sx={{ height: '100%', minHeight: 450, overflow: 'hidden', borderRadius: 2 }}>
                <VehicleLocationMap vehicle={vehicle} route={activeRoute} />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} color="inherit" size="large">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance History Dialog */}
      <VehicleMaintenanceDialog
        open={maintenanceDialogOpen}
        onClose={() => setMaintenanceDialogOpen(false)}
        vehiclePlate={vehicle?.plate_number}
        allRecords={maintenanceRecords || []}
        vehicles={vehicles}
      />
    </>
  );
};

export default VehicleDetailDialog;
