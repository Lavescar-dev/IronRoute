import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate } from '../utils/pagination.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const notificationHandlers = [
  // GET /api/notifications/
  http.get(`${API}notifications/`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Sort newest first
    const items = [...db.notifications].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // GET /api/notifications/unread_count/
  http.get(`${API}notifications/unread_count/`, async () => {
    await delay(50);
    const count = db.notifications.filter((n) => !n.is_read).length;
    return HttpResponse.json({ unread_count: count });
  }),

  // POST /api/notifications/:id/mark_read/
  http.post(`${API}notifications/:id/mark_read/`, async ({ params }) => {
    await delay(100);
    const notification = db.notifications.find((n) => n.id === Number(params.id));
    if (!notification) {
      return HttpResponse.json({ detail: 'Bildirim bulunamadi.' }, { status: 404 });
    }
    notification.is_read = true;
    return HttpResponse.json(notification);
  }),

  // POST /api/notifications/mark_all_read/
  http.post(`${API}notifications/mark_all_read/`, async () => {
    await delay(100);
    db.notifications.forEach((n) => {
      n.is_read = true;
    });
    return HttpResponse.json({ status: 'ok' });
  }),
];
