function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const fuelRecords = [
  { id: 1, vehicle_id: 1, vehicle_plate: '34 ABC 123', driver_id: 1, fill_date: daysAgo(1), liters: '320.00', price_per_liter: '38.50', total_cost: '12320.00', odometer_reading: 147500, fuel_station: 'Shell Istanbul Hadimkoy', created_at: daysAgo(1) },
  { id: 2, vehicle_id: 2, vehicle_plate: '06 DEF 456', driver_id: 2, fill_date: daysAgo(1), liters: '280.00', price_per_liter: '38.75', total_cost: '10850.00', odometer_reading: 112000, fuel_station: 'BP Ankara Esenler', created_at: daysAgo(1) },
  { id: 3, vehicle_id: 3, vehicle_plate: '35 GHI 789', driver_id: 3, fill_date: daysAgo(2), liters: '300.00', price_per_liter: '38.50', total_cost: '11550.00', odometer_reading: 98500, fuel_station: 'Opet Izmir Bornova', created_at: daysAgo(2) },
  { id: 4, vehicle_id: 4, vehicle_plate: '16 JKL 012', driver_id: 4, fill_date: daysAgo(2), liters: '250.00', price_per_liter: '39.00', total_cost: '9750.00', odometer_reading: 85000, fuel_station: 'Petrol Ofisi Bursa', created_at: daysAgo(2) },
  { id: 5, vehicle_id: 5, vehicle_plate: '41 MNO 345', driver_id: null, fill_date: daysAgo(3), liters: '310.00', price_per_liter: '38.25', total_cost: '11857.50', odometer_reading: 130000, fuel_station: 'Shell Antalya Lara', created_at: daysAgo(3) },
  { id: 6, vehicle_id: 6, vehicle_plate: '07 PRS 678', driver_id: null, fill_date: daysAgo(3), liters: '270.00', price_per_liter: '38.90', total_cost: '10503.00', odometer_reading: 95000, fuel_station: 'BP Antalya Konyaalti', created_at: daysAgo(3) },
  { id: 7, vehicle_id: 7, vehicle_plate: '33 TUV 901', driver_id: null, fill_date: daysAgo(4), liters: '80.00', price_per_liter: '38.50', total_cost: '3080.00', odometer_reading: 42000, fuel_station: 'Opet Mersin', created_at: daysAgo(4) },
  { id: 8, vehicle_id: 8, vehicle_plate: '34 XYZ 234', driver_id: 5, fill_date: daysAgo(5), liters: '290.00', price_per_liter: '38.75', total_cost: '11237.50', odometer_reading: 125500, fuel_station: 'Shell Istanbul Kartal', created_at: daysAgo(5) },
  { id: 9, vehicle_id: 9, vehicle_plate: '06 AAA 567', driver_id: 6, fill_date: daysAgo(6), liters: '200.00', price_per_liter: '39.00', total_cost: '7800.00', odometer_reading: 87500, fuel_station: 'Petrol Ofisi Ankara Kizilay', created_at: daysAgo(6) },
  { id: 10, vehicle_id: 10, vehicle_plate: '35 BBB 890', driver_id: null, fill_date: daysAgo(7), liters: '330.00', price_per_liter: '38.50', total_cost: '12705.00', odometer_reading: 98500, fuel_station: 'BP Izmir Konak', created_at: daysAgo(7) },
  { id: 11, vehicle_id: 13, vehicle_plate: '27 EEE 789', driver_id: null, fill_date: daysAgo(8), liters: '300.00', price_per_liter: '38.75', total_cost: '11625.00', odometer_reading: 145500, fuel_station: 'Shell Gaziantep', created_at: daysAgo(8) },
  { id: 12, vehicle_id: 14, vehicle_plate: '55 FFF 012', driver_id: null, fill_date: daysAgo(9), liters: '240.00', price_per_liter: '39.00', total_cost: '9360.00', odometer_reading: 72500, fuel_station: 'Opet Samsun', created_at: daysAgo(9) },
  { id: 13, vehicle_id: 1, vehicle_plate: '34 ABC 123', driver_id: 1, fill_date: daysAgo(10), liters: '310.00', price_per_liter: '38.25', total_cost: '11857.50', odometer_reading: 146000, fuel_station: 'Petrol Ofisi Istanbul', created_at: daysAgo(10) },
  { id: 14, vehicle_id: 2, vehicle_plate: '06 DEF 456', driver_id: 2, fill_date: daysAgo(11), liters: '275.00', price_per_liter: '38.50', total_cost: '10587.50', odometer_reading: 111000, fuel_station: 'Shell Ankara', created_at: daysAgo(11) },
  { id: 15, vehicle_id: 3, vehicle_plate: '35 GHI 789', driver_id: 3, fill_date: daysAgo(12), liters: '295.00', price_per_liter: '38.90', total_cost: '11475.50', odometer_reading: 97500, fuel_station: 'BP Izmir', created_at: daysAgo(12) },
  { id: 16, vehicle_id: 11, vehicle_plate: '42 CCC 123', driver_id: null, fill_date: daysAgo(13), liters: '70.00', price_per_liter: '38.50', total_cost: '2695.00', odometer_reading: 64500, fuel_station: 'Opet Bursa', created_at: daysAgo(13) },
  { id: 17, vehicle_id: 12, vehicle_plate: '01 DDD 456', driver_id: null, fill_date: daysAgo(14), liters: '55.00', price_per_liter: '38.75', total_cost: '2131.25', odometer_reading: 44500, fuel_station: 'Shell Adana', created_at: daysAgo(14) },
  { id: 18, vehicle_id: 15, vehicle_plate: '61 GGG 345', driver_id: null, fill_date: daysAgo(15), liters: '65.00', price_per_liter: '39.00', total_cost: '2535.00', odometer_reading: 54500, fuel_station: 'BP Trabzon', created_at: daysAgo(15) },
  { id: 19, vehicle_id: 16, vehicle_plate: '38 HHH 678', driver_id: null, fill_date: daysAgo(16), liters: '50.00', price_per_liter: '38.50', total_cost: '1925.00', odometer_reading: 31500, fuel_station: 'Petrol Ofisi Kayseri', created_at: daysAgo(16) },
  { id: 20, vehicle_id: 4, vehicle_plate: '16 JKL 012', driver_id: 4, fill_date: daysAgo(17), liters: '245.00', price_per_liter: '38.75', total_cost: '9493.75', odometer_reading: 84000, fuel_station: 'Opet Bursa Nilufer', created_at: daysAgo(17) },
];
