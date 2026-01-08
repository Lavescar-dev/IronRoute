import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // CSS'i burada çağırıyoruz
import L from 'leaflet';

// --- İKON DÜZELTMESİ (Markerların kaybolmaması için) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// -------------------------------------------------------

const LiveMap = ({ vehicles }) => {
  // Eğer araç verisi yoksa boş bir dizi olsun
  const safeVehicles = vehicles || [];

  return (
    // BU DİV ÇOK KRİTİK: Haritaya fiziksel bir boyut veriyor
    <div style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={[41.0082, 28.9784]} 
        zoom={10} 
        scrollWheelZoom={false} // Scroll ile zoom yapmayı engeller (Kullanıcı dostu)
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {safeVehicles.map((vehicle, idx) => (
          <Marker key={idx} position={[vehicle.lat, vehicle.lon]}>
            <Popup>
              <div style={{ textAlign: 'center', color: 'black' }}>
                <strong>{vehicle.id}</strong><br/>
                Hız: {vehicle.speed} km/h
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
