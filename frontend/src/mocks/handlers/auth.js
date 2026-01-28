import { http, HttpResponse, delay } from 'msw';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const FAKE_ACCESS = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjo5OTk5OTk5OTk5fQ.mock-signature';
const FAKE_REFRESH = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6OTk5OTk5OTk5OX0.mock-refresh';

export const authHandlers = [
  // POST /api/token/ - Login
  http.post(`${API}token/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const { username, password } = body;

    if (username === 'admin' && password === 'admin') {
      return HttpResponse.json({
        access: FAKE_ACCESS,
        refresh: FAKE_REFRESH,
      });
    }

    return HttpResponse.json(
      { detail: 'Giris basarisiz. Kullanici adi veya sifre hatali.' },
      { status: 401 }
    );
  }),

  // POST /api/token/refresh/ - Token Refresh
  http.post(`${API}token/refresh/`, async ({ request }) => {
    await delay(100);
    const body = await request.json();
    if (body.refresh) {
      return HttpResponse.json({
        access: FAKE_ACCESS,
      });
    }
    return HttpResponse.json(
      { detail: 'Token gecersiz.' },
      { status: 401 }
    );
  }),
];
