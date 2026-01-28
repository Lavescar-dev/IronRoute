/**
 * RTK Query API Slice
 *
 * Provides automatic caching, invalidation, and data fetching
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// ===========================================
// BASE QUERY WITH AUTH
// ===========================================

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Base query with automatic token refresh
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: 'token/refresh/',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new token
        api.dispatch({
          type: 'auth/setTokens',
          payload: { accessToken: refreshResult.data.access },
        });

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        api.dispatch({ type: 'auth/logout' });
      }
    }
  }

  return result;
};

// ===========================================
// HELPER: Transform paginated response
// ===========================================

const transformPaginatedResponse = (response) => {
  // Handle paginated response from DRF
  if (response && typeof response === 'object' && 'results' in response) {
    return response.results;
  }
  // Return as-is if it's already an array
  return response || [];
};

// ===========================================
// API SLICE
// ===========================================

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Vehicle', 'Driver', 'Shipment', 'Customer', 'Dashboard', 'Notification', 'Invoice', 'Route', 'Maintenance', 'FuelRecord', 'VehicleLocation'],
  endpoints: (builder) => ({
    // ===========================================
    // DASHBOARD
    // ===========================================
    getDashboardStats: builder.query({
      query: () => 'dashboard/stats/',
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 30,
    }),

    // ===========================================
    // VEHICLES
    // ===========================================
    getVehicles: builder.query({
      query: (params) => ({
        url: 'vehicles/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Vehicle', id })),
              { type: 'Vehicle', id: 'LIST' },
            ]
          : [{ type: 'Vehicle', id: 'LIST' }],
    }),

    getVehicle: builder.query({
      query: (id) => `vehicles/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),

    createVehicle: builder.mutation({
      query: (data) => ({
        url: 'vehicles/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Vehicle', id: 'LIST' }, 'Dashboard'],
    }),

    updateVehicle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `vehicles/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        { type: 'Vehicle', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `vehicles/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Vehicle', id: 'LIST' }, 'Dashboard'],
    }),

    // ===========================================
    // DRIVERS
    // ===========================================
    getDrivers: builder.query({
      query: (params) => ({
        url: 'drivers/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Driver', id })),
              { type: 'Driver', id: 'LIST' },
            ]
          : [{ type: 'Driver', id: 'LIST' }],
    }),

    getDriver: builder.query({
      query: (id) => `drivers/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Driver', id }],
    }),

    createDriver: builder.mutation({
      query: (data) => ({
        url: 'drivers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Driver', id: 'LIST' }, 'Dashboard'],
    }),

    updateDriver: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `drivers/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Driver', id },
        { type: 'Driver', id: 'LIST' },
      ],
    }),

    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `drivers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Driver', id: 'LIST' }, 'Dashboard'],
    }),

    // ===========================================
    // SHIPMENTS
    // ===========================================
    getShipments: builder.query({
      query: (params) => ({
        url: 'shipments/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Shipment', id })),
              { type: 'Shipment', id: 'LIST' },
            ]
          : [{ type: 'Shipment', id: 'LIST' }],
    }),

    getShipment: builder.query({
      query: (id) => `shipments/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Shipment', id }],
    }),

    createShipment: builder.mutation({
      query: (data) => ({
        url: 'shipments/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Shipment', id: 'LIST' }, 'Dashboard'],
    }),

    updateShipment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `shipments/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shipment', id },
        { type: 'Shipment', id: 'LIST' },
        'Dashboard',
      ],
    }),

    updateShipmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `shipments/${id}/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shipment', id },
        { type: 'Shipment', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteShipment: builder.mutation({
      query: (id) => ({
        url: `shipments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Shipment', id: 'LIST' }, 'Dashboard'],
    }),

    // ===========================================
    // CUSTOMERS
    // ===========================================
    getCustomers: builder.query({
      query: (params) => ({
        url: 'customers/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Customer', id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),

    getCustomer: builder.query({
      query: (id) => `customers/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation({
      query: (data) => ({
        url: 'customers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `customers/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    // ===========================================
    // NOTIFICATIONS
    // ===========================================
    getNotifications: builder.query({
      query: (params) => ({
        url: 'notifications/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Notification', id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    getUnreadNotificationsCount: builder.query({
      query: () => 'notifications/unread_count/',
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark_read/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: 'notifications/mark_all_read/',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    // ===========================================
    // INVOICES
    // ===========================================
    getInvoices: builder.query({
      query: (params) => ({
        url: 'invoices/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Invoice', id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),

    getInvoice: builder.query({
      query: (id) => `invoices/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    createInvoice: builder.mutation({
      query: (data) => ({
        url: 'invoices/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }, 'Dashboard'],
    }),

    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `invoices/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
      ],
    }),

    markInvoicePaid: builder.mutation({
      query: (id) => ({
        url: `invoices/${id}/mark_paid/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `invoices/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),

    // ===========================================
    // ROUTES
    // ===========================================
    getRoutes: builder.query({
      query: (params) => ({
        url: 'routes/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Route', id })),
              { type: 'Route', id: 'LIST' },
            ]
          : [{ type: 'Route', id: 'LIST' }],
    }),

    getRoute: builder.query({
      query: (id) => `routes/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Route', id }],
    }),

    createRoute: builder.mutation({
      query: (data) => ({
        url: 'routes/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Route', id: 'LIST' }],
    }),

    optimizeRoute: builder.mutation({
      query: (id) => ({
        url: `routes/${id}/optimize/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Route', id },
        { type: 'Route', id: 'LIST' },
      ],
    }),

    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `routes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Route', id: 'LIST' }],
    }),

    // ===========================================
    // MAINTENANCE
    // ===========================================
    getMaintenanceRecords: builder.query({
      query: (params) => ({
        url: 'maintenance/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Maintenance', id })),
              { type: 'Maintenance', id: 'LIST' },
            ]
          : [{ type: 'Maintenance', id: 'LIST' }],
    }),

    getArchivedMaintenance: builder.query({
      query: (vehicleId) => ({
        url: 'maintenance/archive/',
        params: { vehicle_id: vehicleId },
      }),
      keepUnusedDataFor: 300,
    }),

    getMaintenanceRecord: builder.query({
      query: (id) => `maintenance/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Maintenance', id }],
    }),

    createMaintenanceRecord: builder.mutation({
      query: (data) => ({
        url: 'maintenance/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Maintenance', id: 'LIST' }, { type: 'Vehicle', id: 'LIST' }],
    }),

    updateMaintenanceRecord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `maintenance/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Maintenance', id },
        { type: 'Maintenance', id: 'LIST' },
      ],
    }),

    deleteMaintenanceRecord: builder.mutation({
      query: (id) => ({
        url: `maintenance/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Maintenance', id: 'LIST' }],
    }),

    // ===========================================
    // FUEL RECORDS
    // ===========================================
    getFuelRecords: builder.query({
      query: (params) => ({
        url: 'fuel-records/',
        params,
      }),
      transformResponse: transformPaginatedResponse,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'FuelRecord', id })),
              { type: 'FuelRecord', id: 'LIST' },
            ]
          : [{ type: 'FuelRecord', id: 'LIST' }],
    }),

    createFuelRecord: builder.mutation({
      query: (data) => ({
        url: 'fuel-records/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'FuelRecord', id: 'LIST' }, { type: 'Vehicle', id: 'LIST' }],
    }),

    // ===========================================
    // VEHICLE LOCATIONS (GPS)
    // ===========================================
    getVehicleLocations: builder.query({
      query: (vehicleId) => `vehicle-locations/?vehicle=${vehicleId}`,
      transformResponse: transformPaginatedResponse,
      providesTags: ['VehicleLocation'],
    }),

    getLatestVehicleLocation: builder.query({
      query: (vehicleId) => `vehicles/${vehicleId}/latest_location/`,
      providesTags: (result, error, vehicleId) => [{ type: 'VehicleLocation', id: vehicleId }],
    }),

    // ===========================================
    // PUBLIC TRACKING
    // ===========================================
    trackShipment: builder.query({
      query: (token) => `shipments/track/${token}/`,
    }),
  }),
});

// ===========================================
// EXPORTS
// ===========================================

export const {
  // Dashboard
  useGetDashboardStatsQuery,

  // Vehicles
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,

  // Drivers
  useGetDriversQuery,
  useGetDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,

  // Shipments
  useGetShipmentsQuery,
  useGetShipmentQuery,
  useCreateShipmentMutation,
  useUpdateShipmentMutation,
  useUpdateShipmentStatusMutation,
  useDeleteShipmentMutation,

  // Customers
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  // Notifications
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,

  // Invoices
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useMarkInvoicePaidMutation,
  useDeleteInvoiceMutation,

  // Routes
  useGetRoutesQuery,
  useGetRouteQuery,
  useCreateRouteMutation,
  useOptimizeRouteMutation,
  useDeleteRouteMutation,

  // Maintenance
  useGetMaintenanceRecordsQuery,
  useLazyGetArchivedMaintenanceQuery,
  useGetMaintenanceRecordQuery,
  useCreateMaintenanceRecordMutation,
  useUpdateMaintenanceRecordMutation,
  useDeleteMaintenanceRecordMutation,

  // Fuel Records
  useGetFuelRecordsQuery,
  useCreateFuelRecordMutation,

  // Vehicle Locations
  useGetVehicleLocationsQuery,
  useGetLatestVehicleLocationQuery,

  // Public Tracking
  useTrackShipmentQuery,
} = apiSlice;
