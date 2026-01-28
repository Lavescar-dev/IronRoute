import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';
import { paginate, filterBySearch, filterByField } from '../utils/pagination.js';
import { nextId } from '../utils/idGenerator.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const fuelRecordHandlers = [
  // GET /api/fuel-records/
  http.get(`${API}fuel-records/`, async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.fuelRecords];
    items = filterBySearch(items, params.search, ['vehicle_plate', 'fuel_station']);
    items = filterByField(items, 'vehicle_id', params.vehicle_id);

    return HttpResponse.json(paginate(items, request.url, params));
  }),

  // POST /api/fuel-records/
  http.post(`${API}fuel-records/`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    const vehicle = body.vehicle_id ? db.vehicles.find((v) => v.id === Number(body.vehicle_id)) : null;
    const driver = body.driver_id ? db.drivers.find((d) => d.id === Number(body.driver_id)) : null;

    const liters = Number(body.liters) || 0;
    const pricePerLiter = Number(body.price_per_liter) || 0;
    const totalCost = body.total_cost ? Number(body.total_cost) : liters * pricePerLiter;

    const newRecord = {
      id: nextId(),
      vehicle_id: Number(body.vehicle_id),
      vehicle_plate: vehicle ? vehicle.plate_number : '',
      driver_id: driver ? driver.id : null,
      fill_date: body.fill_date || new Date().toISOString(),
      liters: liters.toFixed(2),
      price_per_liter: pricePerLiter.toFixed(2),
      total_cost: totalCost.toFixed(2),
      odometer_reading: Number(body.odometer_reading) || 0,
      fuel_station: body.fuel_station || '',
      created_at: new Date().toISOString(),
    };
    db.fuelRecords.push(newRecord);
    return HttpResponse.json(newRecord, { status: 201 });
  }),

  // GET /api/vehicle-locations/
  http.get(`${API}vehicle-locations/`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const vehicleId = url.searchParams.get('vehicle');
    const params = Object.fromEntries(url.searchParams);

    let items = [...db.vehicleLocations];
    if (vehicleId) {
      items = items.filter((l) => l.vehicle === Number(vehicleId));
    }
    // Sort newest first
    items.sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

    return HttpResponse.json(paginate(items, request.url, params));
  }),
];
