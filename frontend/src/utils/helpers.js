/**
 * Helper Utilities
 *
 * Common utility functions used throughout the application
 */

// ===========================================
// DATE FORMATTING
// ===========================================

/**
 * Format date to Turkish locale
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('tr-TR', defaultOptions);
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 saat once")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '-';

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dakika önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;

  return formatDate(date);
};

// ===========================================
// NUMBER FORMATTING
// ===========================================

/**
 * Format number as currency (TRY)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '-';

  return new Intl.NumberFormat('tr-TR').format(number);
};

/**
 * Format weight in kg
 * @param {number} kg - Weight in kilograms
 * @returns {string} Formatted weight string
 */
export const formatWeight = (kg) => {
  if (!kg) return '-';

  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} ton`;
  }
  return `${formatNumber(kg)} kg`;
};

// ===========================================
// STRING UTILITIES
// ===========================================

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Format Turkish plate number
 * @param {string} plate - Plate number to format
 * @returns {string} Formatted plate number
 */
export const formatPlateNumber = (plate) => {
  if (!plate) return '';

  // Remove all non-alphanumeric characters
  const cleaned = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Match Turkish plate format: 06 ABC 123
  const match = cleaned.match(/^(\d{2})([A-Z]{1,3})(\d{2,5})$/);

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return plate.toUpperCase();
};

/**
 * Validate Turkish plate number
 * @param {string} plate - Plate number to validate
 * @returns {boolean} Is valid plate
 */
export const isValidPlateNumber = (plate) => {
  if (!plate) return false;
  const cleaned = plate.replace(/\s/g, '').toUpperCase();
  return /^\d{2}[A-Z]{1,3}\d{2,5}$/.test(cleaned);
};

// ===========================================
// OBJECT UTILITIES
// ===========================================

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Remove empty values from object
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      return value !== null && value !== undefined && value !== '';
    })
  );
};

// ===========================================
// ARRAY UTILITIES
// ===========================================

/**
 * Group array by key
 * @param {array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ===========================================
// VALIDATION UTILITIES
// ===========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Turkish format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

// ===========================================
// COLOR UTILITIES
// ===========================================

/**
 * Get status color
 * @param {string} status - Status value
 * @returns {string} MUI color name
 */
export const getStatusColor = (status) => {
  const colors = {
    // Vehicle statuses
    IDLE: 'success',
    TRANSIT: 'primary',
    MAINTENANCE: 'warning',
    // Shipment statuses
    PENDING: 'warning',
    DISPATCHED: 'info',
    DELIVERED: 'success',
    CANCELLED: 'error',
    // Driver availability
    true: 'success',
    false: 'error',
  };

  return colors[status] || 'default';
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human readable label
 */
export const getStatusLabel = (status) => {
  const labels = {
    // Vehicle statuses
    IDLE: 'Boşta',
    TRANSIT: 'Yolda',
    MAINTENANCE: 'Bakımda',
    // Shipment statuses
    PENDING: 'Beklemede',
    DISPATCHED: 'Yola Çıktı',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi',
    // Vehicle types
    TRUCK: 'Kamyon',
    LORRY: 'Tır',
    VAN: 'Kamyonet',
    PICKUP: 'Pikap',
  };

  return labels[status] || status;
};

// ===========================================
// DEBOUNCE / THROTTLE
// ===========================================

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
