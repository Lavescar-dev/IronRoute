import React from 'react';
import { Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Leaflet kütüphanesi şart!

// --- 1. SVG İKON MOTORU (Burası Eksikti veya Hatalıydı) ---
const createTruckIcon = (status) => {
  let color = '#757575'; // Varsayılan Gri
  if (status === 'active') color = '#2e7d32';      // Yeşil
  if (status === 'idle') color = '#ed6c02';        // Turuncu
  if (status === 'maintenance') color = '#d32f2f'; // Kırmızı

  // SVG Kodunun Kendisi
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="white" stroke-width="1">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  `;

  // Leaflet'e bu HTML'i ikon olarak kullanmasını söylüyoruz
  return L.divIcon({
    className: 'custom-truck-icon', // CSS class (boş olsa da olur)
    html: svgString,
    iconSize: [32, 32],   // İkonun kaplayacağı alan
    iconAnchor: [16, 16], // İkonun tam ortası koordinata denk gelsin
    popupAnchor: [0, -10] // Popup tepede çıksın
  });
};

const FleetMap = ({ trucks }) => {
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
            icon={createTruckIcon(truck.status)} // <-- İŞTE SİHİR BURADA ÇAĞRILIYOR
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