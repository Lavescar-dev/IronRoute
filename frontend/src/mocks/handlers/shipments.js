import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const shipmentHandlers = [
  // GET /api/shipments/
  http.get(`${API}shipments/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.shipments];
    items = filterBySearch(items, params.search, ['origin', 'destination', 'customer_name', 'plate_number']);
    items = filterByField(items, 'status', params.status);
    items = filterByField(items, 'customer_id', params.customer_id);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/shipments/:id/
  http.get(`${API}shipments/:id/`, async ({ params }) => {
    await delay(100);
    const shipment = db.shipments.find((s) => s.id === Number(params.id));
    if (!shipment) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(shipment);
  }),

  // POST /api/shipments/
  http.post(`${API}shipments/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const customer = db.customers.find((c) => c.id === Number(body.customer_id));
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;

    const newShipment = {
      id: nextId(),
      customer_id: Number(body.customer_id),
      customer_name: customer ? customer.name : 'Bilinmeyen Musteri',
      vehicle_id: vehicle ? vehicle.id : null,
      plate_number: vehicle ? vehicle.plate_number : null,
      origin: body.origin || '',
      destination: body.destination || '',
      weight_kg: Number(body.weight_kg) || 0,
      price: String(Number(body.price || 0).toFixed(2)),
      status: body.status || 'PENDING',
      tracking_token: 'TRK-' + nextId() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase(),
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    db.shipments.push(newShipment);

    // Update customer total_shipments
    if (customer) {
      customer.total_shipments = (customer.total_shipments || 0) + 1;
    }

    return HttpResponse.json(newShipment, { status: 201 });
  }),

  // PUT /api/shipments/:id/
  http.put(`${API}shipments/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.shipments.findIndex((s) => s.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    const customer = body.customer_id ? db.customers.find((c) => c.id === Number(body.customer_id)) : null;
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;

    db.shipments[idx] = {
      ...db.shipments[idx],
      customer_id: body.customer_id != null ? Number(body.customer_id) : db.shipments[idx].customer_id,
      customer_name: customer ? customer.name : db.shipments[idx].customer_name,
      vehicle_id: body.vehicle_id !== undefined ? (body.vehicle_id ? Number(body.vehicle_id) : null) : db.shipments[idx].vehicle_id,
      plate_number: vehicle ? vehicle.plate_number : (body.vehicle_id === null ? null : db.shipments[idx].plate_number),
      origin: body.origin ?? db.shipments[idx].origin,
      destination: body.destination ?? db.shipments[idx].destination,
      weight_kg: body.weight_kg != null ? Number(body.weight_kg) : db.shipments[idx].weight_kg,
      price: body.price != null ? String(Number(body.price).toFixed(2)) : db.shipments[idx].price,
      status: body.status ?? db.shipments[idx].status,
      notes: body.notes ?? db.shipments[idx].notes,
    };
    return HttpResponse.json(db.shipments[idx]);
  }),

  // PATCH /api/shipments/:id/ - Status update
  http.patch(`${API}shipments/:id/`, async ({ params, request }) => {
    await delay(150);
    const idx = db.shipments.findIndex((s) => s.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    if (body.status) {
      db.shipments[idx].status = body.status;
    }
    return HttpResponse.json(db.shipments[idx]);
  }),

  // DELETE /api/shipments/:id/
  http.delete(`${API}shipments/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.shipments.findIndex((s) => s.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    db.shipments.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/shipments/track/:token/ - Public tracking
  http.get(`${API}shipments/track/:token/`, async ({ params }) => {
    await delay(200);
    const shipment = db.shipments.find((s) => s.tracking_token === params.token);
    if (!shipment) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    // Return limited public info
    return HttpResponse.json({
      id: shipment.id,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      created_at: shipment.created_at,
    });
  }),

  // GET /api/track/:token/ - Alternative public tracking URL
  http.get(`${API}track/:token/`, async ({ params }) => {
    await delay(200);
    const shipment = db.shipments.find((s) => s.tracking_token === params.token);
    if (!shipment) {
      return HttpResponse.json({ detail: 'Sevkiyat bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json({
      id: shipment.id,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      created_at: shipment.created_at,
    });
  }),
];
