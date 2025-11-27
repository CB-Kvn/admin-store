import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Folder,
  Settings,
  Store,
  Warehouse,
  Percent,
  DollarSign,
  Receipt,
  Image,
  UserCog,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "./ui/sidebar";

const menuItems = [
  {
    title: "Resumen",
    items: [
      { title: "Panel", icon: LayoutDashboard, path: "/" },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { title: "Productos", icon: Package, path: "/products" },
      { title: "Categorías", icon: Folder, path: "/categories" },
      { title: "Atributos", icon: Tag, path: "/attributes" },
    ],
  },
  {
    title: "Ventas",
    items: [
      { title: "Órdenes", icon: ShoppingCart, path: "/orders" },
    ],
  },
  {
    title: "Inventario",
    items: [
      { title: "Almacenes", icon: Warehouse, path: "/warehouses" },
      { title: "Movimientos de Stock", icon: Package, path: "/stock-movements" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { title: "Descuentos", icon: Percent, path: "/discounts" },
      { title: "Banners", icon: Image, path: "/banners" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { title: "Gastos", icon: Receipt, path: "/expenses" },
    ],
  },
  {
    title: "Administración",
    items: [
      { title: "Usuarios", icon: UserCog, path: "/users" },
    ],
  },
];

interface AppSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AppSidebar({ currentPath, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarRail />
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sidebar-foreground">Grema Store</h2>
            <p className="text-xs text-muted-foreground">Panel de Administración</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.path)}
                      isActive={currentPath === item.path}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border px-6 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onNavigate("/settings")}>
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}