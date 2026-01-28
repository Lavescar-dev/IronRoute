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
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  PhotoLibrary as PhotoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PhotoGallery from './PhotoGallery';

const PHOTO_TYPES = [
  { value: 'ALL', label: 'Tumu' },
  { value: 'LOADING', label: 'Yukleme' },
  { value: 'IN_TRANSIT', label: 'Yolda' },
  { value: 'DELIVERY', label: 'Teslimat' },
  { value: 'DOCUMENT', label: 'Belge' },
];

const ShipmentPhotosDialog = ({ open, onClose, shipment }) => {
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredPhotos = useMemo(() => {
    if (!shipment?.photos) return [];
    if (typeFilter === 'ALL') return shipment.photos;
    return shipment.photos.filter((p) => p.type === typeFilter);
  }, [shipment, typeFilter]);

  if (!shipment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3, minHeight: '60vh' } }}
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
          <PhotoIcon color="primary" />
          <Box>
            <Typography variant="h6">
              Sevkiyat #{shipment.id} - Fotograflar
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {shipment.origin} → {shipment.destination}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${shipment.photos?.length || 0} Fotograf`}
            color="primary"
            size="small"
          />
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(e, val) => val && setTypeFilter(val)}
            size="small"
          >
            {PHOTO_TYPES.map((type) => (
              <ToggleButton key={type.value} value={type.value}>
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Gallery */}
        <PhotoGallery photos={filteredPhotos} />
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit" size="large">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShipmentPhotosDialog;
