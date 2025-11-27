import { ArrowLeft, Edit, Package, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { StatusBadge } from '../status-badge';
import { Progress } from '../ui/progress';
import {
  mockWarehouses,
  mockWarehouseStock,
  mockProductVariants,
} from '../../lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface WarehouseDetailViewProps {
  warehouseId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
}

export function WarehouseDetailView({
  warehouseId,
  onBack,
  onEdit,
}: WarehouseDetailViewProps) {
  const warehouse = mockWarehouses.find(w => w.id === warehouseId);
  const warehouseStock = mockWarehouseStock.filter(
    s => s.warehouseId === warehouseId
  );

  // Calculate stats
  const lowStockCount = warehouseStock.filter(s => s.status === 'low_stock').length;
  const outOfStockCount = warehouseStock.filter(s => s.status === 'out_of_stock').length;
  const totalValue = warehouseStock.reduce(
    (sum, stock) => sum + stock.quantity * stock.price,
    0
  );

  if (!warehouse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">Almacén no encontrado</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Almacenes
          </Button>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      active: 'success',
      inactive: 'default',
      maintenance: 'warning',
    };
    return variants[status] || 'default';
  };

  const getStockStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      in_stock: 'success',
      low_stock: 'warning',
      out_of_stock: 'error',
    };
    return variants[status] || 'default';
  };

  const capacityPercentage = (warehouse.currentOccupancy / warehouse.capacity) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{warehouse.name}</h1>
            <p className="text-muted-foreground">{warehouse.location}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit?.(warehouseId)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Agregar stock
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del almacén</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Nombre</div>
                  <div>{warehouse.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Estado</div>
                  <div>
                    <StatusBadge
                      status={warehouse.status}
                      variant={getStatusVariant(warehouse.status)}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ubicación</div>
                  <div>{warehouse.location}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Último inventario</div>
                  <div>
                    {warehouse.lastInventoryDate
                      ? new Date(warehouse.lastInventoryDate).toLocaleDateString(
                          'es-ES'
                        )
                      : '—'}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-2">Capacidad</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {warehouse.currentOccupancy.toLocaleString()} /{' '}
                      {warehouse.capacity.toLocaleString()} unidades
                    </span>
                    <span className="text-muted-foreground">
                      {capacityPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={capacityPercentage} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock por variante ({warehouseStock.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {warehouseStock.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Stock mínimo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseStock.map(stock => {
                      const variant = mockProductVariants.find(
                        v => v.id === stock.variantId
                      );
                      const stockValue = stock.quantity * stock.price;
                      return (
                        <TableRow key={stock.id}>
                          <TableCell>
                            <code className="text-xs">{variant?.sku || '—'}</code>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                stock.quantity <= stock.minimumStock
                                  ? 'text-destructive font-medium'
                                  : ''
                              }
                            >
                              {stock.quantity.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {stock.minimumStock.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={stock.status.replace('_', ' ')}
                              variant={getStockStatusVariant(stock.status)}
                            />
                          </TableCell>
                          <TableCell>${stock.price.toFixed(2)}</TableCell>
                          <TableCell>${stock.cost.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">
                            ${stockValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No hay stock en este almacén</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">SKUs totales</div>
                <div className="text-2xl">{warehouseStock.length}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Valor total</div>
                <div className="text-2xl">
                  ${totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">Alertas de stock</div>
                <div className="space-y-2">
                  {lowStockCount > 0 && (
                    <div className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">
                        {lowStockCount} artículo{lowStockCount !== 1 && 's'} con stock bajo
                      </span>
                    </div>
                  )}
                  {outOfStockCount > 0 && (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">
                        {outOfStockCount} artículo{outOfStockCount !== 1 && 's'} sin stock
                      </span>
                    </div>
                  )}
                  {lowStockCount === 0 && outOfStockCount === 0 && (
                    <p className="text-sm text-muted-foreground">Sin alertas</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Creado</div>
                <div className="text-sm">
                  {new Date(warehouse.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
