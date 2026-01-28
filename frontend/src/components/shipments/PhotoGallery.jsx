import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Close as CloseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';

const PhotoGallery = ({ photos }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
        Fotograf bulunamadi.
      </Typography>
    );
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[currentIndex];

  const typeColors = {
    LOADING: '#2E7D32',
    IN_TRANSIT: '#1565C0',
    DELIVERY: '#E65100',
    DOCUMENT: '#6A1B9A',
  };

  return (
    <>
      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid key={photo.id} size={{ xs: 6, sm: 4 }}>
            <Box
              onClick={() => openLightbox(index)}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                aspectRatio: '16/9',
                '&:hover .photo-overlay': { opacity: 1 },
                '&:hover img': { transform: 'scale(1.05)' },
              }}
            >
              <Box
                component="img"
                src={photo.thumbnail}
                alt={photo.label}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/200x150/1a1a2e/ffffff?text=${photo.label}`;
                }}
              />
              <Chip
                label={photo.label}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: typeColors[photo.type] || '#555',
                  color: '#fff',
                  fontSize: '0.7rem',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                }}
              >
                <Typography variant="caption" color="white">
                  {new Date(photo.timestamp).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
              <Box
                className="photo-overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
              >
                <Typography variant="caption" color="white" textAlign="center" sx={{ px: 1 }}>
                  {photo.note}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {photo.uploaded_by}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.95)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            m: 0,
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {/* Top bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              zIndex: 2,
              background: 'linear-gradient(rgba(0,0,0,0.7), transparent)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={currentPhoto?.label}
                size="small"
                sx={{
                  bgcolor: typeColors[currentPhoto?.type] || '#555',
                  color: '#fff',
                }}
              />
              <Typography variant="body2" color="white">
                {currentPhoto?.timestamp &&
                  new Date(currentPhoto.timestamp).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </Typography>
              <Typography variant="body2" color="grey.400">
                | {currentPhoto?.uploaded_by}
              </Typography>
            </Box>
            <IconButton onClick={() => setLightboxOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Image */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              minWidth: 600,
            }}
          >
            <Box
              component="img"
              src={currentPhoto?.url}
              alt={currentPhoto?.label}
              sx={{
                maxWidth: '80vw',
                maxHeight: '75vh',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x600/1a1a2e/ffffff?text=${currentPhoto?.label}`;
              }}
            />
          </Box>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <IconButton
                onClick={goPrev}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <PrevIcon />
              </IconButton>
              <IconButton
                onClick={goNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <NextIcon />
              </IconButton>
            </>
          )}

          {/* Bottom bar */}
          {currentPhoto?.note && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              }}
            >
              <Typography variant="body2" color="white">
                {currentPhoto.note}
              </Typography>
              <Typography variant="caption" color="grey.400">
                {currentIndex + 1} / {photos.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
