import { User, Package, Invoice, TaxDoc, Truck, TruckRequest, AuditLog, AppSettings, InventoryItem } from '../types';

const DEFAULT_ROUTES = [
  { origin: 'ZA', destination: 'ZW', pricePerKg: 420, minDays: 3, maxDays: 5 },
  { origin: 'ZA', destination: 'BW', pricePerKg: 315, minDays: 2, maxDays: 3 },
  { origin: 'ZA', destination: 'ZM', pricePerKg: 525, minDays: 5, maxDays: 7 },
  { origin: 'ZA', destination: 'MZ', pricePerKg: 367, minDays: 3, maxDays: 4 },
  { origin: 'ZA', destination: 'NA', pricePerKg: 420, minDays: 4, maxDays: 5 },
];

const DEFAULT_SETTINGS: AppSettings = {
  heroHeadline: 'Fast, Reliable Cross-Border Delivery',
  heroSubheading: 'Connecting Southern Africa with express courier services',
  heroImageUrl: '',
  promoBanner: 'First 50 users get 10% off!',
  stripeLink: '',
  whatsappNumber: '27000000000',
  companyName: 'Bingo Couriers',
  firstPromoEnabled: true,
  clearanceFee: 200,
  truckRentalPerDay: 3150,
  routes: DEFAULT_ROUTES,
};

const DEFAULT_TRUCKS: Truck[] = [
  { id: 't1', plate: 'BC-001', capacity: '5 tonnes', status: 'available', driver: 'John Dube' },
  { id: 't2', plate: 'BC-002', capacity: '10 tonnes', status: 'on_route', driver: 'Sarah Mokoena' },
  { id: 't3', plate: 'BC-003', capacity: '3 tonnes', status: 'maintenance', driver: 'Peter Nkosi' },
];

function initStorage() {
  if (!localStorage.getItem('bc_initialized')) {
    localStorage.setItem('bc_trucks', JSON.stringify(DEFAULT_TRUCKS));
    localStorage.setItem('bc_settings', JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem('bc_users', JSON.stringify([]));
    localStorage.setItem('bc_packages', JSON.stringify([]));
    localStorage.setItem('bc_invoices', JSON.stringify([]));
    localStorage.setItem('bc_taxdocs', JSON.stringify([]));
    localStorage.setItem('bc_truck_requests', JSON.stringify([]));
    localStorage.setItem('bc_audit_logs', JSON.stringify([]));
    localStorage.setItem('bc_userCount', '0');
    localStorage.setItem('bc_initialized', 'true');
  }
}

initStorage();

// Users
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('bc_users') || '[]');
}
export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('bc_users', JSON.stringify(users));
}
export function updateUser(user: User): void {
  const users = getUsers().map(u => u.id === user.id ? user : u);
  localStorage.setItem('bc_users', JSON.stringify(users));
}
export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem('bc_users', JSON.stringify(users));
}

// Packages
export function getPackages(): Package[] {
  return JSON.parse(localStorage.getItem('bc_packages') || '[]');
}
export function savePackage(pkg: Package): void {
  const packages = getPackages();
  packages.push(pkg);
  localStorage.setItem('bc_packages', JSON.stringify(packages));
}
export function updatePackage(pkg: Package): void {
  const packages = getPackages().map(p => p.id === pkg.id ? pkg : p);
  localStorage.setItem('bc_packages', JSON.stringify(packages));
}

// Invoices
export function getInvoices(): Invoice[] {
  return JSON.parse(localStorage.getItem('bc_invoices') || '[]');
}
export function saveInvoice(inv: Invoice): void {
  const invoices = getInvoices();
  invoices.push(inv);
  localStorage.setItem('bc_invoices', JSON.stringify(invoices));
}
export function updateInvoice(inv: Invoice): void {
  const invoices = getInvoices().map(i => i.id === inv.id ? inv : i);
  localStorage.setItem('bc_invoices', JSON.stringify(invoices));
}

