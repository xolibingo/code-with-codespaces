export type Role = 'admin' | 'client';
export type PackageStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  role: Role;
  referralCode: string;
  referredBy?: string;
  discount: number;
  createdAt: string;
  blocked: boolean;
}

export interface Package {
  id: string;
  trackingNumber: string;
  userId: string;
  origin: string;
  destination: string;
  weight: number;
  status: PackageStatus;
  description: string;
  clearanceDocs: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  packageId?: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  items: InvoiceItem[];
  createdAt: string;
  dueDate: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface TaxDoc {
  id: string;
  userId: string;
  filename: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Truck {
  id: string;
  plate: string;
  capacity: string;
  status: 'available' | 'on_route' | 'maintenance';
  driver: string;
}

export interface TruckRequest {
  id: string;
  userId: string;
  truckId: string;
  startDate: string;
  endDate: string;
  origin: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  totalPrice: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  performedBy: string;
  action: string;
  targetType: 'user' | 'package' | 'invoice' | 'truck' | 'tax_doc' | 'settings';
  targetId: string;
  details: string;
}

export interface AppSettings {
  heroHeadline: string;
  heroSubheading: string;
  heroImageUrl: string;
  promoBanner: string;
  stripeLink: string;
  whatsappNumber: string;
  companyName: string;
  firstPromoEnabled: boolean;
  clearanceFee: number;
  truckRentalPerDay: number;
  routes: RoutePrice[];
}

export interface RoutePrice {
  origin: string;
  destination: string;
  pricePerKg: number;
  minDays: number;
  maxDays: number;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  value: number;
  notes: string;
  createdAt: string;
}
