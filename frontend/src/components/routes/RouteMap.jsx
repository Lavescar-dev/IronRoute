import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCityCoords, getRouteWaypoints, getAlternativeWaypoints } from '../../mocks/data/turkishCities';

const ROUTE_COLORS = {
  fastest: '#2E7D32',
  shortest: '#1565C0',
  economic: '#E65100',
};

const TRAFFIC_COLORS = {
  green: '#4CAF50',
  yellow: '#FF9800',
  red: '#F44336',
};

const createStopIcon = (sequence, type) => {
  const isOrigin = type === 'ORIGIN';
  const isDest = type === 'DESTINATION';
  const color = isOrigin ? '#2E7D32' : isDest ? '#D32F2F' : '#1976D2';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">${sequence}</text>
    </svg>
  `;

  return L.divIcon({
    className: 'route-stop-icon',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const RouteMap = ({ route, selectedAlternative }) => {
  const origin = route?.origin;
  const destination = route?.destination;

  const routePoints = useMemo(() => {
    if (!origin || !destination) return [];

    const start = getCityCoords(origin);
    const end = getCityCoords(destination);
    if (!start || !end) return [];

    const waypoints = getRouteWaypoints(origin, destination);
    return [
      [start.lat, start.lng],
      ...waypoints.map((w) => [w.lat, w.lng]),
      [end.lat, end.lng],
    ];
  }, [origin, destination]);

  const alternativePoints = useMemo(() => {
    if (!origin || !destination || !selectedAlternative) return [];

    const start = getCityCoords(origin);
    const end = getCityCoords(destination);
    if (!start || !end) return [];

    const altWaypoints = getAlternativeWaypoints(origin, destination, selectedAlternative);
    if (altWaypoints.length === 0) return [];

    return [
      [start.lat, start.lng],
      ...altWaypoints.map((w) => [w.lat, w.lng]),
      [end.lat, end.lng],
    ];
  }, [origin, destination, selectedAlternative]);

  const stopMarkers = useMemo(() => {
    if (!route?.stops) return [];
    return route.stops
      .map((stop) => {
        const cityName = stop.city || stop.shipment_destination;
        if (!cityName) return null;
        const coords = getCityCoords(cityName);
        if (!coords) return null;
        return { ...stop, lat: coords.lat, lng: coords.lng };
      })
      .filter(Boolean);
  }, [route]);

  const trafficSegments = useMemo(() => {
    if (!route?.stops || routePoints.length < 2) return [];
    const segments = [];
    for (let i = 0; i < routePoints.length - 1; i++) {
      const ratio = i / (routePoints.length - 1);
      let traffic = 'green';
      if (ratio < 0.15 || ratio > 0.85) traffic = 'red';
      else if (ratio < 0.3 || ratio > 0.7) traffic = 'yellow';
      segments.push({
        positions: [routePoints[i], routePoints[i + 1]],
        color: TRAFFIC_COLORS[traffic],
      });
    }
    return segments;
  }, [routePoints, route]);

  const center = useMemo(() => {
    if (routePoints.length === 0) return [39.0, 35.0];
    const lats = routePoints.map((p) => p[0]);
    const lngs = routePoints.map((p) => p[1]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ];
  }, [routePoints]);

  const zoom = useMemo(() => {
    if (routePoints.length < 2) return 6;
    const lats = routePoints.map((p) => p[0]);
    const lngs = routePoints.map((p) => p[1]);
    const latDiff = Math.max(...lats) - Math.min(...lats);
    const lngDiff = Math.max(...lngs) - Math.min(...lngs);
    const maxDiff = Math.max(latDiff, lngDiff);
    if (maxDiff > 8) return 5;
    if (maxDiff > 4) return 6;
    if (maxDiff > 2) return 7;
    return 8;
  }, [routePoints]);

  return (
    <Box sx={{ height: '100%', width: '100%', minHeight: 400, borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        key={`${route?.id}-${center[0]}-${center[1]}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Alternative route (dashed, behind main) */}
        {alternativePoints.length > 0 && (
          <Polyline
            positions={alternativePoints}
            pathOptions={{
              color: ROUTE_COLORS[selectedAlternative] || '#999',
              weight: 3,
              dashArray: '10, 8',
              opacity: 0.6,
            }}
          />
        )}

        {/* Traffic segments */}
        {trafficSegments.map((seg, i) => (
          <Polyline
            key={`traffic-${i}`}
            positions={seg.positions}
            pathOptions={{
              color: seg.color,
              weight: 6,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Main route (solid blue) */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#1976D2',
              weight: 4,
              opacity: 0.9,
            }}
          />
        )}

        {/* Stop markers */}
        {stopMarkers.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(stop.sequence, stop.type)}
          >
            <Popup>
              <div style={{ textAlign: 'center', color: '#333' }}>
                <strong>{stop.city || stop.shipment_destination}</strong>
                <br />
                {stop.type === 'ORIGIN' && 'Baslangic Noktasi'}
                {stop.type === 'DESTINATION' && 'Varis Noktasi'}
                {stop.type === 'REST' && 'Mola Noktasi'}
                {stop.estimated_arrival && (
                  <>
                    <br />
                    <span style={{ fontSize: '11px' }}>
                      Tahmini:{' '}
                      {new Date(stop.estimated_arrival).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default RouteMap;
