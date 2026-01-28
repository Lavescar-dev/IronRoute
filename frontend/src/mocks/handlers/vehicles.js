import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const vehicleHandlers = [
  // GET /api/vehicles/
  http.get(`${API}vehicles/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.vehicles];

    // Search
    items = filterBySearch(items, params.search, ['plate_number', 'brand', 'vehicle_type']);
    // Filter by status
    items = filterByField(items, 'status', params.status);
    // Filter by type
    items = filterByField(items, 'vehicle_type', params.vehicle_type);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/vehicles/:id/
  http.get(`${API}vehicles/:id/`, async ({ params }) => {
    await delay(100);
    const vehicle = db.vehicles.find((v) => v.id === Number(params.id));
    if (!vehicle) {
      return HttpResponse.json({ detail: 'Arac bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(vehicle);
  }),

  // POST /api/vehicles/
  http.post(`${API}vehicles/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const newVehicle = {
      id: nextId(),
      plate_number: body.plate_number || '',
      brand: body.brand || '',
      model_year: Number(body.model_year) || new Date().getFullYear(),
      vehicle_type: body.vehicle_type || 'TRUCK',
      capacity_kg: Number(body.capacity_kg) || 0,
      status: 'IDLE',
      current_lat: 39.9334 + (Math.random() - 0.5) * 2,
      current_lng: 32.8597 + (Math.random() - 0.5) * 4,
      created_at: new Date().toISOString(),
    };
    db.vehicles.push(newVehicle);
    return HttpResponse.json(newVehicle, { status: 201 });
  }),

  // PUT /api/vehicles/:id/
  http.put(`${API}vehicles/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.vehicles.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Arac bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    db.vehicles[idx] = {
      ...db.vehicles[idx],
      plate_number: body.plate_number ?? db.vehicles[idx].plate_number,
      brand: body.brand ?? db.vehicles[idx].brand,
      model_year: body.model_year != null ? Number(body.model_year) : db.vehicles[idx].model_year,
      vehicle_type: body.vehicle_type ?? db.vehicles[idx].vehicle_type,
      capacity_kg: body.capacity_kg != null ? Number(body.capacity_kg) : db.vehicles[idx].capacity_kg,
      status: body.status ?? db.vehicles[idx].status,
    };
    return HttpResponse.json(db.vehicles[idx]);
  }),

  // DELETE /api/vehicles/:id/
  http.delete(`${API}vehicles/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.vehicles.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Arac bulunamadi.' }, { status: 404 });
    }
    db.vehicles.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/vehicles/:id/latest_location/
  http.get(`${API}vehicles/:id/latest_location/`, async ({ params }) => {
    await delay(100);
    const vehicleId = Number(params.id);
    const vehicle = db.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      return HttpResponse.json({ detail: 'Arac bulunamadi.' }, { status: 404 });
    }

    // Find most recent location record
    const locations = db.vehicleLocations
      .filter((l) => l.vehicle === vehicleId)
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

    if (locations.length > 0) {
      return HttpResponse.json(locations[0]);
    }

    return HttpResponse.json({
      id: 0,
      vehicle: vehicleId,
      latitude: vehicle.current_lat,
      longitude: vehicle.current_lng,
      speed: 0,
      heading: 0,
      recorded_at: new Date().toISOString(),
    });
  }),
];
