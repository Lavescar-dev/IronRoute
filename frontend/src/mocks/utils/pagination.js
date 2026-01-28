/**
 * Creates a DRF-style paginated response.
 * {count, next, previous, results}
 */
export function paginate(items, url, params = {}) {
  const page = parseInt(params.page || '1', 10);
  const pageSize = parseInt(params.page_size || '20', 10);
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const results = items.slice(start, end);

  const baseUrl = url.replace(/\?.*$/, '');
  const buildUrl = (p) => {
    const u = new URL(baseUrl, 'http://localhost');
    u.searchParams.set('page', String(p));
    u.searchParams.set('page_size', String(pageSize));
    return u.pathname + u.search;
  };

  return {
    count: total,
    next: page < totalPages ? buildUrl(page + 1) : null,
    previous: page > 1 ? buildUrl(page - 1) : null,
    results,
  };
}

/**
 * Filters an array by a search term across the given fields.
 */
export function filterBySearch(items, search, fields) {
  if (!search) return items;
  const term = search.toLowerCase();
  return items.filter((item) =>
    fields.some((f) => {
      const val = item[f];
      return val != null && String(val).toLowerCase().includes(term);
    })
  );
}

/**
 * Filters items by matching a field to a value.
 */
export function filterByField(items, field, value) {
  if (value === undefined || value === null || value === '') return items;
  return items.filter((item) => String(item[field]) === String(value));
}
