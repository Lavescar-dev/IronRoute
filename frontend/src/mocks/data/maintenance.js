function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export const maintenance = [
  // COMPLETED
  { id: 1, vehicle_id: 8, vehicle_plate: '34 XYZ 234', maintenance_type: 'OIL', status: 'COMPLETED', description: 'Yag degisimi ve filtre yenileme', scheduled_date: daysAgo(30), completed_date: daysAgo(30), cost: '2500.00', service_provider: 'Otokar Servis Istanbul', odometer_reading: 125000, notes: '', created_at: daysAgo(32) + 'T10:00:00Z' },
  { id: 2, vehicle_id: 10, vehicle_plate: '35 BBB 890', maintenance_type: 'TIRE', status: 'COMPLETED', description: 'On lastik degisimi (4 adet)', scheduled_date: daysAgo(25), completed_date: daysAgo(24), cost: '12000.00', service_provider: 'Bridgestone Yetkili Bayii Izmir', odometer_reading: 98000, notes: 'Michellin lastik takildi', created_at: daysAgo(27) + 'T10:00:00Z' },
  { id: 3, vehicle_id: 9, vehicle_plate: '06 AAA 567', maintenance_type: 'INSPECTION', status: 'COMPLETED', description: 'Yillik muayene', scheduled_date: daysAgo(20), completed_date: daysAgo(20), cost: '850.00', service_provider: 'TUVSUD Ankara', odometer_reading: 87000, notes: 'Muayeneden gecti', created_at: daysAgo(22) + 'T10:00:00Z' },
  { id: 4, vehicle_id: 13, vehicle_plate: '27 EEE 789', maintenance_type: 'BRAKE', status: 'COMPLETED', description: 'Fren balatalari ve diskleri degisimi', scheduled_date: daysAgo(15), completed_date: daysAgo(14), cost: '8500.00', service_provider: 'MAN Yetkili Servis Gaziantep', odometer_reading: 145000, notes: '', created_at: daysAgo(17) + 'T10:00:00Z' },

  // IN_PROGRESS (on MAINTENANCE vehicles)
  { id: 5, vehicle_id: 17, vehicle_plate: '34 KKK 901', maintenance_type: 'REPAIR', status: 'IN_PROGRESS', description: 'Motor ariza tespit ve onarim', scheduled_date: daysAgo(3), completed_date: null, cost: '25000.00', service_provider: 'Mercedes-Benz Turkiye Servis', odometer_reading: 210000, notes: 'Turbo degisimi gerekebilir', created_at: daysAgo(5) + 'T10:00:00Z' },
  { id: 6, vehicle_id: 18, vehicle_plate: '06 LLL 234', maintenance_type: 'SCHEDULED', status: 'IN_PROGRESS', description: 'Periyodik bakim (100.000 km)', scheduled_date: daysAgo(1), completed_date: null, cost: '15000.00', service_provider: 'Scania Servis Ankara', odometer_reading: 100000, notes: 'Tum filtreleri ve yagi degisecek', created_at: daysAgo(3) + 'T10:00:00Z' },

  // SCHEDULED (upcoming)
  { id: 7, vehicle_id: 11, vehicle_plate: '42 CCC 123', maintenance_type: 'OIL', status: 'SCHEDULED', description: 'Yag ve filtre degisimi', scheduled_date: daysFromNow(5), completed_date: null, cost: '1800.00', service_provider: 'Volvo Yetkili Servis Bursa', odometer_reading: 65000, notes: '', created_at: daysAgo(2) + 'T10:00:00Z' },
  { id: 8, vehicle_id: 14, vehicle_plate: '55 FFF 012', maintenance_type: 'INSPECTION', status: 'SCHEDULED', description: 'Yillik muayene', scheduled_date: daysFromNow(10), completed_date: null, cost: '850.00', service_provider: 'TUVSUD Samsun', odometer_reading: 72000, notes: '', created_at: daysAgo(1) + 'T10:00:00Z' },
  { id: 9, vehicle_id: 12, vehicle_plate: '01 DDD 456', maintenance_type: 'TIRE', status: 'SCHEDULED', description: 'Arka lastik degisimi', scheduled_date: daysFromNow(7), completed_date: null, cost: '4000.00', service_provider: 'Goodyear Adana', odometer_reading: 45000, notes: '', created_at: daysAgo(1) + 'T10:00:00Z' },
  { id: 10, vehicle_id: 15, vehicle_plate: '61 GGG 345', maintenance_type: 'BRAKE', status: 'SCHEDULED', description: 'Fren sistemi kontrolu', scheduled_date: daysFromNow(14), completed_date: null, cost: '3500.00', service_provider: 'Iveco Servis Trabzon', odometer_reading: 55000, notes: '', created_at: daysAgo(0) + 'T10:00:00Z' },
  { id: 11, vehicle_id: 1, vehicle_plate: '34 ABC 123', maintenance_type: 'SCHEDULED', status: 'SCHEDULED', description: 'Periyodik bakim (150.000 km)', scheduled_date: daysFromNow(20), completed_date: null, cost: '18000.00', service_provider: 'Mercedes-Benz Turkiye Servis', odometer_reading: 148000, notes: 'Yol donus sonrasi planlanacak', created_at: daysAgo(0) + 'T10:00:00Z' },
  { id: 12, vehicle_id: 16, vehicle_plate: '38 HHH 678', maintenance_type: 'OTHER', status: 'SCHEDULED', description: 'Klima gaz dolumu ve kontrol', scheduled_date: daysFromNow(3), completed_date: null, cost: '1200.00', service_provider: 'BMC Servis Kayseri', odometer_reading: 32000, notes: '', created_at: daysAgo(0) + 'T10:00:00Z' },
];
