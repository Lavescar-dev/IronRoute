import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const invoiceHandlers = [
  // GET /api/invoices/
  http.get(`${API}invoices/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.invoices];
    items = filterBySearch(items, params.search, ['invoice_number', 'customer_name']);
    items = filterByField(items, 'status', params.status);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/invoices/:id/
  http.get(`${API}invoices/:id/`, async ({ params }) => {
    await delay(100);
    const invoice = db.invoices.find((i) => i.id === Number(params.id));
    if (!invoice) {
      return HttpResponse.json({ detail: 'Fatura bulunamadi.' }, { status: 404 });
    }
    return HttpResponse.json(invoice);
  }),

  // POST /api/invoices/
  http.post(`${API}invoices/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const customer = db.customers.find((c) => c.id === Number(body.customer_id));
    const shipment = body.shipment_id ? db.shipments.find((s) => s.id === Number(body.shipment_id)) : null;

    const taxRate = Number(body.tax_rate) || 20;
    const discount = Number(body.discount) || 0;
    const subtotal = shipment ? parseFloat(shipment.price) : 0;
    const taxAmount = ((subtotal - discount) * taxRate) / 100;
    const totalAmount = subtotal - discount + taxAmount;

    const id = nextId();
    const newInvoice = {
      id,
      invoice_number: `FTR-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`,
      customer_id: Number(body.customer_id),
      customer_name: customer ? customer.name : 'Bilinmeyen Musteri',
      shipment_id: body.shipment_id ? Number(body.shipment_id) : null,
      subtotal: subtotal.toFixed(2),
      tax_rate: taxRate,
      tax_amount: taxAmount.toFixed(2),
      discount: discount.toFixed(2),
      total_amount: totalAmount.toFixed(2),
      status: body.status || 'DRAFT',
      due_date: body.due_date || '',
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    db.invoices.push(newInvoice);
    return HttpResponse.json(newInvoice, { status: 201 });
  }),

  // PUT /api/invoices/:id/
  http.put(`${API}invoices/:id/`, async ({ params, request }) => {
    await delay(200);
    const idx = db.invoices.findIndex((i) => i.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Fatura bulunamadi.' }, { status: 404 });
    }
    const body = await request.json();
    const customer = body.customer_id ? db.customers.find((c) => c.id === Number(body.customer_id)) : null;

    db.invoices[idx] = {
      ...db.invoices[idx],
      customer_id: body.customer_id != null ? Number(body.customer_id) : db.invoices[idx].customer_id,
      customer_name: customer ? customer.name : db.invoices[idx].customer_name,
      shipment_id: body.shipment_id !== undefined ? (body.shipment_id ? Number(body.shipment_id) : null) : db.invoices[idx].shipment_id,
      tax_rate: body.tax_rate != null ? Number(body.tax_rate) : db.invoices[idx].tax_rate,
      discount: body.discount != null ? Number(body.discount).toFixed(2) : db.invoices[idx].discount,
      due_date: body.due_date ?? db.invoices[idx].due_date,
      status: body.status ?? db.invoices[idx].status,
      notes: body.notes ?? db.invoices[idx].notes,
    };
    return HttpResponse.json(db.invoices[idx]);
  }),

  // POST /api/invoices/:id/mark_paid/
  http.post(`${API}invoices/:id/mark_paid/`, async ({ params }) => {
    await delay(150);
    const invoice = db.invoices.find((i) => i.id === Number(params.id));
    if (!invoice) {
      return HttpResponse.json({ detail: 'Fatura bulunamadi.' }, { status: 404 });
    }
    invoice.status = 'PAID';
    return HttpResponse.json(invoice);
  }),

  // DELETE /api/invoices/:id/
  http.delete(`${API}invoices/:id/`, async ({ params }) => {
    await delay(150);
    const idx = db.invoices.findIndex((i) => i.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Fatura bulunamadi.' }, { status: 404 });
    }
    db.invoices.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
