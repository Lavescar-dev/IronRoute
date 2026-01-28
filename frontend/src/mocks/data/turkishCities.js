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
];

export function getCityCoords(name) {
  const city = cities.find((c) => c.name === name);
  return city ? { lat: city.lat, lng: city.lng } : null;
}
