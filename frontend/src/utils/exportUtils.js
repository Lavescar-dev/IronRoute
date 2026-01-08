/**
 * Export Utilities
 *
 * Functions for exporting data to Excel, PDF, and CSV formats
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ===========================================
// EXCEL EXPORT
// ===========================================

/**
 * Export data to Excel file
 * @param {array} data - Array of objects to export
 * @param {string} fileName - Output file name (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 * @param {array} columns - Column definitions [{header, key, width}]
 */
export const exportToExcel = (
  data,
  fileName = 'export',
  sheetName = 'Sheet1',
  columns = null
) => {
  try {
    // If columns are provided, transform data
    let exportData = data;
    if (columns) {
      exportData = data.map((row) => {
        const newRow = {};
        columns.forEach((col) => {
          newRow[col.header] = row[col.key] ?? '-';
        });
        return newRow;
      });
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    if (columns) {
      ws['!cols'] = columns.map((col) => ({
        wch: col.width || 15,
      }));
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate file
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    return true;
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Excel dosyasi oluşturulamadı');
  }
};

// ===========================================
// CSV EXPORT
// ===========================================

/**
 * Export data to CSV file
 * @param {array} data - Array of objects to export
 * @param {string} fileName - Output file name (without extension)
 * @param {array} columns - Column definitions [{header, key}]
 */
export const exportToCSV = (data, fileName = 'export', columns = null) => {
  try {
    let headers, rows;

    if (columns) {
      headers = columns.map((col) => col.header);
      rows = data.map((row) =>
        columns.map((col) => {
          const value = row[col.key] ?? '';
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
      );
    } else {
      headers = Object.keys(data[0] || {});
      rows = data.map((row) =>
        headers.map((header) => {
          const value = row[header] ?? '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
      );
    }

    // Create CSV content
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();

    return true;
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('CSV dosyasi oluşturulamadı');
  }
};

// ===========================================
// PDF EXPORT
// ===========================================

/**
 * Export data to PDF file
 * @param {array} data - Array of objects to export
 * @param {string} fileName - Output file name (without extension)
 * @param {string} title - Document title
 * @param {array} columns - Column definitions [{header, key, width}]
 * @param {object} options - Additional options
 */
export const exportToPDF = (
  data,
  fileName = 'export',
  title = 'Rapor',
  columns = null,
  options = {}
) => {
  try {
    const {
      orientation = 'portrait',
      pageSize = 'a4',
      includeDate = true,
      fontSize = 10,
    } = options;

    // Create PDF document
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize,
    });

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Add date
    if (includeDate) {
      doc.setFontSize(10);
      doc.text(
        `Oluşturulma: ${new Date().toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        14,
        28
      );
    }

    // Prepare table data
    let headers, body;

    if (columns) {
      headers = columns.map((col) => col.header);
      body = data.map((row) =>
        columns.map((col) => {
          const value = row[col.key];
          return value ?? '-';
        })
      );
    } else {
      headers = Object.keys(data[0] || {});
      body = data.map((row) => headers.map((header) => row[header] ?? '-'));
    }

    // Add table
    doc.autoTable({
      startY: includeDate ? 35 : 28,
      head: [headers],
      body: body,
      styles: {
        fontSize: fontSize,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Primary blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: columns
        ? columns.reduce((acc, col, index) => {
            if (col.width) {
              acc[index] = { cellWidth: col.width };
            }
            return acc;
          }, {})
        : {},
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Sayfa ${i} / ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }

    // Save file
    doc.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('PDF dosyasi oluşturulamadı');
  }
};

// ===========================================
// VEHICLE EXPORTS
// ===========================================

/**
 * Export vehicles data
 * @param {array} vehicles - Array of vehicle objects
 * @param {string} format - 'excel', 'csv', or 'pdf'
 */
export const exportVehicles = (vehicles, format = 'excel') => {
  const columns = [
    { header: 'Plaka', key: 'plate_number', width: 30 },
    { header: 'Tip', key: 'vehicle_type', width: 25 },
    { header: 'Marka', key: 'brand', width: 25 },
    { header: 'Model Yılı', key: 'model_year', width: 20 },
    { header: 'Kapasite (kg)', key: 'capacity_kg', width: 25 },
    { header: 'Durum', key: 'status', width: 25 },
  ];

  const fileName = `araclar_${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'excel':
      return exportToExcel(vehicles, fileName, 'Araçlar', columns);
    case 'csv':
      return exportToCSV(vehicles, fileName, columns);
    case 'pdf':
      return exportToPDF(vehicles, fileName, 'Araç Listesi', columns, {
        orientation: 'landscape',
      });
    default:
      throw new Error('Geçersiz format');
  }
};

/**
 * Export drivers data
 * @param {array} drivers - Array of driver objects
 * @param {string} format - 'excel', 'csv', or 'pdf'
 */
export const exportDrivers = (drivers, format = 'excel') => {
  const columns = [
    { header: 'Ad', key: 'first_name', width: 30 },
    { header: 'Soyad', key: 'last_name', width: 30 },
    { header: 'Telefon', key: 'phone', width: 30 },
    { header: 'Ehliyet No', key: 'license_number', width: 30 },
    { header: 'Müsait', key: 'is_available', width: 20 },
  ];

  const formattedData = drivers.map((d) => ({
    ...d,
    is_available: d.is_available ? 'Evet' : 'Hayır',
  }));

  const fileName = `suruculer_${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'excel':
      return exportToExcel(formattedData, fileName, 'Sürücüler', columns);
    case 'csv':
      return exportToCSV(formattedData, fileName, columns);
    case 'pdf':
      return exportToPDF(formattedData, fileName, 'Sürücü Listesi', columns);
    default:
      throw new Error('Geçersiz format');
  }
};

/**
 * Export shipments data
 * @param {array} shipments - Array of shipment objects
 * @param {string} format - 'excel', 'csv', or 'pdf'
 */
export const exportShipments = (shipments, format = 'excel') => {
  const columns = [
    { header: 'Müşteri', key: 'customer_name', width: 40 },
    { header: 'Çıkış', key: 'origin', width: 35 },
    { header: 'Varış', key: 'destination', width: 35 },
    { header: 'Durum', key: 'status', width: 25 },
    { header: 'Araç', key: 'plate_number', width: 30 },
    { header: 'Ücret', key: 'price', width: 25 },
  ];

  const fileName = `sevkiyatlar_${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'excel':
      return exportToExcel(shipments, fileName, 'Sevkiyatlar', columns);
    case 'csv':
      return exportToCSV(shipments, fileName, columns);
    case 'pdf':
      return exportToPDF(shipments, fileName, 'Sevkiyat Listesi', columns, {
        orientation: 'landscape',
      });
    default:
      throw new Error('Geçersiz format');
  }
};
