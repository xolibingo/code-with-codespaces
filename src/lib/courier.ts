import { getSettings } from './storage';

export interface Route {
  origin: string;
  destination: string;
  label: string;
  pricePerKg: number;
  minDays: number;
  maxDays: number;
}

export const COUNTRY_NAMES: Record<string, string> = {
  ZA: 'South Africa',
  ZW: 'Zimbabwe',
  BW: 'Botswana',
  ZM: 'Zambia',
  MZ: 'Mozambique',
  NA: 'Namibia',
};

export function getRoutes(): Route[] {
  const settings = getSettings();
  return settings.routes.map(r => ({
    ...r,
    label: `${COUNTRY_NAMES[r.origin]} → ${COUNTRY_NAMES[r.destination]}`,
  }));
}

export const ROUTES: Route[] = [
  { origin: 'ZA', destination: 'ZW', label: 'South Africa → Zimbabwe', pricePerKg: 420, minDays: 3, maxDays: 5 },
  { origin: 'ZA', destination: 'BW', label: 'South Africa → Botswana', pricePerKg: 315, minDays: 2, maxDays: 3 },
  { origin: 'ZA', destination: 'ZM', label: 'South Africa → Zambia', pricePerKg: 525, minDays: 5, maxDays: 7 },
  { origin: 'ZA', destination: 'MZ', label: 'South Africa → Mozambique', pricePerKg: 367, minDays: 3, maxDays: 4 },
  { origin: 'ZA', destination: 'NA', label: 'South Africa → Namibia', pricePerKg: 420, minDays: 4, maxDays: 5 },
];

export interface RateResult {
  base: number;
  clearance: number;
  total: number;
  days: string;
  pricePerKg: number;
}

export function calculateRate(
  origin: string,
  destination: string,
  weight: number,
  clearanceDocs: boolean,
  discount = 0
): RateResult {
  const settings = getSettings();
  const routeData = settings.routes.find(r => r.origin === origin && r.destination === destination);

  if (!routeData) {
    return { base: 0, clearance: 0, total: 0, days: 'N/A', pricePerKg: 0 };
  }

  const pricePerKg = routeData.pricePerKg;
  const base = pricePerKg * weight;
  const clearance = clearanceDocs ? settings.clearanceFee : 0;
  const subtotal = base + clearance;
  const discountAmt = subtotal * (discount / 100);
  const total = subtotal - discountAmt;
  const days = `${routeData.minDays}-${routeData.maxDays} days`;

  return { base, clearance, total, days, pricePerKg };
}

export function generateTrackingNumber(): string {
  const prefix = 'BC';
  const num = Math.floor(Math.random() * 900000) + 100000;
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${num}${suffix}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `INV-${year}-${num}`;
}
