import { useState, useEffect } from 'react';

// Başlangıç Verisi (Veritabanı gelene kadar Mock Data burada duracak)
const initialTrucks = [
  { id: 1, plate: '34 VR 123', driver: 'Ahmet Yılmaz', status: 'active', lat: 39.9334, lng: 32.8597, cargo: 'Elektronik' },
  { id: 2, plate: '06 ANK 456', driver: 'Ayşe Demir', status: 'idle', lat: 41.0082, lng: 28.9784, cargo: 'Boş' },
  { id: 3, plate: '35 IZM 789', driver: 'Mehmet Öz', status: 'active', lat: 38.4192, lng: 27.1287, cargo: 'Gıda' },
  { id: 4, plate: '07 ANT 321', driver: 'Canan Can', status: 'maintenance', lat: 36.8969, lng: 30.7133, cargo: 'Servis Dışı' },
  { id: 5, plate: '16 BUR 555', driver: 'Okan Buruk', status: 'active', lat: 40.1885, lng: 29.0610, cargo: 'Tekstil' },
];

const useTruckSimulation = () => {
  const [trucks, setTrucks] = useState(initialTrucks);

  useEffect(() => {
    // Motor Döngüsü
    const simulationInterval = setInterval(() => {
      setTrucks((currentTrucks) => 
        currentTrucks.map((truck) => {
          if (truck.status === 'active') {
            const deltaLat = (Math.random() - 0.5) * 0.01; // Gürültü Ekle
            const deltaLng = (Math.random() - 0.5) * 0.01;

            return {
              ...truck,
              lat: truck.lat + deltaLat,
              lng: truck.lng + deltaLng
            };
          }
          return truck;
        })
      );
    }, 2000); // 2 saniye tick hızı

    return () => clearInterval(simulationInterval);
  }, []);

  // Dış dünyaya sadece temiz veriyi sunuyoruz
  return trucks;
};

export default useTruckSimulation;