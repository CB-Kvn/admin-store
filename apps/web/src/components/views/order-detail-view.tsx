import { ArrowLeft, Package, FileText, Upload, Check, X, Clock } from "lucide-react";
import { mockOrders } from "../../lib/mock-data";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatusBadge } from "../status-badge";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetailView({ orderId, onBack }: OrderDetailViewProps) {
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">Orden no encontrada</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Órdenes
          </Button>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      processing: 'warning',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'error',
      completed: 'success',
      uncompleted: 'warning',
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

  const getDocumentIcon = (status: string) => {
    const icons = {
      pending: Clock,
      approved: Check,
      rejected: X,
    };
    return icons[status as keyof typeof icons] || FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>Orden {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              {new Date(order.orderDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select defaultValue={order.status}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artículos de la Orden</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio unitario</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Completado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div>{item.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.sku}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={item.status}
                          variant={getStatusVariant(item.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {item.qtyDone} / {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotalAmount.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Descuento</span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>${order.shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuesto</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.documents && order.documents.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Documentos</CardTitle>
                <Button size="sm" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.documents.map(doc => {
                    const Icon = getDocumentIcon(doc.status);
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{doc.title}</span>
                              <Badge variant="outline">{doc.type.replace('_', ' ')}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {(doc.size / 1024).toFixed(2)} KB •{' '}
                              {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <StatusBadge
                            status={doc.status}
                            variant={getStatusVariant(doc.status)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Cronología de la Orden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-success p-2">
                      <Check className="h-4 w-4 text-success-foreground" />
                    </div>
                    <div className="h-full w-px bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div>Orden realizada</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>

                {order.status !== 'pending' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-success p-2">
                        <Check className="h-4 w-4 text-success-foreground" />
                      </div>
                      {order.status !== 'processing' && (
                        <div className="h-full w-px bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div>Procesando</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.updatedAt).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>
                )}

                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-success p-2">
                        <Check className="h-4 w-4 text-success-foreground" />
                      </div>
                      {order.status !== 'shipped' && (
                        <div className="h-full w-px bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div>Enviado</div>
                      <div className="text-sm text-muted-foreground">
                        {order.trackingNumber && (
                          <span>Seguimiento: {order.trackingNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-success p-2">
                        <Check className="h-4 w-4 text-success-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div>Entregado</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.updatedAt).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-destructive p-2">
                        <X className="h-4 w-4 text-destructive-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div>Cancelado</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.updatedAt).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Comprador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.buyer ? (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Nombre</div>
                    <div>{order.buyer.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Correo</div>
                    <div>{order.buyer.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rol</div>
                    <div className="capitalize">{order.buyer.role}</div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No hay información del comprador disponible</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de la Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Estado de la Orden</div>
                <StatusBadge
                  status={order.status}
                  variant={getStatusVariant(order.status)}
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estado del Pago</div>
                <StatusBadge
                  status={order.paymentStatus.replace('_', ' ')}
                  variant={getPaymentVariant(order.paymentStatus)}
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Método de Pago</div>
                <div>{order.paymentMethod}</div>
              </div>
              {order.trackingNumber && (
                <div>
                  <div className="text-sm text-muted-foreground">Número de rastreo</div>
                  <div className="flex gap-2">
                    <Input
                      value={order.trackingNumber}
                      readOnly
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