// Tax Docs
export function getTaxDocs(): TaxDoc[] {
  return JSON.parse(localStorage.getItem('bc_taxdocs') || '[]');
}
export function saveTaxDoc(doc: TaxDoc): void {
  const docs = getTaxDocs();
  docs.push(doc);
  localStorage.setItem('bc_taxdocs', JSON.stringify(docs));
}
export function deleteTaxDoc(id: string): void {
  const docs = getTaxDocs().filter(d => d.id !== id);
  localStorage.setItem('bc_taxdocs', JSON.stringify(docs));
}

// Trucks
export function getTrucks(): Truck[] {
  return JSON.parse(localStorage.getItem('bc_trucks') || JSON.stringify(DEFAULT_TRUCKS));
}
export function saveTruck(truck: Truck): void {
  const trucks = getTrucks();
  const idx = trucks.findIndex(t => t.id === truck.id);
  if (idx >= 0) trucks[idx] = truck;
  else trucks.push(truck);
  localStorage.setItem('bc_trucks', JSON.stringify(trucks));
}

// Truck Requests
export function getTruckRequests(): TruckRequest[] {
  return JSON.parse(localStorage.getItem('bc_truck_requests') || '[]');
}
export function saveTruckRequest(req: TruckRequest): void {
  const reqs = getTruckRequests();
  reqs.push(req);
  localStorage.setItem('bc_truck_requests', JSON.stringify(reqs));
}
export function updateTruckRequest(req: TruckRequest): void {
  const reqs = getTruckRequests().map(r => r.id === req.id ? req : r);
  localStorage.setItem('bc_truck_requests', JSON.stringify(reqs));
}

// Audit Logs
export function getAuditLogs(): AuditLog[] {
  return JSON.parse(localStorage.getItem('bc_audit_logs') || '[]');
}
export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  logs.unshift({
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  if (logs.length > 500) logs.splice(500);
  localStorage.setItem('bc_audit_logs', JSON.stringify(logs));
}

// Settings
export function getSettings(): AppSettings {
  const stored = localStorage.getItem('bc_settings');
  if (!stored) return DEFAULT_SETTINGS;
  const parsed = JSON.parse(stored);
  return { ...DEFAULT_SETTINGS, ...parsed };
}
export function saveSettings(settings: AppSettings): void {
  localStorage.setItem('bc_settings', JSON.stringify(settings));
}

// Current user session
export function getCurrentUser(): User | null {
  const data = sessionStorage.getItem('bc_current_user') || localStorage.getItem('bc_remember_user');
  if (!data) return null;
  return JSON.parse(data);
}
export function setCurrentUser(user: User, remember = false): void {
  sessionStorage.setItem('bc_current_user', JSON.stringify(user));
  if (remember) localStorage.setItem('bc_remember_user', JSON.stringify(user));
}
export function clearCurrentUser(): void {
  sessionStorage.removeItem('bc_current_user');
  localStorage.removeItem('bc_remember_user');
  sessionStorage.removeItem('bc_token');
}
export function getAuthToken(): string | null {
  return sessionStorage.getItem('bc_token');
}
export function setAuthToken(token: string): void {
  sessionStorage.setItem('bc_token', token);
}

// User count for first-50 promo
export function getUserCount(): number {
  return parseInt(localStorage.getItem('bc_userCount') || '0', 10);
}
export function incrementUserCount(): number {
  const count = getUserCount() + 1;
  localStorage.setItem('bc_userCount', count.toString());
  return count;
}

// Inventory
export function getInventory(userId: string): InventoryItem[] {
  return JSON.parse(localStorage.getItem(`bc_inventory_${userId}`) || '[]');
}
export function saveInventoryItem(userId: string, item: InventoryItem): void {
  const items = getInventory(userId);
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) items[idx] = item;
  else items.push(item);
  localStorage.setItem(`bc_inventory_${userId}`, JSON.stringify(items));
}
export function deleteInventoryItem(userId: string, itemId: string): void {
  const items = getInventory(userId).filter(i => i.id !== itemId);
  localStorage.setItem(`bc_inventory_${userId}`, JSON.stringify(items));
}
