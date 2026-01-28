function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const shipments = [
  // 5 PENDING
  { id: 1, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: null, plate_number: null, origin: 'Istanbul', destination: 'Ankara', weight_kg: 12000, price: '15000.00', status: 'PENDING', tracking_token: 'TRK-001-ABC', notes: 'Hassas gida urunleri', created_at: daysAgo(2) },
  { id: 2, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: null, plate_number: null, origin: 'Ankara', destination: 'Izmir', weight_kg: 8500, price: '11000.00', status: 'PENDING', tracking_token: 'TRK-002-DEF', notes: '', created_at: daysAgo(1) },
  { id: 3, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: null, plate_number: null, origin: 'Bursa', destination: 'Antalya', weight_kg: 5000, price: '8500.00', status: 'PENDING', tracking_token: 'TRK-003-GHI', notes: 'Ekspres teslimat', created_at: daysAgo(1) },
  { id: 4, customer_id: 4, customer_name: 'Ege Seramik San. Tic.', vehicle_id: null, plate_number: null, origin: 'Izmir', destination: 'Konya', weight_kg: 15000, price: '12000.00', status: 'PENDING', tracking_token: 'TRK-004-JKL', notes: '', created_at: daysAgo(0) },
  { id: 5, customer_id: 5, customer_name: 'Caykur Genel Mudurlugu', vehicle_id: null, plate_number: null, origin: 'Trabzon', destination: 'Istanbul', weight_kg: 9000, price: '18000.00', status: 'PENDING', tracking_token: 'TRK-005-MNO', notes: '', created_at: daysAgo(0) },

  // 8 DISPATCHED
  { id: 6, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 1, plate_number: '34 ABC 123', origin: 'Istanbul', destination: 'Gaziantep', weight_kg: 20000, price: '35000.00', status: 'DISPATCHED', tracking_token: 'TRK-006-PRS', notes: '', created_at: daysAgo(5) },
  { id: 7, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 2, plate_number: '06 DEF 456', origin: 'Ankara', destination: 'Mersin', weight_kg: 16000, price: '22000.00', status: 'DISPATCHED', tracking_token: 'TRK-007-TUV', notes: '', created_at: daysAgo(4) },
  { id: 8, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 3, plate_number: '35 GHI 789', origin: 'Izmir', destination: 'Antalya', weight_kg: 10000, price: '14000.00', status: 'DISPATCHED', tracking_token: 'TRK-008-XYZ', notes: '', created_at: daysAgo(3) },
  { id: 9, customer_id: 6, customer_name: 'Karsan Otomotiv A.S.', vehicle_id: 4, plate_number: '16 JKL 012', origin: 'Bursa', destination: 'Eskisehir', weight_kg: 7000, price: '6500.00', status: 'DISPATCHED', tracking_token: 'TRK-009-QRS', notes: '', created_at: daysAgo(3) },
  { id: 10, customer_id: 7, customer_name: 'Antalya Tarim Kredi', vehicle_id: 5, plate_number: '41 MNO 345', origin: 'Antalya', destination: 'Adana', weight_kg: 18000, price: '19000.00', status: 'DISPATCHED', tracking_token: 'TRK-010-UVW', notes: '', created_at: daysAgo(2) },
  { id: 11, customer_id: 8, customer_name: 'Gaziantep Fistik Ihr. Bir.', vehicle_id: 6, plate_number: '07 PRS 678', origin: 'Gaziantep', destination: 'Diyarbakir', weight_kg: 13000, price: '16000.00', status: 'DISPATCHED', tracking_token: 'TRK-011-XYA', notes: '', created_at: daysAgo(2) },
  { id: 12, customer_id: 9, customer_name: 'Trakya Cam Sanayii A.S.', vehicle_id: 7, plate_number: '33 TUV 901', origin: 'Samsun', destination: 'Erzurum', weight_kg: 3500, price: '7000.00', status: 'DISPATCHED', tracking_token: 'TRK-012-BCD', notes: '', created_at: daysAgo(1) },
  { id: 13, customer_id: 10, customer_name: 'Dicle Elektrik Dagitim', vehicle_id: 1, plate_number: '34 ABC 123', origin: 'Istanbul', destination: 'Kayseri', weight_kg: 14000, price: '21000.00', status: 'DISPATCHED', tracking_token: 'TRK-013-EFG', notes: 'Oncelikli sevkiyat', created_at: daysAgo(1) },

  // 12 DELIVERED
  { id: 14, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 8, plate_number: '34 XYZ 234', origin: 'Istanbul', destination: 'Ankara', weight_kg: 22000, price: '28000.00', status: 'DELIVERED', tracking_token: 'TRK-014-HIJ', notes: '', created_at: daysAgo(25) },
  { id: 15, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 9, plate_number: '06 AAA 567', origin: 'Ankara', destination: 'Izmir', weight_kg: 11000, price: '16000.00', status: 'DELIVERED', tracking_token: 'TRK-015-KLM', notes: '', created_at: daysAgo(23) },
  { id: 16, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 10, plate_number: '35 BBB 890', origin: 'Istanbul', destination: 'Bursa', weight_kg: 9000, price: '5500.00', status: 'DELIVERED', tracking_token: 'TRK-016-NOP', notes: '', created_at: daysAgo(22) },
  { id: 17, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 8, plate_number: '34 XYZ 234', origin: 'Ankara', destination: 'Konya', weight_kg: 14000, price: '11000.00', status: 'DELIVERED', tracking_token: 'TRK-017-QRS', notes: '', created_at: daysAgo(20) },
  { id: 18, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 11, plate_number: '42 CCC 123', origin: 'Istanbul', destination: 'Trabzon', weight_kg: 2500, price: '9500.00', status: 'DELIVERED', tracking_token: 'TRK-018-TUV', notes: '', created_at: daysAgo(18) },
  { id: 19, customer_id: 4, customer_name: 'Ege Seramik San. Tic.', vehicle_id: 13, plate_number: '27 EEE 789', origin: 'Izmir', destination: 'Ankara', weight_kg: 19000, price: '24000.00', status: 'DELIVERED', tracking_token: 'TRK-019-WXY', notes: '', created_at: daysAgo(17) },
  { id: 20, customer_id: 5, customer_name: 'Caykur Genel Mudurlugu', vehicle_id: 14, plate_number: '55 FFF 012', origin: 'Trabzon', destination: 'Samsun', weight_kg: 6000, price: '4500.00', status: 'DELIVERED', tracking_token: 'TRK-020-ZAB', notes: '', created_at: daysAgo(15) },
  { id: 21, customer_id: 6, customer_name: 'Karsan Otomotiv A.S.', vehicle_id: 12, plate_number: '01 DDD 456', origin: 'Bursa', destination: 'Istanbul', weight_kg: 1200, price: '3000.00', status: 'DELIVERED', tracking_token: 'TRK-021-CDE', notes: '', created_at: daysAgo(14) },
  { id: 22, customer_id: 7, customer_name: 'Antalya Tarim Kredi', vehicle_id: 15, plate_number: '61 GGG 345', origin: 'Antalya', destination: 'Mersin', weight_kg: 3000, price: '5000.00', status: 'DELIVERED', tracking_token: 'TRK-022-FGH', notes: '', created_at: daysAgo(12) },
  { id: 23, customer_id: 8, customer_name: 'Gaziantep Fistik Ihr. Bir.', vehicle_id: 16, plate_number: '38 HHH 678', origin: 'Gaziantep', destination: 'Adana', weight_kg: 1500, price: '4000.00', status: 'DELIVERED', tracking_token: 'TRK-023-IJK', notes: '', created_at: daysAgo(10) },
  { id: 24, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 9, plate_number: '06 AAA 567', origin: 'Istanbul', destination: 'Kayseri', weight_kg: 12000, price: '19000.00', status: 'DELIVERED', tracking_token: 'TRK-024-LMN', notes: '', created_at: daysAgo(9) },
  { id: 25, customer_id: 4, customer_name: 'Ege Seramik San. Tic.', vehicle_id: 10, plate_number: '35 BBB 890', origin: 'Izmir', destination: 'Eskisehir', weight_kg: 17000, price: '20000.00', status: 'DELIVERED', tracking_token: 'TRK-025-OPQ', notes: '', created_at: daysAgo(7) },

  // 3 CANCELLED
  { id: 26, customer_id: 9, customer_name: 'Trakya Cam Sanayii A.S.', vehicle_id: null, plate_number: null, origin: 'Edirne', destination: 'Istanbul', weight_kg: 4000, price: '3500.00', status: 'CANCELLED', tracking_token: 'TRK-026-RST', notes: 'Musteri iptal etti', created_at: daysAgo(20) },
  { id: 27, customer_id: 10, customer_name: 'Dicle Elektrik Dagitim', vehicle_id: null, plate_number: null, origin: 'Diyarbakir', destination: 'Ankara', weight_kg: 8000, price: '15000.00', status: 'CANCELLED', tracking_token: 'TRK-027-UVW', notes: 'Hava kosullari', created_at: daysAgo(15) },
  { id: 28, customer_id: 5, customer_name: 'Caykur Genel Mudurlugu', vehicle_id: null, plate_number: null, origin: 'Trabzon', destination: 'Gaziantep', weight_kg: 11000, price: '25000.00', status: 'CANCELLED', tracking_token: 'TRK-028-XYZ', notes: 'Rota mevcut degil', created_at: daysAgo(8) },
];
