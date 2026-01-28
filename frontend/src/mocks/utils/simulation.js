/**
 * TruckSimulator - Moves TRANSIT vehicles along city routes every 3 seconds.
 */

const ROUTES = [
  // Istanbul -> Ankara
  [
    { lat: 41.0082, lng: 28.9784 },
    { lat: 40.7669, lng: 29.9169 },
    { lat: 40.6013, lng: 30.5887 },
    { lat: 40.4, lng: 31.3 },
    { lat: 40.1, lng: 32.0 },
    { lat: 39.9334, lng: 32.8597 },
  ],
  // Ankara -> Izmir
  [
    { lat: 39.9334, lng: 32.8597 },
    { lat: 39.6, lng: 31.5 },
    { lat: 39.1, lng: 30.5 },
    { lat: 38.7, lng: 29.4 },
    { lat: 38.4189, lng: 27.1287 },
  ],
  // Izmir -> Antalya
  [
    { lat: 38.4189, lng: 27.1287 },
    { lat: 37.8, lng: 28.3 },
    { lat: 37.2, lng: 29.1 },
    { lat: 36.8841, lng: 30.7056 },
  ],
  // Antalya -> Mersin
  [
    { lat: 36.8841, lng: 30.7056 },
    { lat: 36.6, lng: 31.5 },
    { lat: 36.5, lng: 32.5 },
    { lat: 36.8, lng: 34.6333 },
  ],
  // Mersin -> Gaziantep
  [
    { lat: 36.8, lng: 34.6333 },
    { lat: 37.0, lng: 35.3 },
    { lat: 37.0, lng: 36.2 },
    { lat: 37.0662, lng: 37.3833 },
  ],
  // Bursa -> Trabzon (northern route)
  [
    { lat: 40.1826, lng: 29.0665 },
    { lat: 40.6, lng: 30.4 },
    { lat: 40.7, lng: 32.6 },
    { lat: 41.0, lng: 34.0 },
    { lat: 41.0, lng: 36.0 },
    { lat: 41.0015, lng: 39.7178 },
  ],
  // Konya -> Kayseri
  [
    { lat: 37.8667, lng: 32.4833 },
    { lat: 38.1, lng: 33.5 },
    { lat: 38.5, lng: 34.5 },
    { lat: 38.7312, lng: 35.4787 },
  ],
  // Samsun -> Erzurum
  [
    { lat: 41.2867, lng: 36.33 },
    { lat: 40.8, lng: 37.5 },
    { lat: 40.3, lng: 38.5 },
    { lat: 39.9, lng: 41.2700 },
  ],
];

const MAX_LOCATION_RECORDS = 5000;

export class TruckSimulator {
  constructor(db) {
    this.db = db;
    this.intervalId = null;
    // Track progress per vehicle: { vehicleId: { routeIndex, segmentIndex, t } }
    this.vehicleProgress = {};
  }

  start() {
    this._initVehicles();
    this.intervalId = setInterval(() => this._tick(), 3000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  _initVehicles() {
    const transitVehicles = this.db.vehicles.filter((v) => v.status === 'TRANSIT');
    transitVehicles.forEach((v, i) => {
      const routeIndex = i % ROUTES.length;
      this.vehicleProgress[v.id] = {
        routeIndex,
        segmentIndex: 0,
        t: 0,
      };
      // Set initial position
      const route = ROUTES[routeIndex];
      v.current_lat = route[0].lat;
      v.current_lng = route[0].lng;
    });
  }

  _tick() {
    const transitVehicles = this.db.vehicles.filter((v) => v.status === 'TRANSIT');
    const now = new Date().toISOString();

    transitVehicles.forEach((v) => {
      let progress = this.vehicleProgress[v.id];
      if (!progress) {
        const routeIndex = Math.floor(Math.random() * ROUTES.length);
        progress = { routeIndex, segmentIndex: 0, t: 0 };
        this.vehicleProgress[v.id] = progress;
      }

      const route = ROUTES[progress.routeIndex];
      const from = route[progress.segmentIndex];
      const to = route[progress.segmentIndex + 1];

      if (!from || !to) {
        // Route complete, pick a new random route
        progress.routeIndex = Math.floor(Math.random() * ROUTES.length);
        progress.segmentIndex = 0;
        progress.t = 0;
        return;
      }

      // Advance t by ~8-15% per tick
      progress.t += 0.08 + Math.random() * 0.07;

      if (progress.t >= 1) {
        // Move to next segment
        progress.segmentIndex++;
        progress.t = 0;
        if (progress.segmentIndex >= route.length - 1) {
          // Route complete, reverse or pick new
          progress.routeIndex = Math.floor(Math.random() * ROUTES.length);
          progress.segmentIndex = 0;
          progress.t = 0;
          return;
        }
      }

      // Interpolate position with noise
      const t = progress.t;
      const lat = from.lat + (to.lat - from.lat) * t + (Math.random() - 0.5) * 0.005;
      const lng = from.lng + (to.lng - from.lng) * t + (Math.random() - 0.5) * 0.005;

      v.current_lat = parseFloat(lat.toFixed(6));
      v.current_lng = parseFloat(lng.toFixed(6));

      // Add location record
      this.db.vehicleLocations.push({
        id: this.db.vehicleLocations.length + 1,
        vehicle: v.id,
        latitude: v.current_lat,
        longitude: v.current_lng,
        speed: 60 + Math.floor(Math.random() * 40),
        heading: Math.floor(Math.random() * 360),
        recorded_at: now,
      });
    });

    // Trim old location records
    if (this.db.vehicleLocations.length > MAX_LOCATION_RECORDS) {
      this.db.vehicleLocations = this.db.vehicleLocations.slice(-MAX_LOCATION_RECORDS);
    }
  }
}
