import React from 'react';
import { Box, Typography, Paper, Chip, Tab, Tabs } from '@mui/material';
import {
  Speed as FastIcon,
  Straighten as ShortIcon,
  LocalGasStation as EcoIcon,
} from '@mui/icons-material';

const ROUTE_TYPES = [
  {
    key: 'fastest',
    label: 'En Hizli',
    icon: <FastIcon />,
    color: '#2E7D32',
    description: 'Sure oncelikli',
  },
  {
    key: 'shortest',
    label: 'En Kisa',
    icon: <ShortIcon />,
    color: '#1565C0',
    description: 'Mesafe oncelikli',
  },
  {
    key: 'economic',
    label: 'Ekonomik',
    icon: <EcoIcon />,
    color: '#E65100',
    description: 'Yakit oncelikli',
  },
];

const RouteComparison = ({ alternatives, selectedType, onSelectType }) => {
  if (!alternatives) return null;

  const tabIndex = ROUTE_TYPES.findIndex((t) => t.key === selectedType);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        Alternatif Rotalar
      </Typography>

      <Tabs
        value={tabIndex >= 0 ? tabIndex : 0}
        onChange={(e, v) => onSelectType(ROUTE_TYPES[v].key)}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        {ROUTE_TYPES.map((type) => (
          <Tab
            key={type.key}
            icon={type.icon}
            label={type.label}
            iconPosition="start"
            sx={{
              minHeight: 48,
              fontSize: '0.75rem',
              color: type.color,
              '&.Mui-selected': { color: type.color },
            }}
          />
        ))}
      </Tabs>

      {ROUTE_TYPES.map((type) => {
        const data = alternatives[type.key];
        if (!data || type.key !== selectedType) return null;

        const hours = Math.floor(data.duration / 60);
        const mins = data.duration % 60;

        return (
          <Paper
            key={type.key}
            variant="outlined"
            sx={{
              p: 2,
              borderColor: type.color,
              borderWidth: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Chip
                icon={type.icon}
                label={type.label}
                size="small"
                sx={{ bgcolor: type.color, color: '#fff' }}
              />
              <Typography variant="caption" color="text.secondary">
                {type.description}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color={type.color}>
                  {data.distance}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  km
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color={type.color}>
                  {hours > 0 ? `${hours}s ${mins}d` : `${mins}d`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  sure
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={700} color={type.color}>
                  {data.fuel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  litre
                </Typography>
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default RouteComparison;
