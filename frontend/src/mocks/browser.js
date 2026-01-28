import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/index.js';
import { TruckSimulator } from './utils/simulation.js';
import { db } from './data/index.js';

export const worker = setupWorker(...handlers);

// Start truck simulation after worker is ready
const simulator = new TruckSimulator(db);

const originalStart = worker.start.bind(worker);
worker.start = async (options) => {
  const result = await originalStart(options);
  simulator.start();
  console.log('[MSW] Mock API aktif - Demo modu calisiyor');
  console.log('[MSW] Truck simulator baslatildi (3sn aralikla konum guncellemesi)');
  return result;
};
