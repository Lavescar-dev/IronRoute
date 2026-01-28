import { cities } from './turkishCities.js';

function randomCity() {
  return cities[Math.floor(Math.random() * cities.length)];
}

function makeVehicles() {
  const raw = [
    // 7 TRANSIT
    { id: 1, plate_number: '34 ABC 123', brand: 'Mercedes-Benz', model_year: 2021, vehicle_type: 'TRUCK', capacity_kg: 25000, status: 'TRANSIT' },
    { id: 2, plate_number: '06 DEF 456', brand: 'Scania', model_year: 2022, vehicle_type: 'LORRY', capacity_kg: 20000, status: 'TRANSIT' },
    { id: 3, plate_number: '35 GHI 789', brand: 'Volvo', model_year: 2020, vehicle_type: 'TRUCK', capacity_kg: 22000, status: 'TRANSIT' },
    { id: 4, plate_number: '16 JKL 012', brand: 'MAN', model_year: 2023, vehicle_type: 'LORRY', capacity_kg: 18000, status: 'TRANSIT' },
    { id: 5, plate_number: '41 MNO 345', brand: 'DAF', model_year: 2021, vehicle_type: 'TRUCK', capacity_kg: 24000, status: 'TRANSIT' },
    { id: 6, plate_number: '07 PRS 678', brand: 'Iveco', model_year: 2022, vehicle_type: 'TRUCK', capacity_kg: 19000, status: 'TRANSIT' },
    { id: 7, plate_number: '33 TUV 901', brand: 'Ford', model_year: 2023, vehicle_type: 'VAN', capacity_kg: 5000, status: 'TRANSIT' },

    // 9 IDLE
    { id: 8, plate_number: '34 XYZ 234', brand: 'Mercedes-Benz', model_year: 2020, vehicle_type: 'TRUCK', capacity_kg: 23000, status: 'IDLE' },
    { id: 9, plate_number: '06 AAA 567', brand: 'BMC', model_year: 2021, vehicle_type: 'LORRY', capacity_kg: 15000, status: 'IDLE' },
    { id: 10, plate_number: '35 BBB 890', brand: 'Scania', model_year: 2019, vehicle_type: 'TRUCK', capacity_kg: 25000, status: 'IDLE' },
    { id: 11, plate_number: '42 CCC 123', brand: 'Volvo', model_year: 2022, vehicle_type: 'VAN', capacity_kg: 3500, status: 'IDLE' },
    { id: 12, plate_number: '01 DDD 456', brand: 'Ford', model_year: 2023, vehicle_type: 'PICKUP', capacity_kg: 1500, status: 'IDLE' },
    { id: 13, plate_number: '27 EEE 789', brand: 'MAN', model_year: 2020, vehicle_type: 'TRUCK', capacity_kg: 21000, status: 'IDLE' },
    { id: 14, plate_number: '55 FFF 012', brand: 'DAF', model_year: 2021, vehicle_type: 'LORRY', capacity_kg: 17000, status: 'IDLE' },
    { id: 15, plate_number: '61 GGG 345', brand: 'Iveco', model_year: 2022, vehicle_type: 'VAN', capacity_kg: 4000, status: 'IDLE' },
    { id: 16, plate_number: '38 HHH 678', brand: 'BMC', model_year: 2023, vehicle_type: 'PICKUP', capacity_kg: 2000, status: 'IDLE' },

    // 2 MAINTENANCE
    { id: 17, plate_number: '34 KKK 901', brand: 'Mercedes-Benz', model_year: 2019, vehicle_type: 'TRUCK', capacity_kg: 22000, status: 'MAINTENANCE' },
    { id: 18, plate_number: '06 LLL 234', brand: 'Scania', model_year: 2020, vehicle_type: 'LORRY', capacity_kg: 20000, status: 'MAINTENANCE' },
  ];

  return raw.map((v) => {
    const city = randomCity();
    return {
      ...v,
      current_lat: v.status === 'TRANSIT' ? city.lat : city.lat + (Math.random() - 0.5) * 0.1,
      current_lng: v.status === 'TRANSIT' ? city.lng : city.lng + (Math.random() - 0.5) * 0.1,
      created_at: '2024-08-15T10:00:00Z',
    };
  });
}

export const vehicles = makeVehicles();
