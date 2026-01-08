import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/logistics';

// --- CUSTOM HOOK ---
// Bu arkadaşın tek işi veri getirmektir. Görsellikle ilgilenmez.
const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Hook Hatası:", err);
        setError("Veri çekilemedi. Bağlantıyı kontrol edin.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // İleride buraya "Auto-Refresh" (Otomatik yenileme) özelliği de ekleyebiliriz.
  }, []);

  return { stats, loading, error };
};

export default useDashboardStats;
