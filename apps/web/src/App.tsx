import { useState, useEffect } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { TopBar } from "./components/top-bar";
import { DashboardView } from "./components/views/dashboard-view";
import { ProductsView } from "./components/views/products-view";
import { ProductDetailView } from "./components/views/product-detail-view";
import { ProductFormView } from "./components/views/product-form-view";
import { ProductEditView } from "./components/views/product-edit-view";
import { OrdersView } from "./components/views/orders-view";
import { OrderDetailView } from "./components/views/order-detail-view";
import { CategoriesView } from "./components/views/categories-view";
import { CategoryDetailView } from "./components/views/category-detail-view";
import { CategoryFormView } from "./components/views/category-form-view";
import { UsersView } from "./components/views/users-view";
import { UserDetailView } from "./components/views/user-detail-view";
import { UserFormView } from "./components/views/user-form-view";
import { WarehousesView } from "./components/views/warehouses-view";
import { WarehouseDetailView } from "./components/views/warehouse-detail-view";
import { WarehouseFormView } from "./components/views/warehouse-form-view";
import { StockMovementsView } from "./components/views/stock-movements-view";
import { StockMovementFormView } from "./components/views/stock-movement-form-view";
import { DiscountsView } from "./components/views/discounts-view";
import { DiscountDetailView } from "./components/views/discount-detail-view";
import { DiscountFormView } from "./components/views/discount-form-view";
import { ExpensesView } from "./components/views/expenses-view";
import { ExpenseFormView } from "./components/views/expense-form-view";
import { BannersView } from "./components/views/banners-view";
import { BannerFormView } from "./components/views/banner-form-view";
import { CatalogAttributesView } from "./components/views/catalog-attributes-view";
import { ColorFormView } from "./components/views/color-form-view";
import { MaterialFormView } from "./components/views/material-form-view";
import { ClosureTypeFormView } from "./components/views/closure-type-form-view";
import { StoneFormView } from "./components/views/stone-form-view";
import { SizeFormView } from "./components/views/size-form-view";
import { Toaster } from "./components/ui/sonner";
import { PageTransition } from "./components/ui/page-transition";

