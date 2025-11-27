import { useState } from "react";
import { Search, Moon, Sun, Menu, Bell } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useSidebar, SidebarTrigger } from "./ui/sidebar";

interface TopBarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function TopBar({ theme, onThemeToggle }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <SidebarTrigger className="hidden lg:inline-flex" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos, órdenes, clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p>Nueva orden recibida</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-4">
                  Orden #ORD-1004 de Olivia Davis
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <p>Alerta de stock bajo</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-4">
                  Camiseta de Algodón Orgánico tiene stock bajo
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p>Nuevo cliente registrado</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-4">
                  Bienvenido nuevo cliente John Smith
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p>Usuario Admin</p>
                  <p className="text-xs text-muted-foreground">admin@grema.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}