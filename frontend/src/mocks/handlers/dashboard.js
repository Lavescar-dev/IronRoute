import { http, HttpResponse, delay } from 'msw';
import { db } from '../data/index.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const dashboardHandlers = [
  // GET /api/dashboard/stats/
  http.get(`${API}dashboard/stats/`, async () => {
    await delay(150);

    const vehicles = db.vehicles;
    const shipments = db.shipments;
    const drivers = db.drivers;
    const invoices = db.invoices;

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'TRANSIT').length;
    const idleVehicles = vehicles.filter((v) => v.status === 'IDLE').length;
    const maintenanceVehicles = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter((d) => d.is_available).length;

    const totalShipments = shipments.length;
    const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED').length;
    const pendingShipments = shipments.filter((s) => s.status === 'PENDING').length;
    const transitShipments = shipments.filter(
      (s) => s.status === 'DISPATCHED' || s.status === 'TRANSIT'
    ).length;

    const totalRevenue = shipments.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);
    const deliveredRevenue = shipments
      .filter((s) => s.status === 'DELIVERED')
      .reduce((sum, s) => sum + parseFloat(s.price || 0), 0);

    const totalCustomers = db.customers.length;

    const paidInvoices = invoices
      .filter((i) => i.status === 'PAID')
      .reduce((sum, i) => sum + parseFloat(i.total_amount || 0), 0);
    const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE').length;

    return HttpResponse.json({
      total_vehicles: totalVehicles,
      active_vehicles: activeVehicles,
      idle_vehicles: idleVehicles,
      maintenance_vehicles: maintenanceVehicles,
      total_drivers: totalDrivers,
      available_drivers: availableDrivers,
      total_shipments: totalShipments,
      delivered_shipments: deliveredShipments,
      pending_shipments: pendingShipments,
      transit_shipments: transitShipments,
      total_revenue: totalRevenue.toFixed(2),
      delivered_revenue: deliveredRevenue.toFixed(2),
      total_customers: totalCustomers,
      paid_invoices_total: paidInvoices.toFixed(2),
      overdue_invoices_count: overdueInvoices,
    });
  }),
];
