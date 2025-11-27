
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  role: 'role',
  active: 'active',
  passwordChangedAt: 'passwordChangedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  loginAttempts: 'loginAttempts',
  lockedUntil: 'lockedUntil',
  lastLogin: 'lastLogin',
  refreshToken: 'refreshToken'
};

exports.Prisma.OAuthAccountScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  tokenType: 'tokenType',
  expiresAt: 'expiresAt',
  scope: 'scope',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CatalogItemScalarFieldEnum = {
  id: 'id',
  familyId: 'familyId',
  familySlug: 'familySlug',
  productName: 'productName',
  productDescription: 'productDescription',
  brand: 'brand',
  productDetails: 'productDetails',
  productAvailable: 'productAvailable',
  sku: 'sku',
  barcode: 'barcode',
  title: 'title',
  attributes: 'attributes',
  price: 'price',
  compareAtPrice: 'compareAtPrice',
  currency: 'currency',
  variantAvailable: 'variantAvailable',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ItemCategoryScalarFieldEnum = {
  itemId: 'itemId',
  categoryId: 'categoryId',
  assignedAt: 'assignedAt'
};

exports.Prisma.ColorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  hex: 'hex',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaterialScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClosureTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SizeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoneScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ImageScalarFieldEnum = {
  id: 'id',
  url: 'url',
  alt: 'alt',
  isPrimary: 'isPrimary',
  state: 'state',
  itemId: 'itemId'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  quantity: 'quantity',
  cartId: 'cartId',
  itemId: 'itemId',
  isGift: 'isGift',
  giftMessage: 'giftMessage',
  isBestSeller: 'isBestSeller',
  isNew: 'isNew'
};

exports.Prisma.WarehouseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location: 'location',
  address: 'address',
  manager: 'manager',
  phone: 'phone',
  email: 'email',
  capacity: 'capacity',
  currentOccupancy: 'currentOccupancy',
  status: 'status',
  lastInventoryDate: 'lastInventoryDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarehouseStockScalarFieldEnum = {
  id: 'id',
  itemId: 'itemId',
  warehouseId: 'warehouseId',
  quantity: 'quantity',
  minimumStock: 'minimumStock',
  location: 'location',
  status: 'status',
  lastUpdated: 'lastUpdated',
  price: 'price',
  cost: 'cost'
};

exports.Prisma.StockMovementScalarFieldEnum = {
  id: 'id',
  stockId: 'stockId',
  type: 'type',
  quantity: 'quantity',
  date: 'date',
  reference: 'reference',
  notes: 'notes',
  userId: 'userId'
};

exports.Prisma.DiscountScalarFieldEnum = {
  id: 'id',
  type: 'type',
  value: 'value',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  minQuantity: 'minQuantity',
  maxQuantity: 'maxQuantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  code: 'code',
  usageLimit: 'usageLimit',
  timesUsed: 'timesUsed',
  isGlobal: 'isGlobal'
};

exports.Prisma.DiscountProductScalarFieldEnum = {
  id: 'id',
  discountId: 'discountId',
  itemId: 'itemId'
};

exports.Prisma.DiscountCategoryScalarFieldEnum = {
  id: 'id',
  discountId: 'discountId',
  categoryId: 'categoryId'
};

exports.Prisma.DiscountFamilyScalarFieldEnum = {
  id: 'id',
  discountId: 'discountId',
  familyId: 'familyId'
};

exports.Prisma.DiscountUserScalarFieldEnum = {
  id: 'id',
  discountId: 'discountId',
  userId: 'userId',
  usageLimit: 'usageLimit',
  timesUsed: 'timesUsed',
  assignedAt: 'assignedAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  company: 'company',
  line1: 'line1',
  line2: 'line2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  orderNumber: 'orderNumber',
  status: 'status',
  orderDate: 'orderDate',
  expectedDeliveryDate: 'expectedDeliveryDate',
  actualDeliveryDate: 'actualDeliveryDate',
  totalAmount: 'totalAmount',
  paymentStatus: 'paymentStatus',
  trackingNumber: 'trackingNumber',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  buyerId: 'buyerId',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  paymentMethod: 'paymentMethod',
  phone: 'phone',
  shippingAmount: 'shippingAmount',
  subtotalAmount: 'subtotalAmount',
  discount: 'discount',
  billingAddressId: 'billingAddressId',
  shippingAddressId: 'shippingAddressId'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  itemId: 'itemId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  status: 'status',
  isBestSeller: 'isBestSeller',
  isGift: 'isGift',
  isNew: 'isNew',
  qtyDone: 'qtyDone',
  discountId: 'discountId',
  discountAmount: 'discountAmount'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  type: 'type',
  title: 'title',
  url: 'url',
  uploadedAt: 'uploadedAt',
  status: 'status',
  hash: 'hash',
  mimeType: 'mimeType',
  size: 'size'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  date: 'date',
  description: 'description',
  amount: 'amount',
  category: 'category',
  paymentMethod: 'paymentMethod',
  receipt: 'receipt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  state: 'state',
  subtotal: 'subtotal',
  taxes: 'taxes'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  userId: 'userId',
  changes: 'changes',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  timestamp: 'timestamp'
};

exports.Prisma.BannerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  dateInit: 'dateInit',
  dateEnd: 'dateEnd',
  imageUrl: 'imageUrl',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  WAREHOUSE: 'WAREHOUSE',
  MANAGER: 'MANAGER'
};

exports.WarehouseStatus = exports.$Enums.WarehouseStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE'
};

exports.StockStatus = exports.$Enums.StockStatus = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};

exports.MovementType = exports.$Enums.MovementType = {
  IN: 'IN',
  OUT: 'OUT',
  TRANSFER: 'TRANSFER'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  BUY_X_GET_Y: 'BUY_X_GET_Y'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID'
};

exports.OrderItemStatus = exports.$Enums.OrderItemStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  UNCOMPLETED: 'UNCOMPLETED'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  INVOICE: 'INVOICE',
  RECEIPT: 'RECEIPT',
  DELIVERY_NOTE: 'DELIVERY_NOTE',
  OTHER: 'OTHER'
};

exports.DocumentStatus = exports.$Enums.DocumentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.ExpenseCategory = exports.$Enums.ExpenseCategory = {
  MATERIALS: 'MATERIALS',
  TOOLS: 'TOOLS',
  MARKETING: 'MARKETING',
  SALARIES: 'SALARIES',
  RENT: 'RENT',
  SERVICES: 'SERVICES',
  OTHER: 'OTHER'
};

exports.BannerStatus = exports.$Enums.BannerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED'
};

exports.Prisma.ModelName = {
  User: 'User',
  OAuthAccount: 'OAuthAccount',
  Category: 'Category',
  CatalogItem: 'CatalogItem',
  ItemCategory: 'ItemCategory',
  Color: 'Color',
  Material: 'Material',
  ClosureType: 'ClosureType',
  Size: 'Size',
  Stone: 'Stone',
  Image: 'Image',
  Cart: 'Cart',
  CartItem: 'CartItem',
  Warehouse: 'Warehouse',
  WarehouseStock: 'WarehouseStock',
  StockMovement: 'StockMovement',
  Discount: 'Discount',
  DiscountProduct: 'DiscountProduct',
  DiscountCategory: 'DiscountCategory',
  DiscountFamily: 'DiscountFamily',
  DiscountUser: 'DiscountUser',
  Address: 'Address',
  PurchaseOrder: 'PurchaseOrder',
  OrderItem: 'OrderItem',
  Document: 'Document',
  Expense: 'Expense',
  AuditLog: 'AuditLog',
  Banner: 'Banner'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
