import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import os
from datetime import datetime

class ReportVisualizer:
    def __init__(self, output_dir='reports'):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Modern Görünüm
        sns.set_theme(style="darkgrid")
        plt.rcParams.update({'figure.max_open_warning': 0})
        print(f"[Visualizer] Grafik motoru hazır. Hedef: {self.output_dir}")

    def _save_plot(self, filename):
        path = os.path.join(self.output_dir, filename)
        plt.savefig(path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"[Visualizer] Kaydedildi: {path}")

    def create_delivery_status_chart(self, data):
        df = pd.DataFrame(list(data.items()), columns=['Durum', 'Adet'])
        plt.figure(figsize=(10, 6))
        ax = sns.barplot(x='Durum', y='Adet', data=df, palette='viridis', hue='Durum', legend=False)
        ax.set_title('Teslimat Durum Analizi', fontsize=16)
        for i in ax.containers:
            ax.bar_label(i,)
        self._save_plot(f"status_chart_{datetime.now().strftime('%H%M%S')}.png")

    def create_warehouse_heatmap(self, data=None):
        """
        data: Dışarıdan gelen 10x10 numpy matrisi. 
        Eğer veri gelmezse (None), test amaçlı rastgele üretir.
        """
        # Veri akışı kontrolü: Banttan mal geliyor mu?
        if data is None:
             warehouse_grid = np.random.randint(0, 100, size=(10, 10))
        else:
             warehouse_grid = data
             
        plt.figure(figsize=(10, 8))
        
        # Haritayı Çiz
        sns.heatmap(warehouse_grid, annot=True, fmt="d", cmap="YlOrRd", cbar_kws={'label': 'Doluluk %'})
        
        # Başlığa saati ekle (Canlılık hissi için)
        plt.title(f'Depo Isı Haritası - {datetime.now().strftime("%H:%M:%S")}', fontsize=16)
        
        self._save_plot(f"heatmap_{datetime.now().strftime('%H%M%S')}.png")
