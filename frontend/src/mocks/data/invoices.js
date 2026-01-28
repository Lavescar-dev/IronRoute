function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export const invoices = [
  // 3 PAID
  { id: 1, invoice_number: 'FTR-2024-001', customer_id: 1, customer_name: 'Yildiz Lojistik A.S.', shipment_id: 14, subtotal: '28000.00', tax_rate: 20, tax_amount: '5600.00', discount: '0.00', total_amount: '33600.00', status: 'PAID', due_date: daysAgo(10), notes: '', created_at: daysAgo(25) + 'T10:00:00Z' },
  { id: 2, invoice_number: 'FTR-2024-002', customer_id: 2, customer_name: 'Anadolu Kargo Ltd.', shipment_id: 16, subtotal: '5500.00', tax_rate: 20, tax_amount: '1100.00', discount: '0.00', total_amount: '6600.00', status: 'PAID', due_date: daysAgo(8), notes: '', created_at: daysAgo(22) + 'T10:00:00Z' },
  { id: 3, invoice_number: 'FTR-2024-003', customer_id: 3, customer_name: 'Bosphorus Tasimacilik', shipment_id: 18, subtotal: '9500.00', tax_rate: 20, tax_amount: '1900.00', discount: '0.00', total_amount: '11400.00', status: 'PAID', due_date: daysAgo(5), notes: '', created_at: daysAgo(18) + 'T10:00:00Z' },

  // 3 SENT
  { id: 4, invoice_number: 'FTR-2024-004', customer_id: 4, customer_name: 'Ege Nakliyat A.S.', shipment_id: 19, subtotal: '24000.00', tax_rate: 20, tax_amount: '4800.00', discount: '500.00', total_amount: '28300.00', status: 'SENT', due_date: daysFromNow(15), notes: '', created_at: daysAgo(17) + 'T10:00:00Z' },
  { id: 5, invoice_number: 'FTR-2024-005', customer_id: 5, customer_name: 'Karadeniz Lojistik', shipment_id: 20, subtotal: '4500.00', tax_rate: 20, tax_amount: '900.00', discount: '0.00', total_amount: '5400.00', status: 'SENT', due_date: daysFromNow(10), notes: '', created_at: daysAgo(15) + 'T10:00:00Z' },
  { id: 6, invoice_number: 'FTR-2024-006', customer_id: 6, customer_name: 'Marmara Dagitim Ltd.', shipment_id: 21, subtotal: '3000.00', tax_rate: 20, tax_amount: '600.00', discount: '0.00', total_amount: '3600.00', status: 'SENT', due_date: daysFromNow(20), notes: '', created_at: daysAgo(14) + 'T10:00:00Z' },

  // 3 DRAFT
  { id: 7, invoice_number: 'FTR-2024-007', customer_id: 1, customer_name: 'Yildiz Lojistik A.S.', shipment_id: 15, subtotal: '16000.00', tax_rate: 20, tax_amount: '3200.00', discount: '0.00', total_amount: '19200.00', status: 'DRAFT', due_date: daysFromNow(30), notes: 'Awaiting approval', created_at: daysAgo(10) + 'T10:00:00Z' },
  { id: 8, invoice_number: 'FTR-2024-008', customer_id: 7, customer_name: 'Akdeniz Kargo A.S.', shipment_id: 22, subtotal: '5000.00', tax_rate: 20, tax_amount: '1000.00', discount: '0.00', total_amount: '6000.00', status: 'DRAFT', due_date: daysFromNow(30), notes: '', created_at: daysAgo(8) + 'T10:00:00Z' },
  { id: 9, invoice_number: 'FTR-2024-009', customer_id: 8, customer_name: 'Icdis Ticaret Ltd.', shipment_id: 23, subtotal: '4000.00', tax_rate: 20, tax_amount: '800.00', discount: '0.00', total_amount: '4800.00', status: 'DRAFT', due_date: daysFromNow(30), notes: '', created_at: daysAgo(7) + 'T10:00:00Z' },

  // 3 OVERDUE
  { id: 10, invoice_number: 'FTR-2024-010', customer_id: 2, customer_name: 'Anadolu Kargo Ltd.', shipment_id: 17, subtotal: '11000.00', tax_rate: 20, tax_amount: '2200.00', discount: '0.00', total_amount: '13200.00', status: 'OVERDUE', due_date: daysAgo(5), notes: 'Payment reminder sent', created_at: daysAgo(20) + 'T10:00:00Z' },
  { id: 11, invoice_number: 'FTR-2024-011', customer_id: 3, customer_name: 'Bosphorus Tasimacilik', shipment_id: 24, subtotal: '19000.00', tax_rate: 20, tax_amount: '3800.00', discount: '0.00', total_amount: '22800.00', status: 'OVERDUE', due_date: daysAgo(3), notes: '', created_at: daysAgo(15) + 'T10:00:00Z' },
  { id: 12, invoice_number: 'FTR-2024-012', customer_id: 4, customer_name: 'Ege Nakliyat A.S.', shipment_id: 25, subtotal: '20000.00', tax_rate: 20, tax_amount: '4000.00', discount: '1000.00', total_amount: '23000.00', status: 'OVERDUE', due_date: daysAgo(1), notes: '', created_at: daysAgo(12) + 'T10:00:00Z' },

  // 3 CANCELLED
  { id: 13, invoice_number: 'FTR-2024-013', customer_id: 9, customer_name: 'Trakya Lojistik A.S.', shipment_id: 26, subtotal: '3500.00', tax_rate: 20, tax_amount: '700.00', discount: '0.00', total_amount: '4200.00', status: 'CANCELLED', due_date: daysAgo(15), notes: 'Shipment cancelled', created_at: daysAgo(20) + 'T10:00:00Z' },
  { id: 14, invoice_number: 'FTR-2024-014', customer_id: 10, customer_name: 'Guneydogu Nakliye', shipment_id: 27, subtotal: '15000.00', tax_rate: 20, tax_amount: '3000.00', discount: '0.00', total_amount: '18000.00', status: 'CANCELLED', due_date: daysAgo(10), notes: 'Cancelled by customer', created_at: daysAgo(15) + 'T10:00:00Z' },
  { id: 15, invoice_number: 'FTR-2024-015', customer_id: 5, customer_name: 'Karadeniz Lojistik', shipment_id: 28, subtotal: '25000.00', tax_rate: 20, tax_amount: '5000.00', discount: '0.00', total_amount: '30000.00', status: 'CANCELLED', due_date: daysAgo(5), notes: 'Route unavailable', created_at: daysAgo(8) + 'T10:00:00Z' },
];
