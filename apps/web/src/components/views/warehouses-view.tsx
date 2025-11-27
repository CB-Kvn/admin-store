import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import { useWarehouses } from '../../hooks/useWarehouses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Progress } from '../ui/progress';

interface WarehousesViewProps {
  onWarehouseClick?: (warehouseId: string) => void;
  onAddWarehouse?: () => void;
}

export function WarehousesView({ onWarehouseClick, onAddWarehouse }: WarehousesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { warehouses, warehousesLoading } = useWarehouses();

  const filteredWarehouses = warehouses.filter((warehouse: any) => {
    const matchesSearch =
      (warehouse.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (warehouse.location ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || warehouse.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      active: 'success',
      inactive: 'default',
      maintenance: 'warning',
    };
    return variants[status] || 'default';
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (_value: any, warehouse: any) => (
        <div>
          <div className="text-foreground">{warehouse.name}</div>
          <div className="text-xs text-muted-foreground">{warehouse.location}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (_value: any, warehouse: any) => (
        <StatusBadge
          status={warehouse.status}
          variant={getStatusVariant(warehouse.status)}
        />
      ),
    },
    {
      key: 'capacity',
      label: 'Capacidad',
      sortable: true,
      render: (_value: any, warehouse: any) => {
        const capacity = Number(warehouse.capacity ?? 0);
        const occupancy = Number(warehouse.currentOccupancy ?? 0);
        const percentage = capacity > 0 ? (occupancy / capacity) * 100 : 0;
        return (
          <div className="space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between text-sm">
              <span>
                {occupancy.toLocaleString()} /{' '}
                {capacity.toLocaleString()}
              </span>
              <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
            </div>
            <Progress value={percentage} />
          </div>
        );
      },
    },
    {
      key: 'lastInventoryDate',
      label: 'Último inventario',
      sortable: true,
      render: (_value: any, warehouse: any) =>
        warehouse.lastInventoryDate
          ? new Date(warehouse.lastInventoryDate).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
    {
      key: 'createdAt',
      label: 'Creado',
      sortable: true,
      render: (_value: any, warehouse: any) =>
        warehouse.createdAt
          ? new Date(warehouse.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          })
          : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Almacenes"
        description="Administra ubicaciones e inventario de almacenes"
        action={{
          label: 'Agregar almacén',
          onClick: () => onAddWarehouse?.(),
        }}
      />

      {warehousesLoading && (
        <div className="text-sm text-muted-foreground">Cargando almacenes...</div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar almacenes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredWarehouses}
        columns={columns}
        onRowClick={warehouse => onWarehouseClick?.(String(warehouse.id))}
      />
    </div>
  );
}
