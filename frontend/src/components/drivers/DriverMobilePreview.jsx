import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhoneIphone as PhoneIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Inventory as PackageIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  CameraAlt as CameraIcon,
  Warning as WarningIcon,
  BatteryFull as BatteryIcon,
  SignalCellularAlt as SignalIcon,
  Wifi as WifiIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

const DriverMobilePreview = ({ open, onClose, driver, shipments, routes }) => {
  const [activeTab, setActiveTab] = useState(0);

  const driverData = useMemo(() => {
    if (!driver) return { activeShipments: [], activeRoute: null };

    const activeShipments = shipments.filter(
      (s) =>
        s.status === 'DISPATCHED' &&
        s.plate_number === driver.current_vehicle
    );

    const activeRoute = routes.find(
      (r) =>
        r.status === 'IN_PROGRESS' &&
        r.vehicle_plate === driver.current_vehicle
    );

    return { activeShipments, activeRoute };
  }, [driver, shipments, routes]);

  if (!driver) return null;

  const isBusy = !driver.is_available;
  const currentHour = new Date().getHours();
  const timeStr = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const tabs = [
    { icon: <HomeIcon sx={{ fontSize: 20 }} />, label: 'Ana Sayfa' },
    { icon: <MapIcon sx={{ fontSize: 20 }} />, label: 'Rotam' },
    { icon: <PackageIcon sx={{ fontSize: 20 }} />, label: 'Teslimat' },
    { icon: <PersonIcon sx={{ fontSize: 20 }} />, label: 'Profil' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Phone Frame */}
        <Box
          sx={{
            width: 375,
            height: 740,
            borderRadius: '40px',
            border: '8px solid #1a1a1a',
            bgcolor: '#000',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 0 0 2px #333',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Dynamic Island */}
          <Box
            sx={{
              width: 126,
              height: 36,
              bgcolor: '#000',
              borderRadius: '20px',
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          />

          {/* Status Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              pt: 1.5,
              pb: 0.5,
              color: '#fff',
              fontSize: '12px',
              bgcolor: '#1565C0',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="inherit">
              {timeStr}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SignalIcon sx={{ fontSize: 14 }} />
              <WifiIcon sx={{ fontSize: 14 }} />
              <BatteryIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>

          {/* App Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              bgcolor: '#1565C0',
              color: '#fff',
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              IR
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={700} color="inherit">
                IronRoute
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                {driver.first_name} {driver.last_name}
              </Typography>
            </Box>
          </Box>

          {/* Content Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: '#f5f5f5',
              px: 1.5,
              py: 1,
            }}
          >
            {/* Home Tab */}
            {activeTab === 0 && (
              <>
                {/* Active Task Card */}
                {isBusy && driverData.activeRoute ? (
                  <Paper
                    elevation={2}
                    sx={{ p: 1.5, mb: 1.5, borderRadius: 2, borderLeft: '4px solid #2E7D32' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Aktif Gorev
                      </Typography>
                      <Chip label="Devam Ediyor" size="small" color="success" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {driverData.activeRoute.origin} → {driverData.activeRoute.destination}
                    </Typography>
                    {driverData.activeShipments[0] && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {driverData.activeShipments[0].customer_name}
                      </Typography>
                    )}
                    {driverData.activeShipments[0] && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {driverData.activeShipments[0].weight_kg?.toLocaleString('tr-TR')} kg
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Ilerleme</Typography>
                        <Typography variant="caption" fontWeight={600}>%60</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={60}
                        sx={{ borderRadius: 1, height: 6 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Sonraki durak:
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {driverData.activeRoute.destination}
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
                  <Paper
                    elevation={2}
                    sx={{ p: 2, mb: 1.5, borderRadius: 2, textAlign: 'center' }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Simdilik aktif gorev yok
                    </Typography>
                    <Chip label="Musait" color="success" size="small" />
                  </Paper>
                )}

                {/* Quick Actions */}
                <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                  Hizli Aksiyonlar
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  {[
                    { icon: <CheckIcon />, label: 'Teslimat\nOnayla', color: '#2E7D32' },
                    { icon: <CameraIcon />, label: 'Fotograf\nCek', color: '#1565C0' },
                    { icon: <WarningIcon />, label: 'Sorun\nBildir', color: '#D32F2F' },
                  ].map((action, i) => (
                    <Paper
                      key={i}
                      elevation={1}
                      sx={{
                        flex: 1,
                        p: 1.5,
                        borderRadius: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Box sx={{ color: action.color, mb: 0.5 }}>{action.icon}</Box>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: 'pre-line', lineHeight: 1.2, fontSize: '0.65rem' }}
                      >
                        {action.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                {/* Upcoming Deliveries */}
                <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>
                  Yaklasan Teslimatlar
                </Typography>
                {driverData.activeShipments.length > 0 ? (
                  driverData.activeShipments.map((s, i) => (
                    <Paper
                      key={s.id}
                      elevation={1}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.main',
                          fontSize: 12,
                        }}
                      >
                        {i + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" fontWeight={600}>
                          {s.origin} → {s.destination}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {s.weight_kg?.toLocaleString('tr-TR')} kg
                        </Typography>
                      </Box>
                      <NextIcon fontSize="small" color="action" />
                    </Paper>
                  ))
                ) : (
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Yaklasan teslimat yok
                    </Typography>
                  </Paper>
                )}
              </>
            )}

            {/* Route Tab */}
            {activeTab === 1 && (
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                {driverData.activeRoute ? (
                  <>
                    <MapIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {driverData.activeRoute.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {parseFloat(driverData.activeRoute.total_distance_km).toFixed(0)} km |{' '}
                      {Math.floor(driverData.activeRoute.total_duration_mins / 60)}s{' '}
                      {driverData.activeRoute.total_duration_mins % 60}d
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    {driverData.activeRoute.stops?.map((stop, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 0.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 20,
                            height: 20,
                            fontSize: 10,
                            bgcolor:
                              stop.type === 'ORIGIN'
                                ? 'success.main'
                                : stop.type === 'DESTINATION'
                                ? 'error.main'
                                : 'info.main',
                          }}
                        >
                          {stop.sequence}
                        </Avatar>
                        <Typography variant="caption">
                          {stop.city || stop.shipment_destination}
                        </Typography>
                      </Box>
                    ))}
                  </>
                ) : (
                  <>
                    <MapIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Aktif rota yok
                    </Typography>
                  </>
                )}
              </Paper>
            )}

            {/* Deliveries Tab */}
            {activeTab === 2 && (
              <>
                {driverData.activeShipments.length > 0 ? (
                  driverData.activeShipments.map((s) => (
                    <Paper key={s.id} elevation={2} sx={{ p: 1.5, mb: 1, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600}>
                          #{s.id}
                        </Typography>
                        <Chip label={s.status} size="small" color="info" sx={{ height: 18, fontSize: '0.6rem' }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {s.origin} → {s.destination}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.customer_name} | {s.weight_kg?.toLocaleString('tr-TR')} kg
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <PackageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Aktif teslimat yok
                    </Typography>
                  </Paper>
                )}
              </>
            )}

            {/* Profile Tab */}
            {activeTab === 3 && (
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 1,
                    fontSize: 24,
                  }}
                >
                  {driver.first_name?.charAt(0)}
                  {driver.last_name?.charAt(0)}
                </Avatar>
                <Typography variant="body1" fontWeight={700}>
                  {driver.first_name} {driver.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {driver.phone}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Ehliyet: {driver.license_number}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Chip
                  label={driver.is_available ? 'Musait' : 'Mesgul'}
                  color={driver.is_available ? 'success' : 'warning'}
                  size="small"
                />
                {driver.current_vehicle && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Arac: {driver.current_vehicle}
                  </Typography>
                )}
              </Paper>
            )}
          </Box>

          {/* Bottom Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              py: 0.5,
              px: 1,
              bgcolor: '#fff',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            {tabs.map((tab, i) => (
              <Box
                key={i}
                onClick={() => setActiveTab(i)}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  p: 0.5,
                  color: activeTab === i ? '#1565C0' : '#999',
                  transition: 'color 0.2s',
                }}
              >
                {tab.icon}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: activeTab === i ? 700 : 400,
                    color: 'inherit',
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Home Indicator */}
          <Box sx={{ py: 0.5, bgcolor: '#fff', display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 134,
                height: 5,
                bgcolor: '#1a1a1a',
                borderRadius: 3,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DriverMobilePreview;
