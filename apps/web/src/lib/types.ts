// Data types for Grema Store Admin

// Enums
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type UserRole = 'admin' | 'manager' | 'staff' | 'customer';
export type WarehouseStatus = 'active' | 'inactive' | 'maintenance';
export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
export type DiscountType = 'percentage' | 'fixed' | 'buy_x_get_y';
export type DocumentType = 'invoice' | 'receipt' | 'shipping_label' | 'packing_slip' | 'other';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type ExpenseCategory =
  | 'MATERIALS'
  | 'TOOLS'
  | 'MARKETING'
  | 'SALARIES'
  | 'RENT'
  | 'SERVICES'
  | 'OTHER';
export type BannerStatus = 'active' | 'scheduled' | 'expired' | 'draft';
export type ItemStatus = 'pending' | 'completed' | 'uncompleted' | 'cancelled';

// Address
export interface Address {
  id: string;
  userId?: string;
  orderId?: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// User & Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  createdAt: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Product Attributes
export interface Color {
  id: string;
  name: string;
  hex: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClosureType {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

// Product & Variants
export interface Image {
  id: string;
  productId?: string;
  variantId?: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  currency: string;
  size?: string;
  colorId?: string;
  color?: Color;
  materialIds: string[];
  materials?: Material[];
  closureTypeIds: string[];
  closureTypes?: ClosureType[];
  available: boolean;
  images?: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  description: string;
  details?: Record<string, any>;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  quantity: number;
  stockStatus: StockStatus;
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  images?: Image[];
  variants?: ProductVariant[];
  tags: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
  // Quick summary for discount presence per product (counts)
  discountCounts?: {
    products: number;
    family: number;
    categories: number;
  };
}

// Warehouse & Inventory
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  status: WarehouseStatus;
  capacity: number;
  currentOccupancy: number;
  lastInventoryDate?: string;
  createdAt: string;
}

export interface WarehouseStock {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  variantId: string;
  variant?: ProductVariant;
  quantity: number;
  minimumStock: number;
  status: StockStatus;
  price: number;
  cost: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  warehouseId: string;
  warehouse?: Warehouse;
  variantId: string;
  variant?: ProductVariant;
  type: MovementType;
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
  userId: string;
  user?: User;
}

// Discount
export interface Discount {
  id: string;
  code?: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isGlobal: boolean;
  usageLimit?: number;
  timesUsed: number;
  minQuantity?: number;
  maxQuantity?: number;
  createdAt: string;
}

export interface DiscountProduct {
  discountId: string;
  productId: string;
}

export interface DiscountCategory {
  discountId: string;
  categoryId: string;
}

export interface DiscountVariant {
  discountId: string;
  variantId: string;
}

export interface DiscountUser {
  discountId: string;
  userId: string;
}

// Order & Documents
export interface Document {
  id: string;
  orderId: string;
  type: DocumentType;
  status: DocumentStatus;
  title: string;
  url: string;
  mimeType: string;
  size: number;
  hash: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: ItemStatus;
  qtyDone: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId?: string;
  buyer?: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  tax: number;
  total: number;
  billingAddressId?: string;
  billingAddress?: Address;
  shippingAddressId?: string;
  shippingAddress?: Address;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  documents?: Document[];
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

// Expense
export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  subtotal: number;
  taxes: number;
  category: ExpenseCategory;
  paymentMethod: string;
  state: 'pending' | 'approved' | 'rejected';
  userId: string;
  user?: User;
  approvedBy?: string;
  approver?: User;
  approvedAt?: string;
  receipt?: string;
  createdAt: string;
}

// Banner
export interface Banner {
  id: string;
  name: string;
  dateInit: string;
  dateEnd: string;
  status: BannerStatus;
  imageUrl: string;
  linkUrl?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Dashboard
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalUsers: number;
  usersChange: number;
  averageOrderValue: number;
  aovChange: number;
}