import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { mockOrders } from "../../lib/mock-data";
import { Order } from "../../lib/types";
import { DataTable } from "../data-table";
import { StatusBadge } from "../status-badge";
import { PageHeader } from "../page-header";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface OrdersViewProps {
  onOrderClick?: (orderId: string) => void;
}

export function OrdersView({ onOrderClick }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      processing: 'warning',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'error',
    };
    return variants[status] || 'default';
  };

  const getPaymentVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'default',
      partially_refunded: 'warning',
    };
    return variants[status] || 'default';
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Orden',
      sortable: true,
      render: (_value: any, order: Order) => (
        <div>
          <div className="text-foreground">{order.orderNumber}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(order.orderDate).toLocaleDateString('es-ES')}
          </div>
        </div>
      ),
    },
    {
      key: 'buyer',
      label: 'Comprador',
      sortable: true,
      render: (_value: any, order: Order) =>
        order.buyer?.name || 'Desconocido',
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (_value: any, order: Order) => (
        <StatusBadge
          status={order.status}
          variant={getStatusVariant(order.status)}
        />
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Pago',
      sortable: true,
      render: (_value: any, order: Order) => (
        <StatusBadge
          status={order.paymentStatus.replace('_', ' ')}
          variant={getPaymentVariant(order.paymentStatus)}
        />
      ),
    },
    {
      key: 'items',
      label: 'Artículos',
      render: (_value: any, order: Order) => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return `${totalItems} artículos`;
      },
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (_value: any, order: Order) => `$${order.total.toFixed(2)}`,
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      render: (_value: any, order: Order) =>
        new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Órdenes"
        description="Administra las órdenes de clientes y el cumplimiento"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar órdenes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Pagos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="paid">Pagado</SelectItem>
              <SelectItem value="failed">Fallido</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        onRowClick={order => onOrderClick?.(order.id)}
      />
    </div>
  );
}