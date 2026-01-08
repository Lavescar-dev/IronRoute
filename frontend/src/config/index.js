/**
 * Application Configuration
 *
 * Centralized configuration management using environment variables
 */

const config = {
  // ===========================================
  // API Configuration
  // ===========================================
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    timeout: 30000,
  },

  // ===========================================
  // Application Info
  // ===========================================
  app: {
    name: import.meta.env.VITE_APP_NAME || 'IronRoute',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },

  // ===========================================
  // Feature Flags
  // ===========================================
  features: {
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // ===========================================
  // Map Configuration
  // ===========================================
  map: {
    defaultCenter: {
      lat: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || 39.9334,
      lng: parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 32.8597,
    },
    defaultZoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 6,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  // ===========================================
  // UI Configuration
  // ===========================================
  ui: {
    sidebarWidth: 260,
    sidebarCollapsedWidth: 72,
    headerHeight: 64,
    notificationDuration: 5000,
    tablePageSizes: [10, 20, 50, 100],
    defaultPageSize: 20,
  },

  // ===========================================
  // Vehicle Configuration
  // ===========================================
  vehicles: {
    types: [
      { value: 'TRUCK', label: 'Kamyon' },
      { value: 'LORRY', label: 'Tır' },
      { value: 'VAN', label: 'Kamyonet' },
      { value: 'PICKUP', label: 'Pikap' },
    ],
    statuses: [
      { value: 'IDLE', label: 'Boşta', color: 'success' },
      { value: 'TRANSIT', label: 'Yolda', color: 'primary' },
      { value: 'MAINTENANCE', label: 'Bakımda', color: 'warning' },
    ],
    brands: [
      'Mercedes-Benz',
      'Scania',
      'Volvo',
      'MAN',
      'DAF',
      'Iveco',
      'Renault',
      'Ford',
      'BMC',
      'Isuzu',
    ],
  },

  // ===========================================
  // Shipment Configuration
  // ===========================================
  shipments: {
    statuses: [
      { value: 'PENDING', label: 'Beklemede', color: 'warning' },
      { value: 'DISPATCHED', label: 'Yola Çıktı', color: 'info' },
      { value: 'DELIVERED', label: 'Teslim Edildi', color: 'success' },
      { value: 'CANCELLED', label: 'İptal Edildi', color: 'error' },
    ],
  },

  // ===========================================
  // Driver Configuration
  // ===========================================
  drivers: {
    licenseTypes: [
      { value: 'B', label: 'B Sınıfı' },
      { value: 'C', label: 'C Sınıfı' },
      { value: 'CE', label: 'CE Sınıfı' },
      { value: 'D', label: 'D Sınıfı' },
    ],
  },
};

export default config;

// Named exports for convenience
export const { api, app, features, map, ui, vehicles, shipments, drivers } = config;
