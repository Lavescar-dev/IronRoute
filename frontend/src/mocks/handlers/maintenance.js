import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const maintenanceHandlers = [
  // GET /api/maintenance/
  http.get(`${API}maintenance/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.maintenance];
    items = filterBySearch(items, params.search, ['vehicle_plate', 'description', 'service_provider']);
    items = filterByField(items, 'status', params.status);
    items = filterByField(items, 'maintenance_type', params.maintenance_type);
    items = filterByField(items, 'vehicle_id', params.vehicle_id);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/maintenance/:id/
  http.get(`${API}maintenance/:id/`, async ({ params }) => {
    await delay(100);
    const record = db.maintenance.find((m) => m.id === Number(params.id));
    if (!record) {
      return HttpResponse.json({ detail: 'Bakim kaydi bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(record);
  }),

  // POST /api/maintenance/
  http.post(`${API}maintenance/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;

    const newRecord = {
      id: nextId(),
      vehicle_id: Number(body.vehicle_id),
      vehicle_plate: vehicle ? vehicle.plate_number : '',
      maintenance_type: body.maintenance_type || 'SCHEDULED',
      status: body.status || 'SCHEDULED',
      description: body.description || '',
      scheduled_date: body.scheduled_date || '',
      completed_date: body.completed_date || null,
      cost: body.cost != null ? String(Number(body.cost).toFixed(2)) : '0.00',
      service_provider: body.service_provider || '',
      odometer_reading: body.odometer_reading ? Number(body.odometer_reading) : null,
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    db.maintenance.push(newRecord);
    return HttpResponse.json(newRecord, { status: 201 });
  }),

  // PUT /api/maintenance/:id/
  http.put(`${API}maintenance/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.maintenance.findIndex((m) => m.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Bakim kaydi bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;

    db.maintenance[idx] = {
      ...db.maintenance[idx],
      vehicle_id: body.vehicle_id != null ? Number(body.vehicle_id) : db.maintenance[idx].vehicle_id,
      vehicle_plate: vehicle ? vehicle.plate_number : db.maintenance[idx].vehicle_plate,
      maintenance_type: body.maintenance_type ?? db.maintenance[idx].maintenance_type,
      status: body.status ?? db.maintenance[idx].status,
      description: body.description ?? db.maintenance[idx].description,
      scheduled_date: body.scheduled_date ?? db.maintenance[idx].scheduled_date,
      completed_date: body.completed_date !== undefined ? body.completed_date : db.maintenance[idx].completed_date,
      cost: body.cost != null ? String(Number(body.cost).toFixed(2)) : db.maintenance[idx].cost,
      service_provider: body.service_provider ?? db.maintenance[idx].service_provider,
      odometer_reading: body.odometer_reading != null ? Number(body.odometer_reading) : db.maintenance[idx].odometer_reading,
      notes: body.notes ?? db.maintenance[idx].notes,
    };
    return HttpResponse.json(db.maintenance[idx]);
  }),

  // DELETE /api/maintenance/:id/
  http.delete(`${API}maintenance/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.maintenance.findIndex((m) => m.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Bakim kaydi bulunamadi.' }, { status: 404 });
    }
    db.maintenance.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
