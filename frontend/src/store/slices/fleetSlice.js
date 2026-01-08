/**
 * Fleet Slice
 *
 * Manages vehicles and drivers state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===========================================
// INITIAL STATE
// ===========================================

const initialState = {
  vehicles: [],
  drivers: [],
  selectedVehicle: null,
  selectedDriver: null,
  vehiclesLoading: false,
  driversLoading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
};

// ===========================================
// ASYNC THUNKS - VEHICLES
// ===========================================

export const fetchVehicles = createAsyncThunk(
  'fleet/fetchVehicles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/vehicles/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Araclar yuklenemedi'
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  'fleet/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/vehicles/', vehicleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Arac olusturulamadi'
      );
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'fleet/updateVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/vehicles/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Arac guncellenemedi'
      );
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'fleet/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vehicles/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Arac silinemedi'
      );
    }
  }
);

// ===========================================
// ASYNC THUNKS - DRIVERS
// ===========================================

export const fetchDrivers = createAsyncThunk(
  'fleet/fetchDrivers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/drivers/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Suruculer yuklenemedi'
      );
    }
  }
);

export const createDriver = createAsyncThunk(
  'fleet/createDriver',
  async (driverData, { rejectWithValue }) => {
    try {
      const response = await api.post('/drivers/', driverData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Surucu olusturulamadi'
      );
    }
  }
);

export const updateDriver = createAsyncThunk(
  'fleet/updateDriver',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/drivers/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Surucu guncellenemedi'
      );
    }
  }
);

export const deleteDriver = createAsyncThunk(
  'fleet/deleteDriver',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/drivers/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Surucu silinemedi'
      );
    }
  }
);

// ===========================================
// SLICE
// ===========================================

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
    setSelectedDriver: (state, action) => {
      state.selectedDriver = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.vehiclesLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehiclesLoading = false;
        // Handle paginated response
        if (action.payload.results) {
          state.vehicles = action.payload.results;
          state.pagination.total = action.payload.count;
        } else {
          state.vehicles = action.payload;
        }
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.vehiclesLoading = false;
        state.error = action.payload;
      })

      // Create Vehicle
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.unshift(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Vehicle
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(
          (v) => v.id === action.payload.id
        );
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.selectedVehicle?.id === action.payload.id) {
          state.selectedVehicle = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Vehicle
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
        if (state.selectedVehicle?.id === action.payload) {
          state.selectedVehicle = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Drivers
      .addCase(fetchDrivers.pending, (state) => {
        state.driversLoading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.driversLoading = false;
        if (action.payload.results) {
          state.drivers = action.payload.results;
        } else {
          state.drivers = action.payload;
        }
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.driversLoading = false;
        state.error = action.payload;
      })

      // Create Driver
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.unshift(action.payload);
      })

      // Update Driver
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
      })

      // Delete Driver
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((d) => d.id !== action.payload);
      });
  },
});

// ===========================================
// EXPORTS
// ===========================================

export const {
  setSelectedVehicle,
  setSelectedDriver,
  setFilters,
  clearFilters,
  clearError,
  setPagination,
} = fleetSlice.actions;

// Selectors
export const selectVehicles = (state) => state.fleet.vehicles;
export const selectDrivers = (state) => state.fleet.drivers;
export const selectSelectedVehicle = (state) => state.fleet.selectedVehicle;
export const selectSelectedDriver = (state) => state.fleet.selectedDriver;
export const selectVehiclesLoading = (state) => state.fleet.vehiclesLoading;
export const selectDriversLoading = (state) => state.fleet.driversLoading;
export const selectFleetError = (state) => state.fleet.error;
export const selectFleetFilters = (state) => state.fleet.filters;
export const selectFleetPagination = (state) => state.fleet.pagination;

// Computed selectors
export const selectActiveVehicles = (state) =>
  state.fleet.vehicles.filter((v) => v.status === 'TRANSIT');

export const selectIdleVehicles = (state) =>
  state.fleet.vehicles.filter((v) => v.status === 'IDLE');

export const selectMaintenanceVehicles = (state) =>
  state.fleet.vehicles.filter((v) => v.status === 'MAINTENANCE');

export const selectAvailableDrivers = (state) =>
  state.fleet.drivers.filter((d) => d.is_available);

export default fleetSlice.reducer;
