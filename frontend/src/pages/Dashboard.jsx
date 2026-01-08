/**
 * Dashboard Page
 *
 * Modern dashboard with fleet statistics, charts, and activity feed
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

// Icons
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Components
import FleetMap from '../components/dashboard/FleetMap';

// Redux
import { useGetDashboardStatsQuery, useGetVehiclesQuery, useGetShipmentsQuery, useGetDriversQuery, useGetCustomersQuery } from '../store/api/apiSlice';

// Utils
import { formatCurrency, formatDate, getRelativeTime } from '../utils/helpers';

// ===========================================
// STAT CARD COMPONENT
// ===========================================

const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" height={48} />
        <Skeleton variant="text" width="50%" />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Icon */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          top: -20,
          opacity: 0.1,
          transform: 'rotate(-15deg)',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 120, color } })}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar sx={{ bgcolor: alpha(color, 0.2), width: 40, height: 40 }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
          </Avatar>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" fontWeight={700} sx={{ color, mb: 0.5 }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend && (
            <Chip
              size="small"
              icon={trend === 'up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              label={trendValue}
              color={trend === 'up' ? 'success' : 'error'}
              sx={{ height: 24, fontSize: '0.75rem' }}
            />
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// ===========================================
// PROGRESS CARD COMPONENT
// ===========================================

const ProgressCard = ({ title, value, total, color, icon }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="body2" fontWeight={500}>{title}</Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {value}/{total}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

// ===========================================
// ACTIVITY ITEM COMPONENT
// ===========================================

const ActivityItem = ({ shipment }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircleIcon color="success" />;
      case 'PENDING': return <PendingIcon color="warning" />;
      case 'CANCELLED': return <CancelIcon color="error" />;
      default: return <LocalShippingIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'DISPATCHED': return 'info';
      default: return 'default';
    }
  };

  return (
    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'action.hover' }}>
          {getStatusIcon(shipment.status)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ component: 'div' }}
        secondaryTypographyProps={{ component: 'div' }}
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight={600}>
              {shipment.origin} → {shipment.destination}
            </Typography>
            <Chip
              label={shipment.status}
              size="small"
              color={getStatusColor(shipment.status)}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" component="span">
              {shipment.customer_name} • {formatCurrency(parseFloat(shipment.price) || 0)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
              {getRelativeTime(shipment.created_at)}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

// ===========================================
// DASHBOARD COMPONENT
// ===========================================

const Dashboard = () => {
  const theme = useTheme();

  // RTK Query hooks
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehiclesQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: shipments = [], isLoading: shipmentsLoading } = useGetShipmentsQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: drivers = [], isLoading: driversLoading } = useGetDriversQuery();
  const { data: customers = [], isLoading: customersLoading } = useGetCustomersQuery();

  const isLoading = vehiclesLoading || shipmentsLoading || driversLoading || customersLoading;

  // Calculate statistics
  const stats = React.useMemo(() => {
    // Fleet stats
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'TRANSIT').length;
    const idleVehicles = vehicles.filter((v) => v.status === 'IDLE').length;
    const maintenanceVehicles = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

    // Driver stats
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter((d) => d.is_available).length;

    // Shipment stats
    const totalShipments = shipments.length;
    const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED').length;
    const pendingShipments = shipments.filter((s) => s.status === 'PENDING').length;
    const transitShipments = shipments.filter((s) => s.status === 'DISPATCHED' || s.status === 'TRANSIT').length;

    // Revenue - parse price as float since it comes as string
    const totalRevenue = shipments.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const deliveredRevenue = shipments
      .filter((s) => s.status === 'DELIVERED')
      .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

    // Customer stats
    const totalCustomers = customers.length;

    // Delivery rate
    const deliveryRate = totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0;

    return {
      totalVehicles,
      activeVehicles,
      idleVehicles,
      maintenanceVehicles,
      totalDrivers,
      availableDrivers,
      totalShipments,
      deliveredShipments,
      pendingShipments,
      transitShipments,
      totalRevenue,
      deliveredRevenue,
      totalCustomers,
      deliveryRate,
    };
  }, [vehicles, shipments, drivers, customers]);

  // Recent shipments for activity feed
  const recentShipments = React.useMemo(() => {
    return [...shipments]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [shipments]);

  // Transform vehicles for map
  const mapTrucks = React.useMemo(() => {
    return vehicles.map((v) => ({
      id: v.id,
      plate: v.plate_number,
      status: v.status === 'TRANSIT' ? 'active' : v.status === 'MAINTENANCE' ? 'maintenance' : 'idle',
      cargo: v.vehicle_type || 'N/A',
      lat: v.current_lat || 39.9334 + (Math.random() - 0.5) * 2,
      lng: v.current_lng || 32.8597 + (Math.random() - 0.5) * 4,
    }));
  }, [vehicles]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Filo ve operasyon durumunuza genel bakış
        </Typography>
      </Box>

      {/* Main Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Toplam Gelir"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Tüm sevkiyatlar"
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
            trend="up"
            trendValue="+12%"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Aktif Sevkiyat"
            value={stats.transitShipments}
            subtitle={`${stats.totalShipments} toplam`}
            icon={<InventoryIcon />}
            color={theme.palette.info.main}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Filo Durumu"
            value={`${stats.activeVehicles}/${stats.totalVehicles}`}
            subtitle="Yolda / Toplam"
            icon={<LocalShippingIcon />}
            color={theme.palette.warning.main}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Teslim Oranı"
            value={`%${stats.deliveryRate}`}
            subtitle={`${stats.deliveredShipments} teslim edildi`}
            icon={<CheckCircleIcon />}
            color={theme.palette.primary.main}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Map & Fleet Status */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Fleet Map */}
          <Paper sx={{ p: 0, mb: 3, overflow: 'hidden', borderRadius: 3 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600}>
                Canlı Filo Haritası
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Araçlarınızın anlık konumları
              </Typography>
            </Box>
            <Box sx={{ height: 400 }}>
              {isLoading ? (
                <Skeleton variant="rectangular" height="100%" />
              ) : (
                <FleetMap trucks={mapTrucks} />
              )}
            </Box>
          </Paper>

          {/* Quick Stats */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <LocalShippingIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>{stats.activeVehicles}</Typography>
                <Typography variant="caption" color="text.secondary">Yolda</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>{stats.idleVehicles}</Typography>
                <Typography variant="caption" color="text.secondary">Beklemede</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <BuildIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>{stats.maintenanceVehicles}</Typography>
                <Typography variant="caption" color="text.secondary">Bakımda</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                <Typography variant="h5" fontWeight={700}>{stats.availableDrivers}</Typography>
                <Typography variant="caption" color="text.secondary">Müsait Sürücü</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Stats & Activity */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Fleet Overview */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Filo Durumu
            </Typography>
            <ProgressCard
              title="Yolda"
              value={stats.activeVehicles}
              total={stats.totalVehicles}
              color={theme.palette.success.main}
              icon={<LocalShippingIcon sx={{ fontSize: 18, color: 'success.main' }} />}
            />
            <ProgressCard
              title="Beklemede"
              value={stats.idleVehicles}
              total={stats.totalVehicles}
              color={theme.palette.warning.main}
              icon={<AccessTimeIcon sx={{ fontSize: 18, color: 'warning.main' }} />}
            />
            <ProgressCard
              title="Bakımda"
              value={stats.maintenanceVehicles}
              total={stats.totalVehicles}
              color={theme.palette.error.main}
              icon={<BuildIcon sx={{ fontSize: 18, color: 'error.main' }} />}
            />
          </Paper>

          {/* Quick Numbers */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Özet Bilgiler
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">Müşteriler</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>{stats.totalCustomers}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2">Sürücüler</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>{stats.totalDrivers}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PendingIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                <Typography variant="body2">Bekleyen Sevkiyat</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>{stats.pendingShipments}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2">Tamamlanan Gelir</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {formatCurrency(stats.deliveredRevenue)}
              </Typography>
            </Box>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Son Aktiviteler
            </Typography>
            {isLoading ? (
              <>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={60} />
              </>
            ) : recentShipments.length > 0 ? (
              <List sx={{ p: 0 }}>
                {recentShipments.map((shipment, index) => (
                  <React.Fragment key={shipment.id}>
                    <ActivityItem shipment={shipment} />
                    {index < recentShipments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Henüz aktivite yok
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
