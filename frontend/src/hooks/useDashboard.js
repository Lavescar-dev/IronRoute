import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/logistics';

const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Hafıza sızıntısını önler

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardStats();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError("Sunucuyla bağlantı kurulamadı.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
};

export default useDashboard;
