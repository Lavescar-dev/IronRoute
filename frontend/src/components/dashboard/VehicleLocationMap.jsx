import React from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const truckIcon = L.divIcon({
  className: 'vehicle-detail-icon',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#1976D2" stroke="#fff" stroke-width="2"/>
    <path d="M10 12h8v6h4v4h-2a2 2 0 01-4 0h-4a2 2 0 01-4 0H8v-2h2v-8z" fill="#fff"/>
    <rect x="18" y="14" width="4" height="4" rx="1" fill="#90CAF9"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const VehicleLocationMap = ({ vehicle, route }) => {
  const lat = vehicle?.current_lat || 39.9334;
  const lng = vehicle?.current_lng || 32.8597;

  // Build polyline from route stops if available
  const routePositions = React.useMemo(() => {
    if (!route || !route.stops || route.stops.length < 2) return [];
    // Use city coordinates approximation for visualization
    const cityCoords = {
      Istanbul: [41.0082, 28.9784],
      Ankara: [39.9334, 32.8597],
      Izmir: [38.4237, 27.1428],
      Bursa: [40.1885, 29.0610],
      Antalya: [36.8969, 30.7133],
      Mersin: [36.8121, 34.6415],
      Gaziantep: [37.0662, 37.3833],
      Trabzon: [41.0027, 39.7168],
      Konya: [37.8746, 32.4932],
      Adana: [37.0, 35.3213],
      Eskisehir: [39.7767, 30.5206],
      Samsun: [41.2867, 36.33],
      Kayseri: [38.7312, 35.4787],
      Diyarbakir: [37.9144, 40.2306],
      Bolu: [40.7317, 31.6061],
      Nigde: [37.9667, 34.6833],
      Mugla: [37.2153, 28.3636],
    };
    return route.stops
      .map((stop) => cityCoords[stop.city])
      .filter(Boolean);
  }, [route]);

  return (
    <Box sx={{ height: '100%', minHeight: 300, borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={route ? 6 : 10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[lat, lng]} icon={truckIcon}>
          <Popup>
            <strong>{vehicle?.plate_number}</strong>
          </Popup>
        </Marker>
        {routePositions.length >= 2 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#1976D2', weight: 3, dashArray: '8 4' }}
          />
        )}
      </MapContainer>
    </Box>
  );
};

export default VehicleLocationMap;
