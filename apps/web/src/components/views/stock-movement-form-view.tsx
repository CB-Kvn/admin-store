import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { mockProductVariants, mockProducts, mockWarehouses, mockStockMovements } from "../../lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { MovementType } from "../../lib/types";

interface StockMovementFormViewProps {
  onBack: () => void;
  productId?: string;
  stockMovementId?: string;
}

export function StockMovementFormView({ onBack, productId, stockMovementId }: StockMovementFormViewProps) {
  // Get movement data if editing
  const movement = stockMovementId ? mockStockMovements.find(m => m.id === stockMovementId) : undefined;
  const isEditing = !!stockMovementId;
  
  // Get product info if productId is provided
  const product = productId ? mockProducts.find(p => p.id === productId) : undefined;
  
  // Filter variants by product if productId is provided
  const availableVariants = productId
    ? mockProductVariants.filter(v => v.productId === productId)
    : mockProductVariants;

  // Form state
  const [formData, setFormData] = useState({
    warehouseId: "",
    variantId: "",
    type: "IN" as MovementType,
    quantity: "",
    date: new Date(),
    reference: "",
    notes: "",
  });

  // Load movement data when editing
  useEffect(() => {
    if (movement) {
      setFormData({
        warehouseId: movement.warehouseId || "",
        variantId: movement.variantId || "",
        type: movement.type || "IN",
        quantity: movement.quantity?.toString() || "",
        date: movement.date ? new Date(movement.date) : new Date(),
        reference: movement.reference || "",
        notes: movement.notes || "",
      });
    }
  }, [movement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.warehouseId || !formData.variantId || !formData.quantity) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    // In a real app, this would make an API call
    if (isEditing) {
      toast.success("Movimiento de stock actualizado exitosamente");
    } else {
      toast.success("Movimiento de stock creado exitosamente");
    }
    onBack();
  };

  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isEditing
            ? "Editar Movimiento de Stock"
            : product
            ? `Gestionar Stock: ${product.name}`
            : "Nuevo Movimiento de Stock"
        }
        breadcrumbs={
          product
            ? [
                { label: "Productos", href: "#" },
                { label: product.name, href: "#" },
                { label: "Gestionar Stock" },
              ]
            : isEditing
            ? [
                { label: "Movimientos de Stock", href: "#" },
                { label: "Editar" },
              ]
            : [
                { label: "Movimientos de Stock", href: "#" },
                { label: "Nuevo" },
              ]
        }
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-4xl">
          <Card className="p-6">
            <h3 className="mb-4">Información del Movimiento</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo de Movimiento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                  disabled={isEditing}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Salida</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
                  </SelectContent>
                </Select>
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    El tipo no se puede modificar al editar
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Fecha <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleChange("date", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseId">
                  Almacén <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.warehouseId}
                  onValueChange={(value) => handleChange("warehouseId", value)}
                >
                  <SelectTrigger id="warehouseId">
                    <SelectValue placeholder="Seleccionar almacén" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variantId">
                  Variante de Producto <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.variantId}
                  onValueChange={(value) => handleChange("variantId", value)}
                  disabled={isEditing}
                >
                  <SelectTrigger id="variantId">
                    <SelectValue placeholder="Seleccionar variante de producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVariants.map((variant) => {
                      const product = mockProducts.find(p => p.id === variant.productId);
                      return (
                        <SelectItem key={variant.id} value={variant.id}>
                          {product?.name} - {variant.sku}
                          {variant.size && ` - ${variant.size}`}
                          {variant.color && ` - ${variant.color.name}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {productId && availableVariants.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Mostrando variantes del producto seleccionado
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    La variante no se puede modificar al editar
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Cantidad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  placeholder="ej., 100"
                  required
                />
                <p className="text-muted-foreground">
                  {formData.type === "OUT" ? "Cantidad a retirar" : "Cantidad a agregar"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Número de Referencia</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                  placeholder="ej., PO-2024-001"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Agrega cualquier información adicional sobre este movimiento..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar Movimiento" : "Crear Movimiento"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}