import { vehicles } from './vehicles.js';
import { drivers } from './drivers.js';
import { shipments } from './shipments.js';
import { customers } from './customers.js';
import { invoices } from './invoices.js';
import { routes } from './routes.js';
import { maintenance } from './maintenance.js';
import { fuelRecords } from './fuelRecords.js';
import { notifications } from './notifications.js';
import { vehicleLocations } from './vehicleLocations.js';
import { maintenanceArchive } from './maintenanceArchive.js';

/**
 * Mutable in-memory database.
 * All handlers read/write directly to this object.
 * Persists for the duration of the browser session.
 */
export const db = {
  vehicles: [...vehicles],
  drivers: [...drivers],
  shipments: [...shipments],
  customers: [...customers],
  invoices: [...invoices],
  routes: [...routes],
  maintenance: [...maintenance],
  maintenanceArchive: [...maintenanceArchive],
  fuelRecords: [...fuelRecords],
  notifications: [...notifications],
  vehicleLocations: [...vehicleLocations],
};
