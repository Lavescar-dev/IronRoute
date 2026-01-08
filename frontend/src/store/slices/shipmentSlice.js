/**
 * Shipment Slice
 *
 * Manages shipments and customers state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===========================================
// INITIAL STATE
// ===========================================

const initialState = {
  shipments: [],
  customers: [],
  selectedShipment: null,
  selectedCustomer: null,
  shipmentsLoading: false,
  customersLoading: false,
  error: null,
  stats: {
    pending: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  },
  filters: {
    status: 'all',
    customerId: null,
    dateRange: null,
    search: '',
  },
};

// ===========================================
// ASYNC THUNKS - SHIPMENTS
// ===========================================

export const fetchShipments = createAsyncThunk(
  'shipment/fetchShipments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/shipments/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Sevkiyatlar yuklenemedi'
      );
    }
  }
);

export const createShipment = createAsyncThunk(
  'shipment/createShipment',
  async (shipmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/shipments/', shipmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Sevkiyat olusturulamadi'
      );
    }
  }
);

export const updateShipment = createAsyncThunk(
  'shipment/updateShipment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/shipments/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Sevkiyat guncellenemedi'
      );
    }
  }
);

export const updateShipmentStatus = createAsyncThunk(
  'shipment/updateShipmentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/shipments/${id}/`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Durum guncellenemedi'
      );
    }
  }
);

export const deleteShipment = createAsyncThunk(
  'shipment/deleteShipment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/shipments/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Sevkiyat silinemedi'
      );
    }
  }
);

// ===========================================
// ASYNC THUNKS - CUSTOMERS
// ===========================================

export const fetchCustomers = createAsyncThunk(
  'shipment/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/customers/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Musteriler yuklenemedi'
      );
    }
  }
);

export const createCustomer = createAsyncThunk(
  'shipment/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await api.post('/customers/', customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Musteri olusturulamadi'
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'shipment/updateCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/customers/${id}/`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Musteri guncellenemedi'
      );
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'shipment/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Musteri silinemedi'
      );
    }
  }
);

// ===========================================
// ASYNC THUNKS - DASHBOARD
// ===========================================

export const fetchDashboardStats = createAsyncThunk(
  'shipment/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Istatistikler yuklenemedi'
      );
    }
  }
);

// ===========================================
// SLICE
// ===========================================

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    setSelectedShipment: (state, action) => {
      state.selectedShipment = action.payload;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shipments
      .addCase(fetchShipments.pending, (state) => {
        state.shipmentsLoading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.shipmentsLoading = false;
        if (action.payload.results) {
          state.shipments = action.payload.results;
        } else {
          state.shipments = action.payload;
        }
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.shipmentsLoading = false;
        state.error = action.payload;
      })

      // Create Shipment
      .addCase(createShipment.fulfilled, (state, action) => {
        state.shipments.unshift(action.payload);
      })

      // Update Shipment
      .addCase(updateShipment.fulfilled, (state, action) => {
        const index = state.shipments.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
      })

      // Update Shipment Status
      .addCase(updateShipmentStatus.fulfilled, (state, action) => {
        const index = state.shipments.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
      })

      // Delete Shipment
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.shipments = state.shipments.filter(
          (s) => s.id !== action.payload
        );
      })

      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.customersLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        if (action.payload.results) {
          state.customers = action.payload.results;
        } else {
          state.customers = action.payload;
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.error = action.payload;
      })

      // Create Customer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })

      // Update Customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })

      // Delete Customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
      })

      // Dashboard Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        if (action.payload.stats) {
          state.stats = {
            pending: action.payload.stats.pending || 0,
            dispatched: action.payload.stats.dispatched || 0,
            delivered: action.payload.stats.delivered || 0,
            cancelled: action.payload.stats.cancelled || 0,
            totalRevenue: action.payload.meta?.monthly_revenue || 0,
          };
        }
      });
  },
});

// ===========================================
// EXPORTS
// ===========================================

export const {
  setSelectedShipment,
  setSelectedCustomer,
  setFilters,
  clearFilters,
  clearError,
} = shipmentSlice.actions;

// Selectors
export const selectShipments = (state) => state.shipment.shipments;
export const selectCustomers = (state) => state.shipment.customers;
export const selectSelectedShipment = (state) => state.shipment.selectedShipment;
export const selectSelectedCustomer = (state) => state.shipment.selectedCustomer;
export const selectShipmentsLoading = (state) => state.shipment.shipmentsLoading;
export const selectCustomersLoading = (state) => state.shipment.customersLoading;
export const selectShipmentError = (state) => state.shipment.error;
export const selectShipmentStats = (state) => state.shipment.stats;
export const selectShipmentFilters = (state) => state.shipment.filters;

// Computed selectors
export const selectPendingShipments = (state) =>
  state.shipment.shipments.filter((s) => s.status === 'PENDING');

export const selectDispatchedShipments = (state) =>
  state.shipment.shipments.filter((s) => s.status === 'DISPATCHED');

export const selectDeliveredShipments = (state) =>
  state.shipment.shipments.filter((s) => s.status === 'DELIVERED');

export default shipmentSlice.reducer;
