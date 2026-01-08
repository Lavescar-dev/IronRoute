import apiClient from '../api/client';

// --- DASHBOARD (Operasyon Merkezi) ---
export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats/');
  return response.data;
};

// --- VEHICLES (Araç Yönetimi) ---
// Hata veren 'createVehicle' ve arkadaşları burada geri dönüyor!

export const getVehicles = async () => {
  const response = await apiClient.get('/vehicles/');
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await apiClient.post('/vehicles/', vehicleData);
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await apiClient.put(`/vehicles/${id}/`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await apiClient.delete(`/vehicles/${id}/`);
  return response.data;
};

// --- SHIPMENTS (Yük Yönetimi) ---
// İleride Shipments sayfası da patlamasın diye bunları da ekliyoruz.

export const getShipments = async () => {
  const response = await apiClient.get('/shipments/');
  return response.data;
};

export const createShipment = async (shipmentData) => {
  const response = await apiClient.post('/shipments/', shipmentData);
  return response.data;
};

export const updateShipmentStatus = async (id, status) => {
  const response = await apiClient.patch(`/shipments/${id}/`, { status });
  return response.data;
};

export const deleteShipment = async (id) => {
  const response = await apiClient.delete(`/shipments/${id}/`);
  return response.data;
};
