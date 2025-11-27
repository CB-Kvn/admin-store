import { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, ArrowLeftRight, Edit } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import type { StockMovement as ApiStockMovement } from '../../lib/api-types';
import { useStockMovements } from '../../hooks/useStockMovements';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface StockMovementsViewProps {
  onAddMovement?: () => void;
  onEditMovement?: (id: string) => void;
}

export function StockMovementsView({ onAddMovement, onEditMovement }: StockMovementsViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { stockMovements, stockMovementsLoading } = useStockMovements();

  const filteredMovements = stockMovements.filter((movement: any) => {
    const matchesSearch =
      (movement.reason ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(movement.itemId ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(movement.warehouseId ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || String(movement.type).toLowerCase() === String(typeFilter).toLowerCase();

    return matchesSearch && matchesType;
  });

  const getMovementIcon = (type: string) => {
    const icons = {
      IN: TrendingUp,
      OUT: TrendingDown,
      TRANSFER: ArrowLeftRight,
      ADJUSTMENT: ArrowLeftRight,
    };
    const key = String(type).toUpperCase();
    return icons[key as keyof typeof icons] || ArrowLeftRight;
  };

  const getMovementVariant = (type: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      IN: 'success',
      OUT: 'error',
      TRANSFER: 'warning',
      ADJUSTMENT: 'default',
    };
    const key = String(type).toUpperCase();
    return variants[key] || 'default';
  };

  const getMovementLabel = (type: string) => {
    const labels: Record<string, string> = {
      IN: 'Entrada',
      OUT: 'Salida',
      TRANSFER: 'Transferencia',
      ADJUSTMENT: 'Ajuste',
    };
    const key = String(type).toUpperCase();
    return labels[key] || type;
  };

  const columns = [
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (_value: any, movement: ApiStockMovement) => {
        const Icon = getMovementIcon(movement.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <StatusBadge
              status={getMovementLabel(movement.type)}
              variant={getMovementVariant(movement.type)}
            />
          </div>
        );
      },
    },
    {
      key: 'warehouseId',
      label: 'Almacén',
      sortable: true,
      render: (_value: any, movement: ApiStockMovement) => String(movement.warehouseId ?? '—'),
    },
    {
      key: 'itemId',
      label: 'Item',
      render: (_value: any, movement: ApiStockMovement) => String(movement.itemId ?? '—'),
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      sortable: true,
      render: (_value: any, movement: ApiStockMovement) => (
        <span
          className={
            String(movement.type).toUpperCase() === 'IN' || String(movement.type).toUpperCase() === 'ADJUSTMENT'
              ? 'text-success'
              : String(movement.type).toUpperCase() === 'OUT'
              ? 'text-destructive'
              : ''
          }
        >
          {String(movement.type).toUpperCase() === 'IN' || String(movement.type).toUpperCase() === 'ADJUSTMENT' ? '+' : ''}
          {String(movement.type).toUpperCase() === 'OUT' ? '-' : ''}
          {movement.quantity}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Motivo',
      render: (_value: any, movement: ApiStockMovement) => movement.reason || '—',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: any, movement: ApiStockMovement) => (
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          onClick={() => onEditMovement?.(String(movement.id))}
          aria-label="Editar"
        >
          <Edit className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Movimientos de Stock"
        description="Rastrea todos los movimientos de inventario entre almacenes"
        action={{
          label: 'Registrar Movimiento',
          onClick: () => onAddMovement?.(),
        }}
      />

      {stockMovementsLoading && (
        <div className="text-sm text-muted-foreground">Cargando movimientos...</div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar movimientos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            <SelectItem value="in">Entrada</SelectItem>
            <SelectItem value="out">Salida</SelectItem>
            <SelectItem value="transfer">Transferencia</SelectItem>
            <SelectItem value="adjustment">Ajuste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredMovements} columns={columns} />
    </div>
  );
}