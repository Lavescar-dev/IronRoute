import api from './api';

export const getVehicles = async () => {
  const response = await api.get('vehicles/');
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post('vehicles/', vehicleData);
  return response.data;
};

export const deleteVehicle = async (id) => {
  await api.delete(`vehicles/${id}/`);
};