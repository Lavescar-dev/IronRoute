import random
import numpy as np

class DataGenerator:
    def __init__(self):
        print("[Generator] Simülasyon motoru ısıtılıyor...")
        # Sabit araç listesi (Veritabanı simülasyonu)
        self.truck_ids = [f"TR-{random.randint(100, 999)}" for _ in range(5)]

    def get_delivery_stats(self):
        """
        Rastgele teslimat istatistikleri üretir.
        Her çağrıldığında sayılar değişir, canlı sistem hissi verir.
        """
        return {
            'Teslim Edildi': random.randint(100, 200),
            'Yolda': random.randint(30, 80),
            'Hazırlanıyor': random.randint(10, 50),
            'İade': random.randint(0, 10),
            'Geciken': random.randint(0, 5) # KPI metriği
        }

    def get_warehouse_matrix(self):
        """
        Depo doluluk oranlarını simüle eden 10x10 matris.
        Factorio'daki maden rezervleri gibi değişken.
        """
        # 0 ile 100 arasında rastgele doluluk oranları
        return np.random.randint(0, 100, size=(10, 10))

    def get_fleet_telemetry(self):
        """
        Araçlardan geliyormuş gibi GPS ve Hız verisi üretir.
        İleride harita modülü için kullanılacak.
        """
        telemetry = []
        for truck in self.truck_ids:
            telemetry.append({
                'id': truck,
                'speed': random.randint(0, 90), # km/h
                'fuel': random.randint(10, 100), # %
                'lat': 41.0 + random.uniform(-0.1, 0.1), # İstanbul civarı
                'lon': 29.0 + random.uniform(-0.1, 0.1)
            })
        return telemetry
