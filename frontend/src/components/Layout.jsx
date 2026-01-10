/**
 * Layout Component
 *
 * Main application layout with sidebar navigation and header
 */

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalShipping as VehicleIcon,
  People as DriversIcon,
  Inventory as ShipmentsIcon,
  Business as CustomersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Receipt as InvoiceIcon,
  Route as RouteIcon,
  Build as MaintenanceIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { logout, selectUser } from '../store/slices/authSlice';
import {
  selectSidebarCollapsed,
  toggleSidebar,
} from '../store/slices/uiSlice';
import ThemeToggle from './common/ThemeToggle';
import config from '../config';

// ===========================================
// CONSTANTS
// ===========================================

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

// Menu items
const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Araçlar',
    icon: <VehicleIcon />,
    path: '/vehicles',
  },
  {
    text: 'Sürücüler',
    icon: <DriversIcon />,
    path: '/drivers',
  },
  {
    text: 'Sevkiyatlar',
    icon: <ShipmentsIcon />,
    path: '/shipments',
  },
  {
    text: 'Rotalar',
    icon: <RouteIcon />,
    path: '/routes',
  },
  {
    text: 'Müşteriler',
    icon: <CustomersIcon />,
    path: '/customers',
  },
  {
    text: 'Faturalar',
    icon: <InvoiceIcon />,
    path: '/invoices',
  },
  {
    text: 'Bakım',
    icon: <MaintenanceIcon />,
    path: '/maintenance',
  },
  {
    text: 'Raporlar',
    icon: <ReportsIcon />,
    path: '/reports',
  },
];

const bottomMenuItems = [
  {
    text: 'Ayarlar',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

// ===========================================
// LAYOUT COMPONENT
// ===========================================

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector(selectUser);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);

  // User menu state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userMenuOpen = Boolean(anchorEl);

  // Handlers
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {/* Menu Toggle */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleToggleSidebar}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: 1,
            }}
          >
            {config.app.name}
          </Typography>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <Tooltip title="Hesap">
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.9rem',
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.username || 'Kullanıcı'}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Ayarlar
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            py: 2,
          }}
        >
          {/* Main Menu */}
          <List sx={{ flexGrow: 1, px: 1 }}>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right">
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 48,
                        justifyContent: sidebarCollapsed ? 'center' : 'initial',
                        px: 2.5,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.18),
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarCollapsed ? 0 : 2,
                          justifyContent: 'center',
                          color: isSelected ? 'primary.main' : 'text.secondary',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!sidebarCollapsed && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? 'primary.main' : 'text.primary',
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ mx: 2 }} />

          {/* Bottom Menu */}
          <List sx={{ px: 1, pt: 1 }}>
            {bottomMenuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right">
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 48,
                        justifyContent: sidebarCollapsed ? 'center' : 'initial',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarCollapsed ? 0 : 2,
                          justifyContent: 'center',
                          color: isSelected ? 'primary.main' : 'text.secondary',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!sidebarCollapsed && (
                        <ListItemText primary={item.text} />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
