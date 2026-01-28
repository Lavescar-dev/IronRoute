import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';

const StatCard = ({ icon, label, value, color }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      textAlign: 'center',
      borderColor: `${color}.main`,
      borderWidth: 2,
    }}
  >
    <Box sx={{ color: `${color}.main`, mb: 0.5 }}>{icon}</Box>
    <Typography variant="h6" fontWeight={700} color={`${color}.main`}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const MaintenanceStats = ({ records }) => {
  const totalCost = records.reduce(
    (sum, r) => sum + (parseFloat(r.cost) || 0),
    0
  );
  const totalCount = records.length;

  const oilRecords = records.filter(
    (r) => r.maintenance_type === 'OIL' && r.odometer_reading && r.next_service_km
  );
  const avgOilInterval =
    oilRecords.length > 0
      ? Math.round(
          oilRecords.reduce(
            (sum, r) => sum + (r.next_service_km - r.odometer_reading),
            0
          ) / oilRecords.length
        )
      : 0;

  const scheduled = records
    .filter((r) => r.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  const nextMaintenance = scheduled[0];
  const nextDate = nextMaintenance
    ? new Date(nextMaintenance.scheduled_date).toLocaleDateString('tr-TR')
    : '-';

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          icon={<MoneyIcon />}
          label="Toplam Bakim Maliyeti"
          value={formatCurrency(totalCost)}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          icon={<BuildIcon />}
          label="Toplam Bakim Sayisi"
          value={totalCount}
          color="info"
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          icon={<SpeedIcon />}
          label="Ort. Yag Degisim Araligi"
          value={avgOilInterval > 0 ? `${avgOilInterval.toLocaleString('tr-TR')} km` : '-'}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          icon={<EventIcon />}
          label="Sonraki Planli Bakim"
          value={nextDate}
          color="success"
        />
      </Grid>
    </Grid>
  );
};

export default MaintenanceStats;
