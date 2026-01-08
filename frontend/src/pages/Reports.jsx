/**
 * Reports Page
 *
 * Analytics and reporting dashboard
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Skeleton,
  MenuItem,
  TextField,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Assessment as ReportsIcon,
  TrendingUp as RevenueIcon,
  LocalShipping as VehicleIcon,
  Inventory as ShipmentIcon,
  People as DriversIcon,
  Business as CustomersIcon,
  FileDownload as ExportIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

// Redux
import {
  useGetDashboardStatsQuery,
  useGetVehiclesQuery,
  useGetDriversQuery,
  useGetShipmentsQuery,
  useGetCustomersQuery,
} from '../store/api/apiSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';

// Utils
import { formatCurrency, formatNumber } from '../utils/helpers';
import {
  exportVehicles,
  exportDrivers,
  exportShipments,
  exportToExcel,
  exportToPDF,
} from '../utils/exportUtils';

// ===========================================
// STAT CARD COMPONENT
// ===========================================

const StatCard = ({ title, value, subtitle, icon, color, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      {loading ? (
        <>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="50%" />
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);

// ===========================================
// REPORTS COMPONENT
// ===========================================

const Reports = () => {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState('month');

  // RTK Query hooks
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehiclesQuery();
  const { data: drivers = [], isLoading: driversLoading } = useGetDriversQuery();
  const { data: shipments = [], isLoading: shipmentsLoading } = useGetShipmentsQuery();
  const { data: customers = [], isLoading: customersLoading } = useGetCustomersQuery();

  const isLoading = statsLoading || vehiclesLoading || driversLoading || shipmentsLoading || customersLoading;

  // Calculate statistics
  const statistics = React.useMemo(() => {
    // Fleet stats
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'TRANSIT').length;
    const idleVehicles = vehicles.filter((v) => v.status === 'IDLE').length;
    const maintenanceVehicles = vehicles.filter((v) => v.status === 'MAINTENANCE').length;
    const totalCapacity = vehicles.reduce((sum, v) => sum + (v.capacity_kg || 0), 0);

    // Driver stats
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter((d) => d.is_available).length;

    // Shipment stats
    const totalShipments = shipments.length;
    const pendingShipments = shipments.filter((s) => s.status === 'PENDING').length;
    const dispatchedShipments = shipments.filter((s) => s.status === 'DISPATCHED').length;
    const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED').length;
    const cancelledShipments = shipments.filter((s) => s.status === 'CANCELLED').length;
    const totalRevenue = shipments.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const deliveredRevenue = shipments
      .filter((s) => s.status === 'DELIVERED')
      .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);

    // Customer stats
    const totalCustomers = customers.length;

    // Performance metrics
    const deliveryRate = totalShipments > 0 ? ((deliveredShipments / totalShipments) * 100).toFixed(1) : 0;
    const fleetUtilization = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : 0;
    const driverUtilization = totalDrivers > 0 ? (((totalDrivers - availableDrivers) / totalDrivers) * 100).toFixed(1) : 0;

    return {
      fleet: {
        total: totalVehicles,
        active: activeVehicles,
        idle: idleVehicles,
        maintenance: maintenanceVehicles,
        capacity: totalCapacity,
        utilization: fleetUtilization,
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        utilization: driverUtilization,
      },
      shipments: {
        total: totalShipments,
        pending: pendingShipments,
        dispatched: dispatchedShipments,
        delivered: deliveredShipments,
        cancelled: cancelledShipments,
        deliveryRate,
      },
      revenue: {
        total: totalRevenue,
        delivered: deliveredRevenue,
      },
      customers: {
        total: totalCustomers,
      },
    };
  }, [vehicles, drivers, shipments, customers]);

  // Export handlers
  const handleExportFleet = (format) => {
    try {
      exportVehicles(vehicles, format);
      dispatch(showSuccess(`Filo raporu indirildi (${format.toUpperCase()})`));
    } catch (err) {
      dispatch(showError('Dışa aktarma başarısız'));
    }
  };

  const handleExportDrivers = (format) => {
    try {
      exportDrivers(drivers, format);
      dispatch(showSuccess(`Sürücü raporu indirildi (${format.toUpperCase()})`));
    } catch (err) {
      dispatch(showError('Dışa aktarma başarısız'));
    }
  };

  const handleExportShipments = (format) => {
    try {
      exportShipments(shipments, format);
      dispatch(showSuccess(`Sevkiyat raporu indirildi (${format.toUpperCase()})`));
    } catch (err) {
      dispatch(showError('Dışa aktarma başarısız'));
    }
  };

  const handleExportSummary = () => {
    try {
      const summaryData = [
        { Metrik: 'Toplam Araç', Deger: statistics.fleet.total },
        { Metrik: 'Aktif Araç', Deger: statistics.fleet.active },
        { Metrik: 'Filo Kullanım Oranı', Deger: `%${statistics.fleet.utilization}` },
        { Metrik: 'Toplam Sürücü', Deger: statistics.drivers.total },
        { Metrik: 'Müsait Sürücü', Deger: statistics.drivers.available },
        { Metrik: 'Toplam Sevkiyat', Deger: statistics.shipments.total },
        { Metrik: 'Teslim Edilen', Deger: statistics.shipments.delivered },
        { Metrik: 'Teslim Oranı', Deger: `%${statistics.shipments.deliveryRate}` },
        { Metrik: 'Toplam Gelir', Deger: formatCurrency(statistics.revenue.total) },
        { Metrik: 'Toplam Müşteri', Deger: statistics.customers.total },
      ];

      const columns = [
        { header: 'Metrik', key: 'Metrik', width: 25 },
        { header: 'Deger', key: 'Deger', width: 20 },
      ];

      exportToPDF(
        summaryData,
        `ozet_rapor_${new Date().toISOString().split('T')[0]}`,
        'Genel Özet Raporu',
        columns
      );
      dispatch(showSuccess('Özet rapor indirildi'));
    } catch (err) {
      dispatch(showError('Dışa aktarma başarısız'));
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
        >
          <ReportsIcon fontSize="large" color="primary" />
          Raporlar ve Analiz
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          >
            <MenuItem value="week">Bu Hafta</MenuItem>
            <MenuItem value="month">Bu Ay</MenuItem>
            <MenuItem value="quarter">Bu Çeyrek</MenuItem>
            <MenuItem value="year">Bu Yıl</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            onClick={handleExportSummary}
          >
            Özet Rapor
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Toplam Gelir"
            value={formatCurrency(statistics.revenue.total)}
            subtitle="Tüm sevkiyatlar"
            icon={<RevenueIcon />}
            color="#2e7d32"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Toplam Sevkiyat"
            value={statistics.shipments.total}
            subtitle={`%${statistics.shipments.deliveryRate} teslim`}
            icon={<ShipmentIcon />}
            color="#1976d2"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Filo Durumu"
            value={`${statistics.fleet.active}/${statistics.fleet.total}`}
            subtitle={`%${statistics.fleet.utilization} kullanım`}
            icon={<VehicleIcon />}
            color="#ed6c02"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Sürücüler"
            value={`${statistics.drivers.available}/${statistics.drivers.total}`}
            subtitle="Müsait"
            icon={<DriversIcon />}
            color="#9c27b0"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Müşteriler"
            value={statistics.customers.total}
            subtitle="Aktif"
            icon={<CustomersIcon />}
            color="#00796b"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            title="Kapasite"
            value={formatNumber(statistics.fleet.capacity)}
            subtitle="kg toplam"
            icon={<VehicleIcon />}
            color="#d32f2f"
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Report Sections */}
      <Grid container spacing={3}>
        {/* Fleet Report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Filo Raporu
              </Typography>
              <Box>
                <Button size="small" onClick={() => handleExportFleet('excel')}>
                  Excel
                </Button>
                <Button size="small" onClick={() => handleExportFleet('pdf')}>
                  PDF
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Toplam Araç</Typography>
                  <Typography fontWeight={600}>{statistics.fleet.total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Aktif (Yolda)</Typography>
                  <Typography fontWeight={600} color="success.main">
                    {statistics.fleet.active}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Boşta</Typography>
                  <Typography fontWeight={600} color="warning.main">
                    {statistics.fleet.idle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Bakımda</Typography>
                  <Typography fontWeight={600} color="error.main">
                    {statistics.fleet.maintenance}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Kullanım Oranı</Typography>
                  <Typography fontWeight={600}>%{statistics.fleet.utilization}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Shipment Report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Sevkiyat Raporu
              </Typography>
              <Box>
                <Button size="small" onClick={() => handleExportShipments('excel')}>
                  Excel
                </Button>
                <Button size="small" onClick={() => handleExportShipments('pdf')}>
                  PDF
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Toplam Sevkiyat</Typography>
                  <Typography fontWeight={600}>{statistics.shipments.total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Beklemede</Typography>
                  <Typography fontWeight={600} color="warning.main">
                    {statistics.shipments.pending}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Yolda</Typography>
                  <Typography fontWeight={600} color="info.main">
                    {statistics.shipments.dispatched}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Teslim Edildi</Typography>
                  <Typography fontWeight={600} color="success.main">
                    {statistics.shipments.delivered}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">İptal</Typography>
                  <Typography fontWeight={600} color="error.main">
                    {statistics.shipments.cancelled}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Teslim Oranı</Typography>
                  <Typography fontWeight={600}>%{statistics.shipments.deliveryRate}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Driver Report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Sürücü Raporu
              </Typography>
              <Box>
                <Button size="small" onClick={() => handleExportDrivers('excel')}>
                  Excel
                </Button>
                <Button size="small" onClick={() => handleExportDrivers('pdf')}>
                  PDF
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Toplam Sürücü</Typography>
                  <Typography fontWeight={600}>{statistics.drivers.total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Müsait</Typography>
                  <Typography fontWeight={600} color="success.main">
                    {statistics.drivers.available}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Görevde</Typography>
                  <Typography fontWeight={600} color="warning.main">
                    {statistics.drivers.total - statistics.drivers.available}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Kullanım Oranı</Typography>
                  <Typography fontWeight={600}>%{statistics.drivers.utilization}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Revenue Report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Gelir Raporu
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Toplam Gelir</Typography>
                  <Typography fontWeight={600} color="success.main">
                    {formatCurrency(statistics.revenue.total)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Tamamlanan Sevkiyatlar</Typography>
                  <Typography fontWeight={600}>
                    {formatCurrency(statistics.revenue.delivered)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Bekleyen Ödemeler</Typography>
                  <Typography fontWeight={600} color="warning.main">
                    {formatCurrency(statistics.revenue.total - statistics.revenue.delivered)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Ortalama Sevkiyat Ücreti</Typography>
                  <Typography fontWeight={600}>
                    {statistics.shipments.total > 0
                      ? formatCurrency(statistics.revenue.total / statistics.shipments.total)
                      : formatCurrency(0)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
