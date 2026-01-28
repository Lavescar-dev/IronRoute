import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Build as BuildIcon,
  Close as CloseIcon,
  LocalShipping as VehicleIcon,
} from '@mui/icons-material';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceTimeline from './MaintenanceTimeline';

const VehicleMaintenanceDialog = ({ open, onClose, vehiclePlate, allRecords, vehicles }) => {
  const vehicleRecords = useMemo(() => {
    if (!vehiclePlate) return [];
    return allRecords.filter((r) => r.vehicle_plate === vehiclePlate);
  }, [vehiclePlate, allRecords]);

  const vehicle = useMemo(() => {
    if (!vehiclePlate || !vehicles) return null;
    return vehicles.find((v) => v.plate_number === vehiclePlate);
  }, [vehiclePlate, vehicles]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}
    >
      <DialogTitle
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BuildIcon color="primary" />
          <Typography variant="h6">Arac Bakim Gecmisi</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Vehicle Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
          }}
        >
          <VehicleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {vehiclePlate || '-'}
            </Typography>
            {vehicle && (
              <Typography variant="body2" color="text.secondary">
                {vehicle.brand} - {vehicle.model_year} |{' '}
                {vehicle.vehicle_type} | Kapasite:{' '}
                {vehicle.capacity_kg?.toLocaleString('tr-TR')} kg
              </Typography>
            )}
          </Box>
          <Chip
            label={`${vehicleRecords.length} Bakim Kaydi`}
            color="primary"
            sx={{ ml: 'auto' }}
          />
        </Box>

        {/* Stats */}
        <MaintenanceStats records={vehicleRecords} />

        <Divider sx={{ my: 2 }} />

        {/* Timeline */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <BuildIcon fontSize="small" color="primary" />
          Bakim Gecmisi
        </Typography>

        {vehicleRecords.length > 0 ? (
          <MaintenanceTimeline records={vehicleRecords} />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            Bu araca ait bakim kaydi bulunamadi.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit" size="large">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleMaintenanceDialog;
