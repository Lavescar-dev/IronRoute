import React from 'react';
import { Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Leaflet kütüphanesi şart!

// --- 3D TRUCK ICON ENGINE ---
const createTruckIcon = (status) => {
  let color = '#757575';
  let lighterColor = '#9E9E9E';
  let darkerColor = '#555555';
  if (status === 'active') { color = '#2e7d32'; lighterColor = '#4CAF50'; darkerColor = '#1B5E20'; }
  if (status === 'idle') { color = '#ed6c02'; lighterColor = '#FF9800'; darkerColor = '#BF360C'; }
  if (status === 'maintenance') { color = '#d32f2f'; lighterColor = '#EF5350'; darkerColor = '#B71C1C'; }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.4)); transform: perspective(800px) rotateX(15deg);">
      <!-- Shadow -->
      <ellipse cx="24" cy="44" rx="16" ry="3" fill="rgba(0,0,0,0.25)"/>
      <!-- Cargo body -->
      <rect x="6" y="10" width="28" height="22" rx="3" fill="${color}" stroke="${darkerColor}" stroke-width="1.5"/>
      <!-- Cargo side lines (depth) -->
      <line x1="10" y1="14" x2="10" y2="28" stroke="${darkerColor}" stroke-width="0.5" opacity="0.5"/>
      <line x1="18" y1="14" x2="18" y2="28" stroke="${darkerColor}" stroke-width="0.5" opacity="0.5"/>
      <line x1="26" y1="14" x2="26" y2="28" stroke="${darkerColor}" stroke-width="0.5" opacity="0.5"/>
      <!-- Cabin -->
      <rect x="30" y="16" width="14" height="16" rx="2" fill="${lighterColor}" stroke="${darkerColor}" stroke-width="1"/>
      <!-- Windshield -->
      <rect x="32" y="18" width="10" height="7" rx="1" fill="#87CEEB" opacity="0.8"/>
      <!-- Windshield reflection -->
      <line x1="33" y1="19" x2="36" y2="24" stroke="white" stroke-width="0.8" opacity="0.4"/>
      <!-- Wheels -->
      <circle cx="14" cy="34" r="4" fill="#333"/>
      <circle cx="36" cy="34" r="4" fill="#333"/>
      <!-- Hubcaps -->
      <circle cx="14" cy="34" r="2" fill="#888"/>
      <circle cx="36" cy="34" r="2" fill="#888"/>
      <!-- Hubcap detail -->
      <circle cx="14" cy="34" r="0.8" fill="#555"/>
      <circle cx="36" cy="34" r="0.8" fill="#555"/>
      <!-- Headlights -->
      <rect x="42" y="24" width="2" height="4" rx="1" fill="#FFD700"/>
      <!-- Tail lights -->
      <rect x="4" y="26" width="2" height="3" rx="0.5" fill="#FF4444"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-truck-icon-3d',
    html: svgString,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -16]
  });
};

const FleetMap = ({ trucks, onTruckClick }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative', 
        overflow: 'hidden', 
        borderRadius: 2, 
        border: '1px solid #333',
        bgcolor: '#1e1e1e' // Yüklenirken arka plan koyu olsun
      }}
    >
      <MapContainer center={[39.0, 35.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
        
        {/* Harita Katmanı */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 2. Kamyonları Haritaya Dizme */}
        {trucks.map((truck) => (
          <Marker
            key={truck.id}
            position={[truck.lat, truck.lng]}
            icon={createTruckIcon(truck.status)}
            eventHandlers={{
              click: () => onTruckClick?.(truck.id),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', color: '#333' }}>
                <strong style={{ fontSize: '14px' }}>{truck.plate}</strong><br />
                <hr style={{ margin: '4px 0', opacity: 0.3 }}/>
                🚛 {truck.driver}<br />
                📦 {truck.cargo}<br />
                <span style={{ 
                  color: truck.status === 'active' ? 'green' : (truck.status === 'maintenance' ? 'red' : 'orange'),
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                   {truck.status.toUpperCase()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </Paper>
  );
};

export default FleetMap;