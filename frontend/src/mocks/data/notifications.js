function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

export const notifications = [
  // 5 unread
  { id: 1, type: 'INFO', title: 'Yeni sevkiyat olusturuldu', message: 'Istanbul - Gaziantep hatti icin yeni sevkiyat (#6) olusturuldu.', is_read: false, created_at: hoursAgo(1) },
  { id: 2, type: 'WARNING', title: 'Arac bakima alindi', message: '34 KKK 901 plakali arac motor arizasi nedeniyle bakima alindi.', is_read: false, created_at: hoursAgo(2) },
  { id: 3, type: 'SUCCESS', title: 'Teslimat tamamlandi', message: 'Istanbul - Ankara sevkiyati (#14) basariyla teslim edildi.', is_read: false, created_at: hoursAgo(4) },
  { id: 4, type: 'ERROR', title: 'Fatura gecikti', message: 'FTR-2024-010 numarali faturanin odeme suresi gecmistir.', is_read: false, created_at: hoursAgo(6) },
  { id: 5, type: 'INFO', title: 'Rota optimizasyonu', message: 'Istanbul - Ankara Hatti rotasi optimize edildi. Mesafe %12 azaldi.', is_read: false, created_at: hoursAgo(8) },

  // 10 read
  { id: 6, type: 'SUCCESS', title: 'Odeme alindi', message: 'Yildiz Lojistik A.S. FTR-2024-001 numarali faturayi odedi.', is_read: true, created_at: daysAgo(1) },
  { id: 7, type: 'INFO', title: 'Yeni musteri eklendi', message: 'Guneydogu Nakliye sisteme eklendi.', is_read: true, created_at: daysAgo(1) },
  { id: 8, type: 'WARNING', title: 'Yakit seviyesi dusuk', message: '06 DEF 456 plakali aracin yakit seviyesi %15 altina dustu.', is_read: true, created_at: daysAgo(2) },
  { id: 9, type: 'INFO', title: 'Surucu atandi', message: 'Ahmet Yilmaz, 34 ABC 123 plakali araca atandi.', is_read: true, created_at: daysAgo(2) },
  { id: 10, type: 'SUCCESS', title: 'Bakim tamamlandi', message: '35 BBB 890 plakali aracin lastik degisimi tamamlandi.', is_read: true, created_at: daysAgo(3) },
  { id: 11, type: 'ERROR', title: 'Sevkiyat iptal edildi', message: 'Edirne - Istanbul sevkiyati (#26) musteri tarafindan iptal edildi.', is_read: true, created_at: daysAgo(4) },
  { id: 12, type: 'INFO', title: 'Rota olusturuldu', message: 'Gaziantep - Diyarbakir Dogu rotasi planlanmistir.', is_read: true, created_at: daysAgo(5) },
  { id: 13, type: 'WARNING', title: 'Muayene yaklasiyor', message: '55 FFF 012 plakali aracin yillik muayene tarihi yaklasıyor.', is_read: true, created_at: daysAgo(6) },
  { id: 14, type: 'SUCCESS', title: 'Teslimat tamamlandi', message: 'Izmir - Ankara sevkiyati (#19) basariyla teslim edildi.', is_read: true, created_at: daysAgo(7) },
  { id: 15, type: 'INFO', title: 'Sistem guncellendi', message: 'IronRoute v1.0.0 basariyla guncellendi.', is_read: true, created_at: daysAgo(10) },
];
