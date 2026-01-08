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
  tagTypes: ['Vehicle', 'Driver', 'Shipment', 'Customer', 'Dashboard'],
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
} = apiSlice;
