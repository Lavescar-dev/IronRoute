import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const customerHandlers = [
  // GET /api/customers/
  http.get(`${API}customers/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.customers];
    items = filterBySearch(items, params.search, ['name', 'email', 'phone', 'tax_number']);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/customers/:id/
  http.get(`${API}customers/:id/`, async ({ params }) => {
    await delay(100);
    const customer = db.customers.find((c) => c.id === Number(params.id));
    if (!customer) {
      return HttpResponse.json({ detail: 'Musteri bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(customer);
  }),

  // POST /api/customers/
  http.post(`${API}customers/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const newCustomer = {
      id: nextId(),
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      tax_number: body.tax_number || '',
      total_shipments: 0,
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    db.customers.push(newCustomer);
    return HttpResponse.json(newCustomer, { status: 201 });
  }),

  // PUT /api/customers/:id/
  http.put(`${API}customers/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.customers.findIndex((c) => c.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Musteri bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    db.customers[idx] = {
      ...db.customers[idx],
      name: body.name ?? db.customers[idx].name,
      email: body.email ?? db.customers[idx].email,
      phone: body.phone ?? db.customers[idx].phone,
      address: body.address ?? db.customers[idx].address,
      tax_number: body.tax_number ?? db.customers[idx].tax_number,
      notes: body.notes ?? db.customers[idx].notes,
    };
    return HttpResponse.json(db.customers[idx]);
  }),

  // DELETE /api/customers/:id/
  http.delete(`${API}customers/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.customers.findIndex((c) => c.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Musteri bulunamadi.' }, { status: 404 });
    }
    db.customers.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
