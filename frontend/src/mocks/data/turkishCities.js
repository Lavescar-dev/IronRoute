export const cities = [
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { name: 'Izmir', lat: 38.4189, lng: 27.1287 },
  { name: 'Antalya', lat: 36.8841, lng: 30.7056 },
  { name: 'Bursa', lat: 40.1826, lng: 29.0665 },
  { name: 'Adana', lat: 37.0, lng: 35.3213 },
  { name: 'Konya', lat: 37.8667, lng: 32.4833 },
  { name: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { name: 'Mersin', lat: 36.8, lng: 34.6333 },
  { name: 'Kayseri', lat: 38.7312, lng: 35.4787 },
  { name: 'Trabzon', lat: 41.0015, lng: 39.7178 },
  { name: 'Samsun', lat: 41.2867, lng: 36.33 },
  { name: 'Erzurum', lat: 39.9, lng: 41.27 },
  { name: 'Eskisehir', lat: 39.7767, lng: 30.5206 },
  { name: 'Diyarbakir', lat: 37.9144, lng: 40.2306 },
  { name: 'Edirne', lat: 41.6818, lng: 26.5623 },
];

export function getCityCoords(name) {
  const city = cities.find((c) => c.name === name);
  return city ? { lat: city.lat, lng: city.lng } : null;
}

// Waypoints between city pairs for realistic route drawing
// Each route has 3-8 waypoints simulating highway/main road paths
export const waypoints = {
  'Istanbul-Ankara': [
    { lat: 40.91, lng: 29.31 },  // Gebze
    { lat: 40.77, lng: 29.95 },  // Izmit
    { lat: 40.65, lng: 30.40 },  // Sapanca
    { lat: 40.43, lng: 30.84 },  // Bolu
    { lat: 40.61, lng: 31.61 },  // Duzce
    { lat: 40.45, lng: 32.04 },  // Nallihan
    { lat: 40.05, lng: 32.51 },  // Beypazari
  ],
  'Ankara-Istanbul': [
    { lat: 40.05, lng: 32.51 },
    { lat: 40.45, lng: 32.04 },
    { lat: 40.61, lng: 31.61 },
    { lat: 40.43, lng: 30.84 },
    { lat: 40.65, lng: 30.40 },
    { lat: 40.77, lng: 29.95 },
    { lat: 40.91, lng: 29.31 },
  ],
  'Istanbul-Gaziantep': [
    { lat: 40.91, lng: 29.31 },  // Gebze
    { lat: 40.77, lng: 29.95 },  // Izmit
    { lat: 40.65, lng: 30.40 },  // Sapanca
    { lat: 40.43, lng: 30.84 },  // Bolu
    { lat: 39.93, lng: 32.86 },  // Ankara
    { lat: 39.64, lng: 34.08 },  // Kirsehir
    { lat: 38.73, lng: 35.48 },  // Kayseri
    { lat: 38.35, lng: 36.35 },  // Kahramanmaras
  ],
  'Ankara-Mersin': [
    { lat: 39.72, lng: 33.52 },  // Aksaray yakini
    { lat: 39.14, lng: 33.78 },  // Nigde yakini
    { lat: 38.74, lng: 34.33 },  // Nigde
    { lat: 37.95, lng: 34.68 },  // Ulukisla
    { lat: 37.58, lng: 34.72 },  // Tarsus yakini
    { lat: 37.00, lng: 34.80 },  // Tarsus
  ],
  'Izmir-Antalya': [
    { lat: 38.07, lng: 27.42 },  // Aydin yakini
    { lat: 37.75, lng: 27.85 },  // Aydin
    { lat: 37.46, lng: 28.36 },  // Mugla yakini
    { lat: 37.21, lng: 28.77 },  // Mugla
    { lat: 37.05, lng: 29.60 },  // Burdur yakini
    { lat: 36.95, lng: 30.30 },  // Antalya yakini
  ],
  'Bursa-Eskisehir': [
    { lat: 40.08, lng: 29.35 },  // Bilecik yakini
    { lat: 39.95, lng: 29.73 },  // Bilecik
    { lat: 39.88, lng: 30.10 },  // Bozuyuk
  ],
  'Istanbul-Kayseri': [
    { lat: 40.91, lng: 29.31 },
    { lat: 40.77, lng: 29.95 },
    { lat: 40.65, lng: 30.40 },
    { lat: 40.43, lng: 30.84 },
    { lat: 39.93, lng: 32.86 },  // Ankara
    { lat: 39.64, lng: 34.08 },  // Kirsehir
  ],
  'Ankara-Konya': [
    { lat: 39.65, lng: 32.67 },  // Polatli
    { lat: 39.12, lng: 32.50 },  // Haymana
    { lat: 38.73, lng: 32.49 },  // Cihanbeyli
  ],
  'Istanbul-Trabzon': [
    { lat: 41.02, lng: 29.31 },  // Gebze
    { lat: 40.91, lng: 30.40 },  // Sapanca
    { lat: 40.65, lng: 30.84 },  // Bolu
    { lat: 40.81, lng: 31.61 },  // Duzce
    { lat: 41.08, lng: 32.62 },  // Kastamonu yakini
    { lat: 41.19, lng: 33.78 },  // Sinop yakini
    { lat: 41.29, lng: 36.33 },  // Samsun
    { lat: 41.15, lng: 38.00 },  // Giresun
  ],
  'Trabzon-Istanbul': [
    { lat: 41.15, lng: 38.00 },
    { lat: 41.29, lng: 36.33 },
    { lat: 41.19, lng: 33.78 },
    { lat: 41.08, lng: 32.62 },
    { lat: 40.81, lng: 31.61 },
    { lat: 40.65, lng: 30.84 },
    { lat: 40.91, lng: 30.40 },
    { lat: 41.02, lng: 29.31 },
  ],
  'Gaziantep-Diyarbakir': [
    { lat: 37.25, lng: 37.87 },  // Nizip
    { lat: 37.42, lng: 38.32 },  // Adiyaman yakini
    { lat: 37.76, lng: 38.95 },  // Siverek yakini
    { lat: 37.85, lng: 39.60 },  // Diyarbakir yakini
  ],
  'Antalya-Adana': [
    { lat: 37.10, lng: 31.20 },  // Isparta yakini
    { lat: 37.35, lng: 32.00 },  // Konya yakini
    { lat: 37.20, lng: 33.30 },  // Karaman yakini
    { lat: 37.05, lng: 34.30 },  // Silifke yakini
    { lat: 36.95, lng: 34.90 },  // Mersin yakini
  ],
  'Samsun-Erzurum': [
    { lat: 40.98, lng: 37.02 },  // Tokat yakini
    { lat: 40.65, lng: 37.88 },  // Tokat
    { lat: 40.33, lng: 38.82 },  // Sivas yakini
    { lat: 40.05, lng: 39.72 },  // Erzincan yakini
    { lat: 39.95, lng: 40.50 },  // Erzurum yakini
  ],
  'Istanbul-Bursa': [
    { lat: 40.88, lng: 29.28 },  // Gebze
    { lat: 40.72, lng: 29.47 },  // Yalova yakini
    { lat: 40.44, lng: 29.18 },  // Yalova
  ],
  'Ankara-Izmir': [
    { lat: 39.77, lng: 31.50 },  // Kutahya yakini
    { lat: 39.40, lng: 30.52 },  // Eskisehir yakini
    { lat: 39.08, lng: 29.50 },  // Kutahya
    { lat: 38.90, lng: 28.50 },  // Usak yakini
    { lat: 38.62, lng: 27.68 },  // Manisa yakini
  ],
  'Trabzon-Samsun': [
    { lat: 41.05, lng: 39.20 },  // Trabzon cikisi
    { lat: 41.10, lng: 38.40 },  // Giresun yakini
    { lat: 41.12, lng: 37.60 },  // Ordu yakini
    { lat: 41.20, lng: 36.80 },  // Unye yakini
  ],
  'Izmir-Ankara': [
    { lat: 38.62, lng: 27.68 },  // Manisa yakini
    { lat: 38.90, lng: 28.50 },  // Usak yakini
    { lat: 39.08, lng: 29.50 },  // Kutahya
    { lat: 39.40, lng: 30.52 },  // Eskisehir yakini
    { lat: 39.77, lng: 31.50 },  // Kutahya yakini
  ],
  'Izmir-Konya': [
    { lat: 38.22, lng: 27.80 },  // Aydin yakini
    { lat: 38.05, lng: 28.60 },  // Denizli yakini
    { lat: 37.95, lng: 29.50 },  // Burdur yakini
    { lat: 37.90, lng: 30.50 },  // Isparta yakini
    { lat: 37.85, lng: 31.50 },  // Beysehir yakini
  ],
  'Izmir-Eskisehir': [
    { lat: 38.62, lng: 27.68 },  // Manisa yakini
    { lat: 38.90, lng: 28.50 },  // Usak yakini
    { lat: 39.08, lng: 29.50 },  // Kutahya
    { lat: 39.40, lng: 30.00 },  // Eskisehir yakini
  ],
  'Bursa-Istanbul': [
    { lat: 40.44, lng: 29.18 },
    { lat: 40.72, lng: 29.47 },
    { lat: 40.88, lng: 29.28 },
  ],
  'Antalya-Mersin': [
    { lat: 36.75, lng: 31.30 },  // Alanya yakini
    { lat: 36.55, lng: 32.00 },  // Anamur yakini
    { lat: 36.50, lng: 33.00 },  // Silifke yakini
    { lat: 36.65, lng: 34.00 },  // Mersin yakini
  ],
  'Gaziantep-Adana': [
    { lat: 37.05, lng: 36.80 },  // Islahiye yakini
    { lat: 37.00, lng: 36.20 },  // Osmaniye yakini
    { lat: 37.00, lng: 35.80 },  // Ceyhan yakini
  ],
  'Istanbul-Kayseri-alt': [
    { lat: 40.91, lng: 29.31 },
    { lat: 40.43, lng: 30.84 },
    { lat: 39.93, lng: 32.86 },
    { lat: 39.40, lng: 33.80 },
    { lat: 38.95, lng: 34.50 },
  ],
  'Edirne-Istanbul': [
    { lat: 41.68, lng: 27.00 },  // Luleburgaz yakini
    { lat: 41.53, lng: 27.80 },  // Corlu yakini
    { lat: 41.30, lng: 28.40 },  // Silivri yakini
  ],
};

// Get waypoints for a city pair
export function getRouteWaypoints(origin, destination) {
  const key = `${origin}-${destination}`;
  return waypoints[key] || [];
}

// Get alternative route waypoints (slight variations of main route)
export function getAlternativeWaypoints(origin, destination, type) {
  const mainWaypoints = getRouteWaypoints(origin, destination);
  if (mainWaypoints.length === 0) return [];

  const offset = type === 'shortest' ? -0.15 : type === 'economic' ? 0.1 : 0;
  return mainWaypoints.map(wp => ({
    lat: wp.lat + offset * (Math.random() * 0.5 + 0.5),
    lng: wp.lng + offset * (Math.random() * 0.5 + 0.5),
  }));
}
