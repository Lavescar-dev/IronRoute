import time
from visualizer import ReportVisualizer
from data_generator import DataGenerator

def main():
    print(">>> IronRoute-Core: Otomasyon Modu Başlatıldı <<<")
    
    # Modülleri Yükle (Makineleri Kur)
    viz = ReportVisualizer()
    gen = DataGenerator()
    
    cycle_count = 0
    
    # Sonsuz Üretim Döngüsü (The Factory Must Grow)
    try:
        while True:
            cycle_count += 1
            print(f"\n--- [Döngü #{cycle_count}] Veri Akışı İşleniyor ---")
            
            # 1. Hammaddeyi Al (Generator'dan Veri Çek)
            stats = gen.get_delivery_stats()
            warehouse_grid = gen.get_warehouse_matrix()
            
            # 2. İşle (Görselleştir)
            # Teslimat Grafiği
            viz.create_delivery_status_chart(stats)
            print("   -> Teslimat durumu güncellendi.")
            
            # Depo Haritası (Matris verisini Badboy'dan alıp Visualizer'a veriyoruz)
            viz.create_warehouse_heatmap(warehouse_grid) 
            print("   -> Depo haritası güncellendi.")
            
            print(f"--- Döngü Tamamlandı. 10 Saniye Bekleniyor... ---")
            time.sleep(10) # Sistemi boğmamak için bekleme süresi

    except KeyboardInterrupt:
        print("\n>>> Sistem operatör tarafından durduruldu. Kapanıyor...")

if __name__ == "__main__":
    main()
