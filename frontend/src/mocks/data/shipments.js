function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysAgoHours(n, hours) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hours, 0, 0, 0);
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
  {
    id: 6, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 1, plate_number: '34 ABC 123', origin: 'Istanbul', destination: 'Gaziantep', weight_kg: 20000, price: '35000.00', status: 'DISPATCHED', tracking_token: 'TRK-006-PRS', notes: '', created_at: daysAgo(5),
    photos: [
      { id: 1, url: 'https://picsum.photos/seed/loading-6/800/600', thumbnail: 'https://picsum.photos/seed/loading-6/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(5, 6), uploaded_by: 'Ahmet Yilmaz', note: 'Palet yukleme tamamlandi' },
      { id: 2, url: 'https://picsum.photos/seed/in_transit-6/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-6/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(4, 14), uploaded_by: 'Ahmet Yilmaz', note: 'Ankara cikisi' },
    ],
  },
  {
    id: 7, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 2, plate_number: '06 DEF 456', origin: 'Ankara', destination: 'Mersin', weight_kg: 16000, price: '22000.00', status: 'DISPATCHED', tracking_token: 'TRK-007-TUV', notes: '', created_at: daysAgo(4),
    photos: [
      { id: 3, url: 'https://picsum.photos/seed/loading-7/800/600', thumbnail: 'https://picsum.photos/seed/loading-7/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(4, 7), uploaded_by: 'Mehmet Kaya', note: 'Konteyner yuklendi' },
      { id: 4, url: 'https://picsum.photos/seed/in_transit-7/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-7/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(3, 10), uploaded_by: 'Mehmet Kaya', note: 'Bolu tunelini gectik' },
    ],
  },
  {
    id: 8, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 3, plate_number: '35 GHI 789', origin: 'Izmir', destination: 'Antalya', weight_kg: 10000, price: '14000.00', status: 'DISPATCHED', tracking_token: 'TRK-008-XYZ', notes: '', created_at: daysAgo(3),
    photos: [
      { id: 5, url: 'https://picsum.photos/seed/loading-8/800/600', thumbnail: 'https://picsum.photos/seed/loading-8/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(3, 8), uploaded_by: 'Huseyin Demir', note: 'Kasa kapak kapatildi' },
    ],
  },
  {
    id: 9, customer_id: 6, customer_name: 'Karsan Otomotiv A.S.', vehicle_id: 4, plate_number: '16 JKL 012', origin: 'Bursa', destination: 'Eskisehir', weight_kg: 7000, price: '6500.00', status: 'DISPATCHED', tracking_token: 'TRK-009-QRS', notes: '', created_at: daysAgo(3),
    photos: [
      { id: 6, url: 'https://picsum.photos/seed/loading-9/800/600', thumbnail: 'https://picsum.photos/seed/loading-9/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(3, 9), uploaded_by: 'Ali Celik', note: 'Palet yukleme tamamlandi' },
      { id: 7, url: 'https://picsum.photos/seed/in_transit-9/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-9/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(2, 15), uploaded_by: 'Ali Celik', note: 'Mola - Duzce dinlenme tesisi' },
    ],
  },
  {
    id: 10, customer_id: 7, customer_name: 'Antalya Tarim Kredi', vehicle_id: 5, plate_number: '41 MNO 345', origin: 'Antalya', destination: 'Adana', weight_kg: 18000, price: '19000.00', status: 'DISPATCHED', tracking_token: 'TRK-010-UVW', notes: '', created_at: daysAgo(2),
    photos: [
      { id: 8, url: 'https://picsum.photos/seed/loading-10/800/600', thumbnail: 'https://picsum.photos/seed/loading-10/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(2, 6), uploaded_by: 'Serkan Sahin', note: 'Konteyner yuklendi' },
      { id: 9, url: 'https://picsum.photos/seed/in_transit-10/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-10/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(1, 11), uploaded_by: 'Serkan Sahin', note: 'Konya gecisi tamamlandi' },
    ],
  },
  {
    id: 11, customer_id: 8, customer_name: 'Gaziantep Fistik Ihr. Bir.', vehicle_id: 6, plate_number: '07 PRS 678', origin: 'Gaziantep', destination: 'Diyarbakir', weight_kg: 13000, price: '16000.00', status: 'DISPATCHED', tracking_token: 'TRK-011-XYA', notes: '', created_at: daysAgo(2),
    photos: [
      { id: 10, url: 'https://picsum.photos/seed/loading-11/800/600', thumbnail: 'https://picsum.photos/seed/loading-11/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(2, 5), uploaded_by: 'Mustafa Ozturk', note: 'Kasa kapak kapatildi' },
    ],
  },
  {
    id: 12, customer_id: 9, customer_name: 'Trakya Cam Sanayii A.S.', vehicle_id: 7, plate_number: '33 TUV 901', origin: 'Samsun', destination: 'Erzurum', weight_kg: 3500, price: '7000.00', status: 'DISPATCHED', tracking_token: 'TRK-012-BCD', notes: '', created_at: daysAgo(1),
    photos: [
      { id: 11, url: 'https://picsum.photos/seed/loading-12/800/600', thumbnail: 'https://picsum.photos/seed/loading-12/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(1, 7), uploaded_by: 'Burak Arslan', note: 'Palet yukleme tamamlandi' },
      { id: 12, url: 'https://picsum.photos/seed/in_transit-12/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-12/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(0, 16), uploaded_by: 'Burak Arslan', note: 'Erzincan girisinde mola' },
    ],
  },
  {
    id: 13, customer_id: 10, customer_name: 'Dicle Elektrik Dagitim', vehicle_id: 1, plate_number: '34 ABC 123', origin: 'Istanbul', destination: 'Kayseri', weight_kg: 14000, price: '21000.00', status: 'DISPATCHED', tracking_token: 'TRK-013-EFG', notes: 'Oncelikli sevkiyat', created_at: daysAgo(1),
    photos: [
      { id: 13, url: 'https://picsum.photos/seed/loading-13/800/600', thumbnail: 'https://picsum.photos/seed/loading-13/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(1, 5), uploaded_by: 'Ahmet Yilmaz', note: 'Konteyner yuklendi' },
    ],
  },

  // 12 DELIVERED
  {
    id: 14, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 8, plate_number: '34 XYZ 234', origin: 'Istanbul', destination: 'Ankara', weight_kg: 22000, price: '28000.00', status: 'DELIVERED', tracking_token: 'TRK-014-HIJ', notes: '', created_at: daysAgo(25),
    photos: [
      { id: 14, url: 'https://picsum.photos/seed/loading-14/800/600', thumbnail: 'https://picsum.photos/seed/loading-14/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(25, 6), uploaded_by: 'Hasan Dogan', note: 'Palet yukleme tamamlandi' },
      { id: 15, url: 'https://picsum.photos/seed/in_transit-14/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-14/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(24, 14), uploaded_by: 'Hasan Dogan', note: 'Bolu tunelini gectik' },
      { id: 16, url: 'https://picsum.photos/seed/delivery-14/800/600', thumbnail: 'https://picsum.photos/seed/delivery-14/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(24, 18), uploaded_by: 'Hasan Dogan', note: 'Teslim edildi - imza alindi' },
      { id: 17, url: 'https://picsum.photos/seed/document-14/800/600', thumbnail: 'https://picsum.photos/seed/document-14/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(24, 19), uploaded_by: 'Hasan Dogan', note: 'Irsaliye imzalandi' },
    ],
  },
  {
    id: 15, customer_id: 1, customer_name: 'Yildiz Holding Lojistik', vehicle_id: 9, plate_number: '06 AAA 567', origin: 'Ankara', destination: 'Izmir', weight_kg: 11000, price: '16000.00', status: 'DELIVERED', tracking_token: 'TRK-015-KLM', notes: '', created_at: daysAgo(23),
    photos: [
      { id: 18, url: 'https://picsum.photos/seed/loading-15/800/600', thumbnail: 'https://picsum.photos/seed/loading-15/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(23, 7), uploaded_by: 'Osman Kilic', note: 'Konteyner yuklendi' },
      { id: 19, url: 'https://picsum.photos/seed/in_transit-15/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-15/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(22, 12), uploaded_by: 'Osman Kilic', note: 'Afyon gecisi - mola' },
      { id: 20, url: 'https://picsum.photos/seed/delivery-15/800/600', thumbnail: 'https://picsum.photos/seed/delivery-15/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(22, 20), uploaded_by: 'Osman Kilic', note: 'Depoya birakildi' },
    ],
  },
  {
    id: 16, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 10, plate_number: '35 BBB 890', origin: 'Istanbul', destination: 'Bursa', weight_kg: 9000, price: '5500.00', status: 'DELIVERED', tracking_token: 'TRK-016-NOP', notes: '', created_at: daysAgo(22),
    photos: [
      { id: 21, url: 'https://picsum.photos/seed/loading-16/800/600', thumbnail: 'https://picsum.photos/seed/loading-16/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(22, 5), uploaded_by: 'Ibrahim Yildiz', note: 'Kasa kapak kapatildi' },
      { id: 22, url: 'https://picsum.photos/seed/in_transit-16/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-16/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(21, 10), uploaded_by: 'Ibrahim Yildiz', note: 'Yalova feribot gecisi' },
      { id: 23, url: 'https://picsum.photos/seed/delivery-16/800/600', thumbnail: 'https://picsum.photos/seed/delivery-16/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(21, 15), uploaded_by: 'Ibrahim Yildiz', note: 'Musteri teslim aldi' },
      { id: 24, url: 'https://picsum.photos/seed/document-16/800/600', thumbnail: 'https://picsum.photos/seed/document-16/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(21, 16), uploaded_by: 'Ibrahim Yildiz', note: 'CMR belgesi' },
    ],
  },
  {
    id: 17, customer_id: 2, customer_name: 'Anadolu Efes Dagitim', vehicle_id: 8, plate_number: '34 XYZ 234', origin: 'Ankara', destination: 'Konya', weight_kg: 14000, price: '11000.00', status: 'DELIVERED', tracking_token: 'TRK-017-QRS', notes: '', created_at: daysAgo(20),
    photos: [
      { id: 25, url: 'https://picsum.photos/seed/loading-17/800/600', thumbnail: 'https://picsum.photos/seed/loading-17/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(20, 8), uploaded_by: 'Hasan Dogan', note: 'Palet yukleme tamamlandi' },
      { id: 26, url: 'https://picsum.photos/seed/in_transit-17/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-17/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(19, 13), uploaded_by: 'Hasan Dogan', note: 'Tuz Golu mevkii gecildi' },
      { id: 27, url: 'https://picsum.photos/seed/delivery-17/800/600', thumbnail: 'https://picsum.photos/seed/delivery-17/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(19, 17), uploaded_by: 'Hasan Dogan', note: 'Teslim edildi - imza alindi' },
    ],
  },
  {
    id: 18, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 11, plate_number: '42 CCC 123', origin: 'Istanbul', destination: 'Trabzon', weight_kg: 2500, price: '9500.00', status: 'DELIVERED', tracking_token: 'TRK-018-TUV', notes: '', created_at: daysAgo(18),
    photos: [
      { id: 28, url: 'https://picsum.photos/seed/loading-18/800/600', thumbnail: 'https://picsum.photos/seed/loading-18/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(18, 6), uploaded_by: 'Kemal Kurt', note: 'Konteyner yuklendi' },
      { id: 29, url: 'https://picsum.photos/seed/in_transit-18/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-18/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(17, 9), uploaded_by: 'Kemal Kurt', note: 'Bolu tunelini gectik' },
      { id: 30, url: 'https://picsum.photos/seed/delivery-18/800/600', thumbnail: 'https://picsum.photos/seed/delivery-18/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(16, 16), uploaded_by: 'Kemal Kurt', note: 'Depoya birakildi' },
      { id: 31, url: 'https://picsum.photos/seed/document-18/800/600', thumbnail: 'https://picsum.photos/seed/document-18/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(16, 17), uploaded_by: 'Kemal Kurt', note: 'Kantar fisii' },
    ],
  },
  {
    id: 19, customer_id: 4, customer_name: 'Ege Seramik San. Tic.', vehicle_id: 13, plate_number: '27 EEE 789', origin: 'Izmir', destination: 'Ankara', weight_kg: 19000, price: '24000.00', status: 'DELIVERED', tracking_token: 'TRK-019-WXY', notes: '', created_at: daysAgo(17),
    photos: [
      { id: 32, url: 'https://picsum.photos/seed/loading-19/800/600', thumbnail: 'https://picsum.photos/seed/loading-19/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(17, 5), uploaded_by: 'Emre Polat', note: 'Kasa kapak kapatildi' },
      { id: 33, url: 'https://picsum.photos/seed/in_transit-19/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-19/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(16, 11), uploaded_by: 'Emre Polat', note: 'Afyon gecisi - mola' },
      { id: 34, url: 'https://picsum.photos/seed/delivery-19/800/600', thumbnail: 'https://picsum.photos/seed/delivery-19/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(16, 19), uploaded_by: 'Emre Polat', note: 'Musteri teslim aldi' },
      { id: 35, url: 'https://picsum.photos/seed/document-19/800/600', thumbnail: 'https://picsum.photos/seed/document-19/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(16, 20), uploaded_by: 'Emre Polat', note: 'Irsaliye imzalandi' },
    ],
  },
  {
    id: 20, customer_id: 5, customer_name: 'Caykur Genel Mudurlugu', vehicle_id: 14, plate_number: '55 FFF 012', origin: 'Trabzon', destination: 'Samsun', weight_kg: 6000, price: '4500.00', status: 'DELIVERED', tracking_token: 'TRK-020-ZAB', notes: '', created_at: daysAgo(15),
    photos: [
      { id: 36, url: 'https://picsum.photos/seed/loading-20/800/600', thumbnail: 'https://picsum.photos/seed/loading-20/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(15, 7), uploaded_by: 'Serkan Sahin', note: 'Palet yukleme tamamlandi' },
      { id: 37, url: 'https://picsum.photos/seed/in_transit-20/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-20/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(14, 13), uploaded_by: 'Serkan Sahin', note: 'Giresun sahil yolu' },
      { id: 38, url: 'https://picsum.photos/seed/delivery-20/800/600', thumbnail: 'https://picsum.photos/seed/delivery-20/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(14, 17), uploaded_by: 'Serkan Sahin', note: 'Teslim edildi - imza alindi' },
    ],
  },
  {
    id: 21, customer_id: 6, customer_name: 'Karsan Otomotiv A.S.', vehicle_id: 12, plate_number: '01 DDD 456', origin: 'Bursa', destination: 'Istanbul', weight_kg: 1200, price: '3000.00', status: 'DELIVERED', tracking_token: 'TRK-021-CDE', notes: '', created_at: daysAgo(14),
    photos: [
      { id: 39, url: 'https://picsum.photos/seed/loading-21/800/600', thumbnail: 'https://picsum.photos/seed/loading-21/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(14, 8), uploaded_by: 'Emre Polat', note: 'Konteyner yuklendi' },
      { id: 40, url: 'https://picsum.photos/seed/in_transit-21/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-21/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(13, 10), uploaded_by: 'Emre Polat', note: 'Osmangazi Koprusu gecildi' },
      { id: 41, url: 'https://picsum.photos/seed/delivery-21/800/600', thumbnail: 'https://picsum.photos/seed/delivery-21/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(13, 14), uploaded_by: 'Emre Polat', note: 'Depoya birakildi' },
      { id: 42, url: 'https://picsum.photos/seed/document-21/800/600', thumbnail: 'https://picsum.photos/seed/document-21/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(13, 15), uploaded_by: 'Emre Polat', note: 'CMR belgesi' },
    ],
  },
  {
    id: 22, customer_id: 7, customer_name: 'Antalya Tarim Kredi', vehicle_id: 15, plate_number: '61 GGG 345', origin: 'Antalya', destination: 'Mersin', weight_kg: 3000, price: '5000.00', status: 'DELIVERED', tracking_token: 'TRK-022-FGH', notes: '', created_at: daysAgo(12),
    photos: [
      { id: 43, url: 'https://picsum.photos/seed/loading-22/800/600', thumbnail: 'https://picsum.photos/seed/loading-22/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(12, 6), uploaded_by: 'Mustafa Ozturk', note: 'Kasa kapak kapatildi' },
      { id: 44, url: 'https://picsum.photos/seed/in_transit-22/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-22/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(11, 11), uploaded_by: 'Mustafa Ozturk', note: 'Alanya gecisi - sahil yolu' },
      { id: 45, url: 'https://picsum.photos/seed/delivery-22/800/600', thumbnail: 'https://picsum.photos/seed/delivery-22/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(11, 16), uploaded_by: 'Mustafa Ozturk', note: 'Musteri teslim aldi' },
    ],
  },
  {
    id: 23, customer_id: 8, customer_name: 'Gaziantep Fistik Ihr. Bir.', vehicle_id: 16, plate_number: '38 HHH 678', origin: 'Gaziantep', destination: 'Adana', weight_kg: 1500, price: '4000.00', status: 'DELIVERED', tracking_token: 'TRK-023-IJK', notes: '', created_at: daysAgo(10),
    photos: [
      { id: 46, url: 'https://picsum.photos/seed/loading-23/800/600', thumbnail: 'https://picsum.photos/seed/loading-23/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(10, 7), uploaded_by: 'Burak Arslan', note: 'Palet yukleme tamamlandi' },
      { id: 47, url: 'https://picsum.photos/seed/in_transit-23/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-23/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(9, 12), uploaded_by: 'Burak Arslan', note: 'Osmaniye mevkii gecildi' },
      { id: 48, url: 'https://picsum.photos/seed/delivery-23/800/600', thumbnail: 'https://picsum.photos/seed/delivery-23/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(9, 16), uploaded_by: 'Burak Arslan', note: 'Teslim edildi - imza alindi' },
      { id: 49, url: 'https://picsum.photos/seed/document-23/800/600', thumbnail: 'https://picsum.photos/seed/document-23/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(9, 17), uploaded_by: 'Burak Arslan', note: 'Kantar fisii' },
    ],
  },
  {
    id: 24, customer_id: 3, customer_name: 'Borusan Lojistik A.S.', vehicle_id: 9, plate_number: '06 AAA 567', origin: 'Istanbul', destination: 'Kayseri', weight_kg: 12000, price: '19000.00', status: 'DELIVERED', tracking_token: 'TRK-024-LMN', notes: '', created_at: daysAgo(9),
    photos: [
      { id: 50, url: 'https://picsum.photos/seed/loading-24/800/600', thumbnail: 'https://picsum.photos/seed/loading-24/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(9, 5), uploaded_by: 'Osman Kilic', note: 'Konteyner yuklendi' },
      { id: 51, url: 'https://picsum.photos/seed/in_transit-24/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-24/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(8, 14), uploaded_by: 'Osman Kilic', note: 'Ankara cikisi' },
      { id: 52, url: 'https://picsum.photos/seed/delivery-24/800/600', thumbnail: 'https://picsum.photos/seed/delivery-24/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(8, 20), uploaded_by: 'Osman Kilic', note: 'Depoya birakildi' },
      { id: 53, url: 'https://picsum.photos/seed/document-24/800/600', thumbnail: 'https://picsum.photos/seed/document-24/200/150', type: 'DOCUMENT', label: 'Belge', timestamp: daysAgoHours(8, 21), uploaded_by: 'Osman Kilic', note: 'Irsaliye imzalandi' },
    ],
  },
  {
    id: 25, customer_id: 4, customer_name: 'Ege Seramik San. Tic.', vehicle_id: 10, plate_number: '35 BBB 890', origin: 'Izmir', destination: 'Eskisehir', weight_kg: 17000, price: '20000.00', status: 'DELIVERED', tracking_token: 'TRK-025-OPQ', notes: '', created_at: daysAgo(7),
    photos: [
      { id: 54, url: 'https://picsum.photos/seed/loading-25/800/600', thumbnail: 'https://picsum.photos/seed/loading-25/200/150', type: 'LOADING', label: 'Yukleme', timestamp: daysAgoHours(7, 6), uploaded_by: 'Ibrahim Yildiz', note: 'Kasa kapak kapatildi' },
      { id: 55, url: 'https://picsum.photos/seed/in_transit-25/800/600', thumbnail: 'https://picsum.photos/seed/in_transit-25/200/150', type: 'IN_TRANSIT', label: 'Yolda', timestamp: daysAgoHours(6, 10), uploaded_by: 'Ibrahim Yildiz', note: 'Kutahya girisinde yakit molasi' },
      { id: 56, url: 'https://picsum.photos/seed/delivery-25/800/600', thumbnail: 'https://picsum.photos/seed/delivery-25/200/150', type: 'DELIVERY', label: 'Teslimat', timestamp: daysAgoHours(6, 15), uploaded_by: 'Ibrahim Yildiz', note: 'Musteri teslim aldi' },
    ],
  },

  // 3 CANCELLED
  { id: 26, customer_id: 9, customer_name: 'Trakya Cam Sanayii A.S.', vehicle_id: null, plate_number: null, origin: 'Edirne', destination: 'Istanbul', weight_kg: 4000, price: '3500.00', status: 'CANCELLED', tracking_token: 'TRK-026-RST', notes: 'Musteri iptal etti', created_at: daysAgo(20) },
  { id: 27, customer_id: 10, customer_name: 'Dicle Elektrik Dagitim', vehicle_id: null, plate_number: null, origin: 'Diyarbakir', destination: 'Ankara', weight_kg: 8000, price: '15000.00', status: 'CANCELLED', tracking_token: 'TRK-027-UVW', notes: 'Hava kosullari', created_at: daysAgo(15) },
  { id: 28, customer_id: 5, customer_name: 'Caykur Genel Mudurlugu', vehicle_id: null, plate_number: null, origin: 'Trabzon', destination: 'Gaziantep', weight_kg: 11000, price: '25000.00', status: 'CANCELLED', tracking_token: 'TRK-028-XYZ', notes: 'Rota mevcut degil', created_at: daysAgo(8) },
];
