import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const driverHandlers = [
  // GET /api/drivers/
  http.get(`${API}drivers/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.drivers];
    items = filterBySearch(items, params.search, ['first_name', 'last_name', 'phone', 'license_number']);

    // Filter by availability
    if (params.is_available !== undefined && params.is_available !== '') {
      const avail = params.is_available === 'true';
      items = items.filter((d) => d.is_available === avail);
    }

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/drivers/:id/
  http.get(`${API}drivers/:id/`, async ({ params }) => {
    await delay(100);
    const driver = db.drivers.find((d) => d.id === Number(params.id));
    if (!driver) {
      return HttpResponse.json({ detail: 'Surucu bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(driver);
  }),

  // POST /api/drivers/
  http.post(`${API}drivers/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const newDriver = {
      id: nextId(),
      first_name: body.first_name || '',
      last_name: body.last_name || '',
      phone: body.phone || '',
      license_number: body.license_number || '',
      is_available: body.is_available !== undefined ? body.is_available : true,
      current_vehicle: null,
      created_at: new Date().toISOString(),
    };
    db.drivers.push(newDriver);
    return HttpResponse.json(newDriver, { status: 201 });
  }),

  // PUT /api/drivers/:id/
  http.put(`${API}drivers/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.drivers.findIndex((d) => d.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Surucu bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    db.drivers[idx] = {
      ...db.drivers[idx],
      first_name: body.first_name ?? db.drivers[idx].first_name,
      last_name: body.last_name ?? db.drivers[idx].last_name,
      phone: body.phone ?? db.drivers[idx].phone,
      license_number: body.license_number ?? db.drivers[idx].license_number,
      is_available: body.is_available !== undefined ? body.is_available : db.drivers[idx].is_available,
    };
    return HttpResponse.json(db.drivers[idx]);
  }),

  // DELETE /api/drivers/:id/
  http.delete(`${API}drivers/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.drivers.findIndex((d) => d.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Surucu bulunamadi.' }, { status: 404 });
    }
    db.drivers.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
