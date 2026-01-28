import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const routeHandlers = [
  // GET /api/routes/
  http.get(`${API}routes/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.routes];
    items = filterBySearch(items, params.search, ['name', 'vehicle_plate', 'driver_name']);
    items = filterByField(items, 'status', params.status);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/routes/:id/
  http.get(`${API}routes/:id/`, async ({ params }) => {
    await delay(100);
    const route = db.routes.find((r) => r.id === Number(params.id));
    if (!route) {
      return HttpResponse.json({ detail: 'Rota bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(route);
  }),

  // POST /api/routes/
  http.post(`${API}routes/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;
    const driver = body.driver_id ? db.drivers.find((d) => d.id === Number(body.driver_id)) : null;
    const shipmentIds = body.shipment_ids || [];

    // Build stops from shipments
    const stops = shipmentIds.map((sid, i) => {
      const s = db.shipments.find((sh) => sh.id === Number(sid));
      return {
        id: nextId(),
        sequence: i + 1,
        shipment_id: Number(sid),
        shipment_origin: s ? s.origin : '',
        shipment_destination: s ? s.destination : '',
      };
    });

    const newRoute = {
      id: nextId(),
      name: body.name || '',
      vehicle_id: vehicle ? vehicle.id : null,
      vehicle_plate: vehicle ? vehicle.plate_number : null,
      driver_id: driver ? driver.id : null,
      driver_name: driver ? `${driver.first_name} ${driver.last_name}` : null,
      planned_date: body.planned_date || '',
      status: 'PLANNED',
      stops_count: stops.length,
      total_distance_km: (Math.random() * 800 + 100).toFixed(2),
      total_duration_mins: Math.floor(Math.random() * 600 + 120),
      shipment_ids: shipmentIds.map(Number),
      stops,
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    db.routes.push(newRoute);
    return HttpResponse.json(newRoute, { status: 201 });
  }),

  // POST /api/routes/:id/optimize/
  http.post(`${API}routes/:id/optimize/`, async ({ params }) => {
    await delay(300);
    const route = db.routes.find((r) => r.id === Number(params.id));
    if (!route) {
      return HttpResponse.json({ detail: 'Rota bulunamadi.' }, { status: 404 });
    }
    // Reduce distance by ~15%
    const currentDist = parseFloat(route.total_distance_km);
    route.total_distance_km = (currentDist * 0.85).toFixed(2);
    route.total_duration_mins = Math.floor(route.total_duration_mins * 0.87);
    return HttpResponse.json(route);
  }),

  // DELETE /api/routes/:id/
  http.delete(`${API}routes/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.routes.findIndex((r) => r.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Rota bulunamadi.' }, { status: 404 });
    }
    db.routes.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
