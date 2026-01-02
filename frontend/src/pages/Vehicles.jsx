import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton 
} from '@mui/material';
import { Add, Delete, Edit, LocalShipping } from '@mui/icons-material';
import { getVehicles, deleteVehicle } from '../services/logistics';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Araçlar yüklenemedi:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu aracı filodan silmek istediğine emin misin?")) {
      try {
        await deleteVehicle(id);
        loadVehicles();
      } catch (error) {
        alert("Silme işlemi başarısız!");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalShipping fontSize="large" /> Filo Yönetimi
        </Typography>
        <Button variant="contained" startIcon={<Add />} color="primary">
          Yeni Araç Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1e1e1e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Plaka</TableCell>
              <TableCell sx={{ color: 'white' }}>Marka/Model</TableCell>
              <TableCell sx={{ color: 'white' }}>Tip</TableCell>
              <TableCell sx={{ color: 'white' }}>Kapasite</TableCell>
              <TableCell sx={{ color: 'white' }}>Durum</TableCell>
              <TableCell sx={{ color: 'white' }} align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell sx={{ fontWeight: 'bold' }}>{vehicle.plate_number}</TableCell>
                <TableCell>{vehicle.brand} ({vehicle.model_year})</TableCell>
                <TableCell>{vehicle.vehicle_type}</TableCell>
                <TableCell>{vehicle.capacity_kg} kg</TableCell>
                <TableCell>
                  <Chip 
                    label={vehicle.status} 
                    color={vehicle.status === 'TRANSIT' ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small"><Edit /></IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(vehicle.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Henüz kayıtlı araç yok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Vehicles;
