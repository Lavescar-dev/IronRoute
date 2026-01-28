import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Chip,
  Paper,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Route as RouteIcon,
  LocalShipping as VehicleIcon,
  Person as DriverIcon,
  Straighten as DistanceIcon,
  Schedule as TimeIcon,
  LocalGasStation as FuelIcon,
} from '@mui/icons-material';
import RouteMap from './RouteMap';
import RouteStopTimeline from './RouteStopTimeline';
import RouteComparison from './RouteComparison';

const STATUS_CONFIG = {
  IN_PROGRESS: { color: 'info', label: 'Devam Ediyor' },
  COMPLETED: { color: 'success', label: 'Tamamlandi' },
  PLANNED: { color: 'warning', label: 'Planlandi' },
  CANCELLED: { color: 'default', label: 'Iptal' },
};

const InfoCard = ({ icon, label, value, color = 'primary' }) => (
  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', flex: 1 }}>
    <Box sx={{ color: `${color}.main`, mb: 0.5 }}>{icon}</Box>
    <Typography variant="body2" fontWeight={700}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const RouteDetailDialog = ({ open, onClose, route }) => {
  const [selectedAlternative, setSelectedAlternative] = useState('fastest');

  if (!route) return null;

  const statusConf = STATUS_CONFIG[route.status] || STATUS_CONFIG.PLANNED;
  const hours = Math.floor((route.total_duration_mins || 0) / 60);
  const mins = (route.total_duration_mins || 0) % 60;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { bgcolor: 'background.default' } }}
    >
      {/* App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <RouteIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6" sx={{ flexGrow: 1 }} fontWeight={600}>
            {route.name}
          </Typography>
          <Chip
            label={statusConf.label}
            color={statusConf.color}
            size="small"
            sx={{ mr: 2 }}
          />
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left Panel */}
        <Box
          sx={{
            width: 370,
            minWidth: 370,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'auto',
            p: 2,
          }}
        >
          {/* Vehicle & Driver */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <VehicleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {route.vehicle_plate || 'Arac atanmadi'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DriverIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {route.driver_name || 'Surucu atanmadi'}
              </Typography>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <InfoCard
              icon={<DistanceIcon fontSize="small" />}
              label="Mesafe"
              value={`${parseFloat(route.total_distance_km || 0).toFixed(0)} km`}
              color="primary"
            />
            <InfoCard
              icon={<TimeIcon fontSize="small" />}
              label="Sure"
              value={hours > 0 ? `${hours}s ${mins}d` : `${mins}d`}
              color="info"
            />
            <InfoCard
              icon={<FuelIcon fontSize="small" />}
              label="Yakit"
              value={`${route.estimated_fuel_liters || '?'} L`}
              color="warning"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Stop Timeline */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Duraklar
          </Typography>
          <RouteStopTimeline stops={route.stops} />

          <Divider sx={{ my: 2 }} />

          {/* Route Comparison */}
          {route.alternatives && (
            <RouteComparison
              alternatives={route.alternatives}
              selectedType={selectedAlternative}
              onSelectType={setSelectedAlternative}
            />
          )}
        </Box>

        {/* Right Panel - Map */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <RouteMap route={route} selectedAlternative={selectedAlternative} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetailDialog;
