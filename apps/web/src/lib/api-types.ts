// Backend API types and interfaces (guided by apps/api/README.md)

export type ID = string | number;

export interface HealthResponse {
  status: string; // "ok"
}

// Pagination & common params
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Users
export interface User {
  id: ID;
  email: string;
  role?: 'admin' | 'manager' | 'staff' | 'customer' | string;
  active?: boolean;
  firstName?: string;
  lastName?: string;
  lastLogin?: string; // ISO date
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

export interface UsersListParams extends PaginationParams {
  active?: boolean;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role?: User['role'];
  active?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  role?: User['role'];
  active?: boolean;
  firstName?: string;
  lastName?: string;
}

// Orders
export interface Address {
  id?: ID;
  firstName?: string;
  lastName?: string;
  line1?: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  id?: ID;
  orderId?: ID;
  itemId: ID;
  name?: string;
  quantity: number;
  price: number;
  discountAmount?: number;
}

export interface Order {
  id: ID;
  orderNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  paymentMethod?: string;
  phone?: string;
  shippingAmount?: number;
  subtotalAmount?: number;
  notes?: string;
  items?: OrderItem[];
  billingAddress?: Address;
  shippingAddress?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersListParams extends PaginationParams {
  q?: string;
  minDate?: string; // ISO date
  maxDate?: string; // ISO date
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  include?: string; // e.g. "items,billingAddress,shippingAddress"
}

export interface CreateOrderInput {
  order: Partial<Order> & { id?: ID };
  items?: Array<Partial<OrderItem>>;
  billingAddress?: Partial<Address>;
  shippingAddress?: Partial<Address>;
}

export interface UpdateOrderInput {
  order?: Partial<Order>;
  items?: Array<Partial<OrderItem>>; // replaces if sent
}

// Products
export interface Product {
  id: ID;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
  familyId?: ID;
  colorId?: ID;
  materialId?: ID;
  categoryId?: ID;
  createdAt?: string;
  updatedAt?: string;
  // Extra fields returned by API for discounts (enriched product)
  discountProducts?: DiscountProductWithDetails[];
  discountFamily?: DiscountFamilyWithDetails[];
  discountCategories?: ProductDiscount[];
  // Items con el mismo familyId
  relatedItems?: Product[];
}

// Full API Product shape used by product detail endpoint
export interface ApiProduct {
  id: number;
  familyId: string;
  familySlug: string;
  productName: string;
  productDescription: string;
  brand: string;
  productDetails: ApiProductDetails;
  productAvailable: boolean;
  sku: string;
  barcode: string;
  title: string;
  attributes: ApiAttribute[];
  price: number;
  compareAtPrice: number | null;
  currency: string;
  variantAvailable: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  images: ApiImage[];
  categories: ApiCategoryElement[];
  stocks: ApiStock[];
  discountProducts: ApiDiscountProductWithDetails[];
  discountFamily: ApiDiscountFamilyWithDetails[];
  discountCategories: ApiDiscount[];
  // Items relacionados por familia
  relatedItems?: ApiProduct[];
}

export interface ApiAttribute {
  material?: string;
  stone?: string;
  size?: string;
  closureType?: string;
}

export interface ApiCategoryElement {
  itemId: number;
  categoryId: number;
  assignedAt: string | Date;
  category: ApiCategoryCategory;
}

export interface ApiCategoryCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  DiscountCategory: ApiDiscountCategoryWithDetails[];
}

export interface ApiDiscountCategoryWithDetails {
  id: number;
  discountId: number;
  categoryId: number;
  discount: ApiDiscount;
}

export interface ApiDiscount {
  id: number;
  type: string;
  value: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  minQuantity: number | null;
  maxQuantity: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  code: string;
  usageLimit: number | null;
  timesUsed: number;
  isGlobal: boolean;
}

export interface ApiDiscountProductWithDetails {
  id: number;
  discountId: number;
  itemId: number;
  discount: ApiDiscount;
}

export interface ApiDiscountFamilyWithDetails {
  id: number;
  discountId: number;
  familyId: string;
  discount: ApiDiscount;
}

export interface ApiImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  state: boolean;
  itemId: number;
}

export interface ApiProductDetails {
  finish: string;
  origin?: string;
}

