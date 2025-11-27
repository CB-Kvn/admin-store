import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  HealthResponse,
  PaginationParams,
  User,
  UsersListParams,
  CreateUserInput,
  UpdateUserInput,
  Order,
  OrdersListParams,
  CreateOrderInput,
  UpdateOrderInput,
  Product,
  ApiProduct,
  ProductsListParams,
  CreateProductInput,
  UpdateProductInput,
  Category,
  CategoriesListParams,
  CreateCategoryInput,
  UpdateCategoryInput,
  Material,
  Color,
  Size,
  Stone,
  ClosureType,
  Warehouse,
  WarehouseStock,
  StockMovement,
  Discount,
  DiscountCategory,
  DiscountFamily,
  DiscountProduct,
  DiscountUser,
  Document,
  CreateDocumentInput,
  OAuthAccount,
  CreateOAuthAccountInput,
  Expense,
  Banner,
  CreateBannerInput,
  UpdateBannerInput,
  ID,
} from '../lib/api-types';

const BASE_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'Health',
    'Users',
    'Orders',
    'Products',
    'Categories',
    'Materials',
    'Colors',
    'Sizes',
    'Stones',
    'ClosureTypes',
    'Warehouses',
    'WarehouseStocks',
    'StockMovements',
    'Discounts',
    'DiscountCategories',
    'DiscountFamilies',
    'DiscountProducts',
    'DiscountUsers',
    'Documents',
    'OAuthAccounts',
    'Expenses',
    'Banners',
  ],
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 60, // reduce refetch pressure
  endpoints: (builder) => ({
    // Health
    getHealth: builder.query<HealthResponse, void>({
      query: () => ({ url: 'health' }),
      providesTags: ['Health'],
    }),

    // Users
    getUsers: builder.query<User[], UsersListParams | undefined>({
      query: (params) => ({ url: 'users', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: 'Users' as const, id: u.id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUserById: builder.query<User, ID>({
      query: (id) => ({ url: `users/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation<User, CreateUserInput>({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: ID; changes: UpdateUserInput }>({
      query: ({ id, changes }) => ({ url: `users/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),
    deleteUser: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `users/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id }, { type: 'Users', id: 'LIST' }],
    }),

    // Orders
    getOrders: builder.query<Order[], OrdersListParams | undefined>({
      query: (params) => ({ url: 'orders', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((o) => ({ type: 'Orders' as const, id: o.id })),
              { type: 'Orders' as const, id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
    getOrderById: builder.query<Order, { id: ID; include?: string }>({
      query: ({ id, include }) => ({ url: `orders/${id}`, params: include ? { include } : undefined }),
      providesTags: (result, error, { id }) => [{ type: 'Orders', id }],
    }),
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (body) => ({ url: 'orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    updateOrder: builder.mutation<Order, { id: ID; changes: UpdateOrderInput }>({
      query: ({ id, changes }) => ({ url: `orders/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Orders', id }],
    }),
    deleteOrder: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `orders/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Orders', id }, { type: 'Orders', id: 'LIST' }],
    }),

    // Products
    getProducts: builder.query<Product[], ProductsListParams | undefined>({
      query: (params) => ({ url: 'products', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Products' as const, id: p.id })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductById: builder.query<ApiProduct, ID>({
      query: (id) => ({ url: `products/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({ url: 'products', method: 'POST', body }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<Product, { id: ID; changes: UpdateProductInput }>({
      query: ({ id, changes }) => ({ url: `products/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `products/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Products', id }, { type: 'Products', id: 'LIST' }],
    }),

    // Categories
    getCategories: builder.query<Category[], CategoriesListParams | undefined>({
      query: (params) => ({ url: 'categories', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: 'Categories' as const, id: c.id })),
              { type: 'Categories' as const, id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),
    getCategoryById: builder.query<Category, ID>({
      query: (id) => ({ url: `categories/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),
    createCategory: builder.mutation<Category, CreateCategoryInput>({
      query: (body) => ({ url: 'categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<Category, { id: ID; changes: UpdateCategoryInput }>({
      query: ({ id, changes }) => ({ url: `categories/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Categories', id }],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Categories', id }, { type: 'Categories', id: 'LIST' }],
    }),

    // Materials
    getMaterials: builder.query<Material[], PaginationParams | undefined>({
      query: (params) => {
        const { limit = 20, offset = 0 } = params ?? {};
        return { url: 'materials', params: { limit, offset } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({ type: 'Materials' as const, id: m.id })),
              { type: 'Materials' as const, id: 'LIST' },
            ]
          : [{ type: 'Materials', id: 'LIST' }],
    }),
    getMaterialById: builder.query<Material, ID>({
      query: (id) => ({ url: `materials/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Materials', id }],
    }),
    createMaterial: builder.mutation<Material, Omit<Material, 'id'>>({
      query: (body) => ({ url: 'materials', method: 'POST', body }),
      invalidatesTags: [{ type: 'Materials', id: 'LIST' }],
    }),
    updateMaterial: builder.mutation<Material, { id: ID; changes: Partial<Omit<Material, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `materials/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Materials', id }],
    }),
    deleteMaterial: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `materials/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Materials', id }, { type: 'Materials', id: 'LIST' }],
    }),

    // Colors
    getColors: builder.query<Color[], PaginationParams | undefined>({
      query: (params) => {
        const { limit = 20, offset = 0 } = params ?? {};
        return { url: 'colors', params: { limit, offset } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: 'Colors' as const, id: c.id })),
              { type: 'Colors' as const, id: 'LIST' },
            ]
          : [{ type: 'Colors', id: 'LIST' }],
    }),
    getColorById: builder.query<Color, ID>({
      query: (id) => ({ url: `colors/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Colors', id }],
    }),
    createColor: builder.mutation<Color, Omit<Color, 'id'>>({
      query: (body) => ({ url: 'colors', method: 'POST', body }),
      invalidatesTags: [{ type: 'Colors', id: 'LIST' }],
    }),
    updateColor: builder.mutation<Color, { id: ID; changes: Partial<Omit<Color, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `colors/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Colors', id }],
    }),
    deleteColor: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `colors/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Colors', id }, { type: 'Colors', id: 'LIST' }],
    }),

    // Sizes
    getSizes: builder.query<Size[], PaginationParams | undefined>({
      query: (params) => {
        const { limit = 20, offset = 0 } = params ?? {};
        return { url: 'sizes', params: { limit, offset } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: 'Sizes' as const, id: s.id })),
              { type: 'Sizes' as const, id: 'LIST' },
            ]
          : [{ type: 'Sizes', id: 'LIST' }],
    }),
    getSizeById: builder.query<Size, ID>({
      query: (id) => ({ url: `sizes/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Sizes', id }],
    }),
    createSize: builder.mutation<Size, Omit<Size, 'id'>>({
      query: (body) => ({ url: 'sizes', method: 'POST', body }),
      invalidatesTags: [{ type: 'Sizes', id: 'LIST' }],
    }),
    updateSize: builder.mutation<Size, { id: ID; changes: Partial<Omit<Size, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `sizes/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Sizes', id }],
    }),
    deleteSize: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `sizes/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Sizes', id }, { type: 'Sizes', id: 'LIST' }],
    }),

    // Stones
    getStones: builder.query<Stone[], PaginationParams | undefined>({
      query: (params) => {
        const { limit = 20, offset = 0 } = params ?? {};
        return { url: 'stones', params: { limit, offset } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: 'Stones' as const, id: s.id })),
              { type: 'Stones' as const, id: 'LIST' },
            ]
          : [{ type: 'Stones', id: 'LIST' }],
    }),
    getStoneById: builder.query<Stone, ID>({
      query: (id) => ({ url: `stones/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Stones', id }],
    }),
    createStone: builder.mutation<Stone, Omit<Stone, 'id'>>({
      query: (body) => ({ url: 'stones', method: 'POST', body }),
      invalidatesTags: [{ type: 'Stones', id: 'LIST' }],
    }),
    updateStone: builder.mutation<Stone, { id: ID; changes: Partial<Omit<Stone, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `stones/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Stones', id }],
    }),
    deleteStone: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `stones/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Stones', id }, { type: 'Stones', id: 'LIST' }],
    }),

    // Closure Types
    getClosureTypes: builder.query<ClosureType[], PaginationParams | undefined>({
      query: (params) => {
        const { limit = 20, offset = 0 } = params ?? {};
        return { url: 'closure-types', params: { limit, offset } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((ct) => ({ type: 'ClosureTypes' as const, id: ct.id })),
              { type: 'ClosureTypes' as const, id: 'LIST' },
            ]
          : [{ type: 'ClosureTypes', id: 'LIST' }],
    }),
    getClosureTypeById: builder.query<ClosureType, ID>({
      query: (id) => ({ url: `closure-types/${id}` }),
      providesTags: (result, error, id) => [{ type: 'ClosureTypes', id }],
    }),
    createClosureType: builder.mutation<ClosureType, Omit<ClosureType, 'id'>>({
      query: (body) => ({ url: 'closure-types', method: 'POST', body }),
      invalidatesTags: [{ type: 'ClosureTypes', id: 'LIST' }],
    }),
    updateClosureType: builder.mutation<ClosureType, { id: ID; changes: Partial<Omit<ClosureType, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `closure-types/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'ClosureTypes', id }],
    }),
    deleteClosureType: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `closure-types/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'ClosureTypes', id }, { type: 'ClosureTypes', id: 'LIST' }],
    }),

    // Warehouses
    getWarehouses: builder.query<Warehouse[], PaginationParams | undefined>({
      query: (params) => ({ url: 'warehouses', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: 'Warehouses' as const, id: w.id })),
              { type: 'Warehouses' as const, id: 'LIST' },
            ]
          : [{ type: 'Warehouses', id: 'LIST' }],
    }),
    getWarehouseById: builder.query<Warehouse, ID>({
      query: (id) => ({ url: `warehouses/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Warehouses', id }],
    }),
    createWarehouse: builder.mutation<Warehouse, Omit<Warehouse, 'id'>>({
      query: (body) => ({ url: 'warehouses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Warehouses', id: 'LIST' }],
    }),
    updateWarehouse: builder.mutation<Warehouse, { id: ID; changes: Partial<Omit<Warehouse, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `warehouses/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Warehouses', id }],
    }),
    deleteWarehouse: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `warehouses/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Warehouses', id }, { type: 'Warehouses', id: 'LIST' }],
    }),

    // Warehouse Stocks
    getWarehouseStocks: builder.query<WarehouseStock[], PaginationParams | undefined>({
      query: (params) => ({ url: 'warehouse-stocks', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((ws) => ({ type: 'WarehouseStocks' as const, id: ws.id })),
              { type: 'WarehouseStocks' as const, id: 'LIST' },
            ]
          : [{ type: 'WarehouseStocks', id: 'LIST' }],
    }),
    getWarehouseStockById: builder.query<WarehouseStock, ID>({
      query: (id) => ({ url: `warehouse-stocks/${id}` }),
      providesTags: (result, error, id) => [{ type: 'WarehouseStocks', id }],
    }),
    createWarehouseStock: builder.mutation<WarehouseStock, Omit<WarehouseStock, 'id'>>({
      query: (body) => ({ url: 'warehouse-stocks', method: 'POST', body }),
      invalidatesTags: [{ type: 'WarehouseStocks', id: 'LIST' }],
    }),
    updateWarehouseStock: builder.mutation<WarehouseStock, { id: ID; changes: Partial<Omit<WarehouseStock, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `warehouse-stocks/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'WarehouseStocks', id }],
    }),
    deleteWarehouseStock: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `warehouse-stocks/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'WarehouseStocks', id }, { type: 'WarehouseStocks', id: 'LIST' }],
    }),

    // Stock Movements
    getStockMovements: builder.query<StockMovement[], PaginationParams | undefined>({
      query: (params) => ({ url: 'stock-movements', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((sm) => ({ type: 'StockMovements' as const, id: sm.id })),
              { type: 'StockMovements' as const, id: 'LIST' },
            ]
          : [{ type: 'StockMovements', id: 'LIST' }],
    }),
    getStockMovementById: builder.query<StockMovement, ID>({
      query: (id) => ({ url: `stock-movements/${id}` }),
      providesTags: (result, error, id) => [{ type: 'StockMovements', id }],
    }),
    createStockMovement: builder.mutation<StockMovement, Omit<StockMovement, 'id'>>({
      query: (body) => ({ url: 'stock-movements', method: 'POST', body }),
      invalidatesTags: [{ type: 'StockMovements', id: 'LIST' }],
    }),
    updateStockMovement: builder.mutation<StockMovement, { id: ID; changes: Partial<Omit<StockMovement, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `stock-movements/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'StockMovements', id }],
    }),
    deleteStockMovement: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `stock-movements/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'StockMovements', id }, { type: 'StockMovements', id: 'LIST' }],
    }),

    // Discounts
    getDiscounts: builder.query<Discount[], PaginationParams | undefined>({
      query: (params) => ({ url: 'discounts', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((d) => ({ type: 'Discounts' as const, id: d.id })),
              { type: 'Discounts' as const, id: 'LIST' },
            ]
          : [{ type: 'Discounts', id: 'LIST' }],
    }),
    getDiscountById: builder.query<Discount, ID>({
      query: (id) => ({ url: `discounts/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Discounts', id }],
    }),
    createDiscount: builder.mutation<Discount, Omit<Discount, 'id'>>({
      query: (body) => ({ url: 'discounts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Discounts', id: 'LIST' }],
    }),
    updateDiscount: builder.mutation<Discount, { id: ID; changes: Partial<Omit<Discount, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `discounts/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Discounts', id }],
    }),
    deleteDiscount: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `discounts/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Discounts', id }, { type: 'Discounts', id: 'LIST' }],
    }),

    // Discount Associations
    getDiscountCategories: builder.query<DiscountCategory[], ({ discountId?: ID } & PaginationParams) | undefined>({
      query: (params) => ({ url: 'discount-categories', params }),
      providesTags: [{ type: 'DiscountCategories', id: 'LIST' }],
    }),
    createDiscountCategory: builder.mutation<DiscountCategory, Omit<DiscountCategory, 'id'>>({
      query: (body) => ({ url: 'discount-categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'DiscountCategories', id: 'LIST' }],
    }),
    updateDiscountCategory: builder.mutation<DiscountCategory, { id: ID; changes: Partial<Omit<DiscountCategory, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `discount-categories/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DiscountCategories', id }, { type: 'DiscountCategories', id: 'LIST' }],
    }),
    deleteDiscountCategory: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `discount-categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DiscountCategories', id: 'LIST' }],
    }),

    getDiscountFamilies: builder.query<DiscountFamily[], ({ discountId?: ID } & PaginationParams) | undefined>({
      query: (params) => ({ url: 'discount-families', params }),
      providesTags: [{ type: 'DiscountFamilies', id: 'LIST' }],
    }),
    createDiscountFamily: builder.mutation<DiscountFamily, Omit<DiscountFamily, 'id'>>({
      query: (body) => ({ url: 'discount-families', method: 'POST', body }),
      invalidatesTags: [{ type: 'DiscountFamilies', id: 'LIST' }],
    }),
    updateDiscountFamily: builder.mutation<DiscountFamily, { discountId: ID; familyId: ID; changes: Partial<Omit<DiscountFamily, 'id'>> }>({
      query: ({ discountId, familyId, changes }) => ({ url: `discount-families/${discountId}/${familyId}`, method: 'PUT', body: changes }),
      invalidatesTags: [{ type: 'DiscountFamilies', id: 'LIST' }],
    }),
    deleteDiscountFamily: builder.mutation<{ success: boolean }, { discountId: ID; familyId: ID }>({
      query: ({ discountId, familyId }) => ({ url: `discount-families/${discountId}/${familyId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DiscountFamilies', id: 'LIST' }],
    }),

    getDiscountProducts: builder.query<DiscountProduct[], ({ discountId?: ID } & PaginationParams) | undefined>({
      query: (params) => ({ url: 'discount-products', params }),
      providesTags: [{ type: 'DiscountProducts', id: 'LIST' }],
    }),
    createDiscountProduct: builder.mutation<DiscountProduct, Omit<DiscountProduct, 'id'>>({
      query: (body) => ({ url: 'discount-products', method: 'POST', body }),
      invalidatesTags: [{ type: 'DiscountProducts', id: 'LIST' }],
    }),
    updateDiscountProduct: builder.mutation<DiscountProduct, { id: ID; changes: Partial<Omit<DiscountProduct, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `discount-products/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DiscountProducts', id }, { type: 'DiscountProducts', id: 'LIST' }],
    }),
    deleteDiscountProduct: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `discount-products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DiscountProducts', id: 'LIST' }],
    }),

    getDiscountUsers: builder.query<DiscountUser[], ({ discountId?: ID } & PaginationParams) | undefined>({
      query: (params) => ({ url: 'discount-users', params }),
      providesTags: [{ type: 'DiscountUsers', id: 'LIST' }],
    }),
    createDiscountUser: builder.mutation<DiscountUser, Omit<DiscountUser, 'id'>>({
      query: (body) => ({ url: 'discount-users', method: 'POST', body }),
      invalidatesTags: [{ type: 'DiscountUsers', id: 'LIST' }],
    }),
    updateDiscountUser: builder.mutation<DiscountUser, { id: ID; changes: Partial<Omit<DiscountUser, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `discount-users/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DiscountUsers', id }, { type: 'DiscountUsers', id: 'LIST' }],
    }),
    deleteDiscountUser: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `discount-users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DiscountUsers', id: 'LIST' }],
    }),

    // Documents
    getDocuments: builder.query<Document[], (PaginationParams & { userId?: ID; type?: string; mimeType?: string; q?: string; orderBy?: string; orderDir?: 'asc' | 'desc' }) | undefined>({
      query: (params) => ({ url: 'documents', params }),
      providesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    getDocumentById: builder.query<Document, ID>({
      query: (id) => ({ url: `documents/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Documents', id }],
    }),
    createDocument: builder.mutation<Document, CreateDocumentInput>({
      query: (body) => ({ url: 'documents', method: 'POST', body }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    updateDocument: builder.mutation<Document, { id: ID; changes: Partial<CreateDocumentInput> }>({
      query: ({ id, changes }) => ({ url: `documents/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Documents', id }],
    }),
    deleteDocument: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `documents/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),

    // OAuth Accounts
    getOAuthAccounts: builder.query<OAuthAccount[], (PaginationParams & { userId?: ID }) | undefined>({
      query: (params) => ({ url: 'oauth-accounts', params }),
      providesTags: [{ type: 'OAuthAccounts', id: 'LIST' }],
    }),
    getOAuthAccountById: builder.query<OAuthAccount, ID>({
      query: (id) => ({ url: `oauth-accounts/${id}` }),
      providesTags: (result, error, id) => [{ type: 'OAuthAccounts', id }],
    }),
    createOAuthAccount: builder.mutation<OAuthAccount, CreateOAuthAccountInput>({
      query: (body) => ({ url: 'oauth-accounts', method: 'POST', body }),
      invalidatesTags: [{ type: 'OAuthAccounts', id: 'LIST' }],
    }),
    updateOAuthAccount: builder.mutation<OAuthAccount, { id: ID; changes: Partial<CreateOAuthAccountInput> }>({
      query: ({ id, changes }) => ({ url: `oauth-accounts/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'OAuthAccounts', id }],
    }),
    deleteOAuthAccount: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `oauth-accounts/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'OAuthAccounts', id: 'LIST' }],
    }),

    // Expenses
    getExpenses: builder.query<Expense[], PaginationParams | undefined>({
      query: (params) => ({ url: 'expenses', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((e) => ({ type: 'Expenses' as const, id: e.id })),
              { type: 'Expenses' as const, id: 'LIST' },
            ]
          : [{ type: 'Expenses', id: 'LIST' }],
    }),
    getExpenseById: builder.query<Expense, ID>({
      query: (id) => ({ url: `expenses/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Expenses', id }],
    }),
    createExpense: builder.mutation<Expense, Omit<Expense, 'id'>>({
      query: (body) => ({ url: 'expenses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),
    updateExpense: builder.mutation<Expense, { id: ID; changes: Partial<Omit<Expense, 'id'>> }>({
      query: ({ id, changes }) => ({ url: `expenses/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Expenses', id }],
    }),
    deleteExpense: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Expenses', id }, { type: 'Expenses', id: 'LIST' }],
    }),

    // Banners
    getBanners: builder.query<Banner[], PaginationParams | undefined>({
      query: (params) => ({ url: 'banners', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({ type: 'Banners' as const, id: b.id })),
              { type: 'Banners' as const, id: 'LIST' },
            ]
          : [{ type: 'Banners', id: 'LIST' }],
    }),
    getBannerById: builder.query<Banner, ID>({
      query: (id) => ({ url: `banners/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Banners', id }],
    }),
    createBanner: builder.mutation<Banner, CreateBannerInput>({
      query: (body) => ({ url: 'banners', method: 'POST', body }),
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
    }),
    updateBanner: builder.mutation<Banner, { id: ID; changes: UpdateBannerInput }>({
      query: ({ id, changes }) => ({ url: `banners/${id}`, method: 'PUT', body: changes }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Banners', id }],
    }),
    deleteBanner: builder.mutation<{ success: boolean }, ID>({
      query: (id) => ({ url: `banners/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Banners', id }, { type: 'Banners', id: 'LIST' }],
    }),
  }),
});

// Hooks (auto-generated by RTK Query)
export const {
  useGetHealthQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetMaterialsQuery,
  useGetMaterialByIdQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useGetColorsQuery,
  useGetColorByIdQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useGetSizesQuery,
  useGetSizeByIdQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
  useGetStonesQuery,
  useGetStoneByIdQuery,
  useCreateStoneMutation,
  useUpdateStoneMutation,
  useDeleteStoneMutation,
  useGetClosureTypesQuery,
  useGetClosureTypeByIdQuery,
  useCreateClosureTypeMutation,
  useUpdateClosureTypeMutation,
  useDeleteClosureTypeMutation,
  useGetWarehousesQuery,
  useGetWarehouseByIdQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehouseStocksQuery,
  useGetWarehouseStockByIdQuery,
  useCreateWarehouseStockMutation,
  useUpdateWarehouseStockMutation,
  useDeleteWarehouseStockMutation,
  useGetStockMovementsQuery,
  useGetStockMovementByIdQuery,
  useCreateStockMovementMutation,
  useUpdateStockMovementMutation,
  useDeleteStockMovementMutation,
  useGetDiscountsQuery,
  useGetDiscountByIdQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
  useGetDiscountCategoriesQuery,
  useCreateDiscountCategoryMutation,
  useUpdateDiscountCategoryMutation,
  useDeleteDiscountCategoryMutation,
  useGetDiscountFamiliesQuery,
  useCreateDiscountFamilyMutation,
  useUpdateDiscountFamilyMutation,
  useDeleteDiscountFamilyMutation,
  useGetDiscountProductsQuery,
  useCreateDiscountProductMutation,
  useUpdateDiscountProductMutation,
  useDeleteDiscountProductMutation,
  useGetDiscountUsersQuery,
  useCreateDiscountUserMutation,
  useUpdateDiscountUserMutation,
  useDeleteDiscountUserMutation,
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetOAuthAccountsQuery,
  useGetOAuthAccountByIdQuery,
  useCreateOAuthAccountMutation,
  useUpdateOAuthAccountMutation,
  useDeleteOAuthAccountMutation,
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = api;