type Route =
  | '/'
  | '/products'
  | '/products/new'
  | `/products/${string}`
  | '/orders'
  | `/orders/${string}`
  | '/categories'
  | '/categories/new'
  | `/categories/${string}`
  | '/attributes'
  | '/attributes/colors/new'
  | `/attributes/colors/${string}`
  | '/attributes/materials/new'
  | `/attributes/materials/${string}`
  | '/attributes/closure-types/new'
  | `/attributes/closure-types/${string}`
  | '/attributes/stones/new'
  | `/attributes/stones/${string}`
  | '/attributes/sizes/new'
  | `/attributes/sizes/${string}`
  | '/users'
  | '/users/new'
  | `/users/${string}`
  | '/warehouses'
  | '/warehouses/new'
  | `/warehouses/${string}`
  | '/stock-movements'
  | '/stock-movements/new'
  | `/stock-movements/new/${string}`
  | `/stock-movements/${string}`
  | '/discounts'
  | '/discounts/new'
  | `/discounts/${string}`
  | '/expenses'
  | '/expenses/new'
  | `/expenses/${string}`
  | '/banners'
  | '/banners/new'
  | `/banners/${string}`
  | '/settings';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (path: string) => {
    setCurrentRoute(path as Route);
  };

  const renderView = () => {
    // Product routes
    if (currentRoute === '/products/new') {
      return <ProductFormView onBack={() => setCurrentRoute('/products')} />;
    }
    if (currentRoute.startsWith('/products/') && currentRoute !== '/products') {
      const path = currentRoute.replace('/products/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const productId = path.replace('/edit', '');
        return (
          <ProductEditView
            productId={productId}
            onBack={() => setCurrentRoute(`/products/${productId}` as Route)}
          />
        );
      }
      
      // Otherwise, show detail view
      return (
        <ProductDetailView
          productId={path}
          onBack={() => setCurrentRoute('/products')}
          onEdit={(id) => setCurrentRoute(`/products/${id}/edit` as Route)}
          onManageStock={() => setCurrentRoute(`/stock-movements/new/${path}` as Route)}
        />
      );
    }

    // Order routes
    if (currentRoute.startsWith('/orders/') && currentRoute !== '/orders') {
      const orderId = currentRoute.replace('/orders/', '');
      return (
        <OrderDetailView
          orderId={orderId}
          onBack={() => setCurrentRoute('/orders')}
        />
      );
    }

    // User routes
    if (currentRoute === '/users/new') {
      return <UserFormView onBack={() => setCurrentRoute('/users')} />;
    }
    if (currentRoute.startsWith('/users/') && currentRoute !== '/users') {
      const path = currentRoute.replace('/users/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const userId = path.replace('/edit', '');
        return (
          <UserFormView
            userId={userId}
            onBack={() => setCurrentRoute(`/users/${userId}` as Route)}
          />
        );
      }
      
      // Otherwise, show detail view
      return (
        <UserDetailView
          userId={path}
          onBack={() => setCurrentRoute('/users')}
          onEdit={(id) => setCurrentRoute(`/users/${id}/edit` as Route)}
        />
      );
    }

    // Category routes
    if (currentRoute === '/categories/new') {
      return <CategoryFormView onBack={() => setCurrentRoute('/categories')} />;
    }
    if (currentRoute.startsWith('/categories/') && currentRoute !== '/categories') {
      const path = currentRoute.replace('/categories/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const categoryId = path.replace('/edit', '');
        return (
          <CategoryFormView
            categoryId={categoryId}
            onBack={() => setCurrentRoute(`/categories/${categoryId}` as Route)}
          />
        );
      }
      
      // Otherwise, show detail view
      return (
        <CategoryDetailView
          categoryId={path}
          onBack={() => setCurrentRoute('/categories')}
          onCategoryClick={id => setCurrentRoute(`/categories/${id}` as Route)}
          onProductClick={id => setCurrentRoute(`/products/${id}/edit` as Route)}
          onEdit={id => setCurrentRoute(`/categories/${id}/edit` as Route)}
        />
      );
    }

    // Warehouse routes
    if (currentRoute === '/warehouses/new') {
      return <WarehouseFormView onBack={() => setCurrentRoute('/warehouses')} />;
    }
    if (currentRoute.startsWith('/warehouses/') && currentRoute !== '/warehouses') {
      const path = currentRoute.replace('/warehouses/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const warehouseId = path.replace('/edit', '');
        return (
          <WarehouseFormView
            warehouseId={warehouseId}
            onBack={() => setCurrentRoute(`/warehouses/${warehouseId}` as Route)}
          />
        );
      }
      
      // Otherwise, show detail view
      return (
        <WarehouseDetailView
          warehouseId={path}
          onBack={() => setCurrentRoute('/warehouses')}
          onEdit={(id) => setCurrentRoute(`/warehouses/${id}/edit` as Route)}
        />
      );
    }

    // Stock movement routes
    if (currentRoute.startsWith('/stock-movements/new')) {
      // Extract productId if present in the route
      const productId = currentRoute.replace('/stock-movements/new/', '').replace('/stock-movements/new', '');
      return (
        <StockMovementFormView 
          onBack={() => setCurrentRoute('/stock-movements')} 
          productId={productId || undefined}
        />
      );
    }
    if (currentRoute.startsWith('/stock-movements/') && currentRoute !== '/stock-movements') {
      const path = currentRoute.replace('/stock-movements/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const stockMovementId = path.replace('/edit', '');
        return (
          <StockMovementFormView
            stockMovementId={stockMovementId}
            onBack={() => setCurrentRoute('/stock-movements')}
          />
        );
      }
    }

    // Discount routes
    if (currentRoute === '/discounts/new') {
      return <DiscountFormView onBack={() => setCurrentRoute('/discounts')} />;
    }
    if (currentRoute.startsWith('/discounts/') && currentRoute !== '/discounts') {
      const path = currentRoute.replace('/discounts/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const discountId = path.replace('/edit', '');
        return (
          <DiscountFormView
            discountId={discountId}
            onBack={() => setCurrentRoute(`/discounts/${discountId}` as Route)}
          />
        );
      }
      
      // Otherwise, show detail view
      return (
        <DiscountDetailView
          discountId={path}
          onBack={() => setCurrentRoute('/discounts')}
          onEdit={(id) => setCurrentRoute(`/discounts/${id}/edit` as Route)}
        />
      );
    }

    // Expense routes
    if (currentRoute === '/expenses/new') {
      return <ExpenseFormView onBack={() => setCurrentRoute('/expenses')} />;
    }
    if (currentRoute.startsWith('/expenses/') && currentRoute !== '/expenses') {
      const path = currentRoute.replace('/expenses/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const expenseId = path.replace('/edit', '');
        return (
          <ExpenseFormView
            expenseId={expenseId}
            onBack={() => setCurrentRoute('/expenses')}
          />
        );
      }
    }

    // Banner routes
    if (currentRoute === '/banners/new') {
      return <BannerFormView onBack={() => setCurrentRoute('/banners')} />;
    }
    if (currentRoute.startsWith('/banners/') && currentRoute !== '/banners') {
      const path = currentRoute.replace('/banners/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const bannerId = path.replace('/edit', '');
        return (
          <BannerFormView
            bannerId={bannerId}
            onBack={() => setCurrentRoute('/banners')}
          />
        );
      }
    }

    // Catalog Attributes routes
    // Color routes
    if (currentRoute === '/attributes/colors/new') {
      return <ColorFormView onBack={() => setCurrentRoute('/attributes')} />;
    }
    if (currentRoute.startsWith('/attributes/colors/') && currentRoute !== '/attributes/colors/new') {
      const path = currentRoute.replace('/attributes/colors/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const colorId = path.replace('/edit', '');
        return (
          <ColorFormView
            colorId={colorId}
            onBack={() => setCurrentRoute('/attributes')}
          />
        );
      }
    }

    // Material routes
    if (currentRoute === '/attributes/materials/new') {
      return <MaterialFormView onBack={() => setCurrentRoute('/attributes')} />;
    }
    if (currentRoute.startsWith('/attributes/materials/') && currentRoute !== '/attributes/materials/new') {
      const path = currentRoute.replace('/attributes/materials/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const materialId = path.replace('/edit', '');
        return (
          <MaterialFormView
            materialId={materialId}
            onBack={() => setCurrentRoute('/attributes')}
          />
        );
      }
    }

    // Closure Type routes
    if (currentRoute === '/attributes/closure-types/new') {
      return <ClosureTypeFormView onBack={() => setCurrentRoute('/attributes')} />;
    }
    if (currentRoute.startsWith('/attributes/closure-types/') && currentRoute !== '/attributes/closure-types/new') {
      const path = currentRoute.replace('/attributes/closure-types/', '');
      
      // Check if it's edit mode
      if (path.includes('/edit')) {
        const closureTypeId = path.replace('/edit', '');
        return (
          <ClosureTypeFormView
            closureTypeId={closureTypeId}
            onBack={() => setCurrentRoute('/attributes')}
          />
        );
      }
    }

    // Stone routes
    if (currentRoute === '/attributes/stones/new') {
      return <StoneFormView onBack={() => setCurrentRoute('/attributes')} />;
    }
    if (currentRoute.startsWith('/attributes/stones/') && currentRoute !== '/attributes/stones/new') {
      const path = currentRoute.replace('/attributes/stones/', '');
      if (path.includes('/edit')) {
        const stoneId = path.replace('/edit', '');
        return (
          <StoneFormView
            stoneId={stoneId}
            onBack={() => setCurrentRoute('/attributes')}
          />
        );
      }
    }

    // Size routes
    if (currentRoute === '/attributes/sizes/new') {
      return <SizeFormView onBack={() => setCurrentRoute('/attributes')} />;
    }
    if (currentRoute.startsWith('/attributes/sizes/') && currentRoute !== '/attributes/sizes/new') {
      const path = currentRoute.replace('/attributes/sizes/', '');
      if (path.includes('/edit')) {
        const sizeId = path.replace('/edit', '');
        return (
          <SizeFormView
            sizeId={sizeId}
            onBack={() => setCurrentRoute('/attributes')}
          />
        );
      }
    }

    // Main routes
    switch (currentRoute) {
      case '/':
        return <DashboardView />;
      case '/products':
        return (
          <ProductsView
            onProductClick={id => setCurrentRoute(`/products/${id}/edit` as Route)}
            onAddProduct={() => setCurrentRoute('/products/new')}
          />
        );
      case '/orders':
        return (
          <OrdersView
            onOrderClick={id => setCurrentRoute(`/orders/${id}` as Route)}
          />
        );
      case '/categories':
        return (
          <CategoriesView
            onCategoryClick={id => setCurrentRoute(`/categories/${id}` as Route)}
            onAddCategory={() => setCurrentRoute('/categories/new')}
          />
        );
      case '/attributes':
        return (
          <CatalogAttributesView
            onAddColor={() => setCurrentRoute('/attributes/colors/new')}
            onColorClick={id => setCurrentRoute(`/attributes/colors/${id}/edit` as Route)}
            onAddMaterial={() => setCurrentRoute('/attributes/materials/new')}
            onMaterialClick={id => setCurrentRoute(`/attributes/materials/${id}/edit` as Route)}
            onAddClosureType={() => setCurrentRoute('/attributes/closure-types/new')}
            onClosureTypeClick={id => setCurrentRoute(`/attributes/closure-types/${id}/edit` as Route)}
            onAddStone={() => setCurrentRoute('/attributes/stones/new')}
            onStoneClick={id => setCurrentRoute(`/attributes/stones/${id}/edit` as Route)}
            onAddSize={() => setCurrentRoute('/attributes/sizes/new')}
            onSizeClick={id => setCurrentRoute(`/attributes/sizes/${id}/edit` as Route)}
          />
        );
      case '/users':
        return (
          <UsersView 
            onUserClick={id => setCurrentRoute(`/users/${id}` as Route)}
            onAddUser={() => setCurrentRoute('/users/new')}
          />
        );
      case '/warehouses':
        return (
          <WarehousesView 
            onWarehouseClick={id => setCurrentRoute(`/warehouses/${id}/edit` as Route)}
            onAddWarehouse={() => setCurrentRoute('/warehouses/new')}
          />
        );
      case '/stock-movements':
        return (
          <StockMovementsView 
            onAddMovement={() => setCurrentRoute('/stock-movements/new')}
            onEditMovement={id => setCurrentRoute(`/stock-movements/${id}/edit` as Route)}
          />
        );
      case '/discounts':
        return (
          <DiscountsView
            onDiscountClick={id => setCurrentRoute(`/discounts/${id}` as Route)}
            onAddDiscount={() => setCurrentRoute('/discounts/new')}
          />
        );
      case '/expenses':
        return (
          <ExpensesView 
            onAddExpense={() => setCurrentRoute('/expenses/new')}
            onEditExpense={id => setCurrentRoute(`/expenses/${id}/edit` as Route)}
          />
        );
      case '/banners':
        return (
          <BannersView 
            onAddBanner={() => setCurrentRoute('/banners/new')}
            onEditBanner={id => setCurrentRoute(`/banners/${id}/edit` as Route)}
          />
        );
      case '/settings':
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="mb-2">Configuración</h2>
              <p className="text-muted-foreground">Página de configuración próximamente</p>
            </div>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPath={currentRoute} onNavigate={handleNavigate} />

        <div className="flex-1 flex flex-col">
          <TopBar theme={theme} onThemeToggle={handleThemeToggle} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 md:p-8">
              <PageTransition key={currentRoute}>{renderView()}</PageTransition>
            </div>
          </main>
        </div>
      </div>

      <Toaster />
    </SidebarProvider>
  );
}