export interface ApiStock {
  id: string;
  itemId: number;
  warehouseId: string;
  quantity: number;
  minimumStock: number;
  location: string;
  status: string;
  lastUpdated: string | Date;
  price: number;
  cost: number;
  warehouse: ApiWarehouse;
}

export interface ApiWarehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  lastInventoryDate: string | Date;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductsListParams extends PaginationParams {}

export interface CreateProductInput extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateProductInput extends Partial<Omit<Product, 'id'>> {}

// Categories
export interface Category {
  id: ID;
  name: string;
  slug?: string;
  description?: string;
  parentId?: ID | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesListParams extends PaginationParams {}
export interface CreateCategoryInput extends Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateCategoryInput extends Partial<Omit<Category, 'id'>> {}

// Materials
export interface Material {
  id: ID;
  name: string;
  description?: string;
}

// Colors
export interface Color {
  id: ID;
  name: string;
  hex?: string;
}

// Sizes
export interface Size {
  id: ID;
  name: string;
  slug?: string;
  description?: string;
}

// Stones
export interface Stone {
  id: ID;
  name: string;
  slug?: string;
  description?: string;
}

// Closure Types
export interface ClosureType {
  id: ID;
  name: string;
  description?: string;
}

// Warehouses
export interface Warehouse {
  id: ID;
  name: string;
  location?: string;
  status?: 'active' | 'inactive' | 'maintenance' | string;
  capacity?: number;
}

// Warehouse Stock
export interface WarehouseStock {
  id: ID;
  warehouseId: ID;
  itemId: ID;
  quantity: number;
}

// Stock Movements
export interface StockMovement {
  id: ID;
  type: 'in' | 'out' | string;
  warehouseId: ID;
  itemId: ID;
  quantity: number;
  reason?: string;
}

// Discounts
export interface Discount {
  id: ID;
  name: string;
  percentage?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface DiscountCategory {
  id: ID;
  discountId: ID;
  categoryId: ID;
}

export interface DiscountFamily {
  id: ID;
  discountId: ID;
  familyId: ID;
}

export interface DiscountProduct {
  id: ID;
  discountId: ID;
  productId: ID;
}

export interface DiscountUser {
  id: ID;
  discountId: ID;
  userId: ID;
}

// Enriched discount shapes used in products responses
export interface ProductDiscount {
  id: ID;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | string;
  value: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  createdAt?: string;
  updatedAt?: string;
  code?: string;
  usageLimit?: number | null;
  timesUsed?: number;
  isGlobal?: boolean;
}

export interface DiscountProductWithDetails {
  id: ID;
  discountId: ID;
  itemId: ID;
  discount: ProductDiscount;
}

export interface DiscountFamilyWithDetails {
  id: ID;
  discountId: ID;
  familyId: ID;
  discount: ProductDiscount;
}

// Documents
export interface Document {
  id: ID;
  userId?: ID;
  type?: string;
  title?: string;
  name?: string;
  fileName?: string;
  url?: string;
  mimeType?: string;
  createdAt?: string;
}

export interface CreateDocumentInput {
  user?: { connect: { id: ID } };
  type?: string;
  title?: string;
  name?: string;
  fileName?: string;
  url?: string;
  mimeType?: string;
}

// OAuth Accounts
export interface OAuthAccount {
  id: ID;
  provider: string;
  providerAccountId: string;
  userId: ID;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: string;
  scope?: string;
}

export interface CreateOAuthAccountInput extends Omit<OAuthAccount, 'id'> {}

// Expenses
export interface Expense {
  id: ID;
  description: string;
  amount: number;
  date?: string;
  category?: string;
  paymentMethod?: string;
  userId?: ID;
  notes?: string;
  subtotal?: number;
  taxes?: number;
}

// Banners (conforme al backend Prisma schema)
export type BannerStatusApi = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface Banner {
  id: ID;
  name: string;
  dateInit?: string; // ISO Date
  dateEnd?: string; // ISO Date
  imageUrl?: string;
  status: BannerStatusApi;
  createdAt?: string; // ISO Date
  updatedAt?: string; // ISO Date
}

export interface CreateBannerInput extends Omit<Banner, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateBannerInput extends Partial<Omit<Banner, 'id'>> {}