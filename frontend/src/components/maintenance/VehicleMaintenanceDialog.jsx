import React, { useMemo, useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Build as BuildIcon,
  Close as CloseIcon,
  LocalShipping as VehicleIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { useLazyGetArchivedMaintenanceQuery } from '../../store/api/apiSlice';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceTimeline from './MaintenanceTimeline';

const VehicleMaintenanceDialog = ({ open, onClose, vehiclePlate, allRecords, vehicles }) => {
  const [archiveRecords, setArchiveRecords] = useState([]);
  const [archiveLoaded, setArchiveLoaded] = useState(false);
  const [triggerArchive, { isFetching: archiveLoading }] = useLazyGetArchivedMaintenanceQuery();

  const vehicleRecords = useMemo(() => {
    if (!vehiclePlate) return [];
    return allRecords.filter((r) => r.vehicle_plate === vehiclePlate);
  }, [vehiclePlate, allRecords]);

  const vehicle = useMemo(() => {
    if (!vehiclePlate || !vehicles) return null;
    return vehicles.find((v) => v.plate_number === vehiclePlate);
  }, [vehiclePlate, vehicles]);

  const allCombinedRecords = useMemo(() => {
    return [...vehicleRecords, ...archiveRecords];
  }, [vehicleRecords, archiveRecords]);

  // Reset archive state when dialog closes
  useEffect(() => {
    if (!open) {
      setArchiveRecords([]);
      setArchiveLoaded(false);
    }
  }, [open]);

  const handleLoadArchive = async () => {
    if (!vehicle) return;
    const result = await triggerArchive(vehicle.id);
    if (result.data) {
      setArchiveRecords(result.data);
      setArchiveLoaded(true);
    }
  };

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
            label={`${allCombinedRecords.length} Bakim Kaydi`}
            color="primary"
            sx={{ ml: 'auto' }}
          />
        </Box>

        {/* Stats */}
        <MaintenanceStats records={allCombinedRecords} showLifetimeLabel={archiveLoaded} />

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

        {/* Archive Section */}
        {!archiveLoaded && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Button
              variant="outlined"
              startIcon={archiveLoading ? <CircularProgress size={18} /> : <ArchiveIcon />}
              onClick={handleLoadArchive}
              disabled={archiveLoading}
              sx={{ borderStyle: 'dashed' }}
            >
              {archiveLoading ? 'Arsivden Yukleniyor...' : 'Arsivden Yukle (2017-2024)'}
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              Cold storage - ilk yuklemede gecikme olabilir
            </Typography>
          </Box>
        )}

        {archiveLoaded && archiveRecords.length > 0 && (
          <>
            <Divider sx={{ my: 3 }}>
              <Chip
                icon={<ArchiveIcon />}
                label={`Arsiv Gecmisi (${archiveRecords.length} kayit)`}
                variant="outlined"
                color="default"
              />
            </Divider>
            <MaintenanceTimeline records={archiveRecords} isArchive />
          </>
        )}

        {archiveLoaded && archiveRecords.length === 0 && (
          <>
            <Divider sx={{ my: 3 }}>
              <Chip icon={<ArchiveIcon />} label="Arsiv Gecmisi" variant="outlined" color="default" />
            </Divider>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ py: 2 }}
            >
              Bu araca ait arsiv kaydi bulunamadi.
            </Typography>
          </>
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
