import { API_BASE_URL } from '~/config';

const CACHE_TTL = 30_000;

const customerCache = { data: null, timestamp: 0 };
const vendorCache = { data: null, timestamp: 0 };

export async function getCustomerAuth() {
  const now = Date.now();
  if (customerCache.data && now - customerCache.timestamp < CACHE_TTL) {
    return customerCache.data;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/customers/me`, {
      credentials: 'include',
    });
    const data = await res.json();
    customerCache.data = data;
    customerCache.timestamp = now;
    return data;
  } catch {
    return { logged_in: false };
  }
}

export async function getVendorAuth() {
  const now = Date.now();
  if (vendorCache.data && now - vendorCache.timestamp < CACHE_TTL) {
    return vendorCache.data;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/vendors/me`, {
      credentials: 'include',
    });
    const data = await res.json();
    vendorCache.data = data;
    vendorCache.timestamp = now;
    return data;
  } catch {
    return { logged_in: false };
  }
}

export function clearAuthCache() {
  customerCache.data = null;
  customerCache.timestamp = 0;
  vendorCache.data = null;
  vendorCache.timestamp = 0;
}
