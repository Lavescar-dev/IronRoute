import { authHandlers } from './auth.js';
import { dashboardHandlers } from './dashboard.js';
import { vehicleHandlers } from './vehicles.js';
import { driverHandlers } from './drivers.js';
import { shipmentHandlers } from './shipments.js';
import { customerHandlers } from './customers.js';
import { notificationHandlers } from './notifications.js';
import { invoiceHandlers } from './invoices.js';
import { routeHandlers } from './routes.js';
import { maintenanceHandlers } from './maintenance.js';
import { fuelRecordHandlers } from './fuelRecords.js';

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...vehicleHandlers,
  ...driverHandlers,
  ...shipmentHandlers,
  ...customerHandlers,
  ...notificationHandlers,
  ...invoiceHandlers,
  ...routeHandlers,
  ...maintenanceHandlers,
  ...fuelRecordHandlers,
];
