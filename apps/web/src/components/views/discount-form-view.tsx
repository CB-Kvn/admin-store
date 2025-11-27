import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { DiscountType } from "../../lib/types";

interface DiscountFormViewProps {
  discountId?: string;
  onBack: () => void;
}

export function DiscountFormView({ discountId, onBack }: DiscountFormViewProps) {
  const isEditing = !!discountId;
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as DiscountType,
    value: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    isGlobal: false,
    usageLimit: "",
    minQuantity: "",
    maxQuantity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.value) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.code && formData.isGlobal) {
      toast.error("Global discounts cannot have a code");
      return;
    }

    // In a real app, this would make an API call
    toast.success(isEditing ? "Discount updated successfully" : "Discount created successfully");
    onBack();
  };

  const handleChange = (field: string, value: string | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Descuento" : "Nuevo Descuento"}
        breadcrumbs={[
          { label: "Descuentos", href: "#" },
          { label: isEditing ? "Editar" : "Nuevo" },
        ]}
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Atrás
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-4xl">
          <Card className="p-6">
            <h3 className="mb-4">Información del Descuento</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Descuento</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                  placeholder="ej., VERANO2024"
                  disabled={formData.isGlobal}
                />
                <p className="text-muted-foreground">
                  Dejar vacío para descuentos globales
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo de Descuento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto fijo</SelectItem>
                    <SelectItem value="buy_x_get_y">Compra X Obtén Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  Valor <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  placeholder={formData.type === "percentage" ? "ej., 10" : "ej., 50.00"}
                  required
                />
                <p className="text-muted-foreground">
                  {formData.type === "percentage" ? "Porcentaje de descuento" : "Monto de descuento en moneda"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Límite de Uso</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="0"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  placeholder="Dejar vacío para ilimitado"
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && handleChange("startDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && handleChange("endDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minQuantity">Cantidad mínima</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={(e) => handleChange("minQuantity", e.target.value)}
                  placeholder="Opcional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxQuantity">Cantidad máxima</Label>
                <Input
                  id="maxQuantity"
                  type="number"
                  min="0"
                  value={formData.maxQuantity}
                  onChange={(e) => handleChange("maxQuantity", e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Configuración</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Activo</Label>
                  <p className="text-muted-foreground">
                    Habilita o deshabilita este descuento
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isGlobal">Descuento global</Label>
                  <p className="text-muted-foreground">
                    Aplica automáticamente a todas las órdenes sin código
                  </p>
                </div>
                <Switch
                  id="isGlobal"
                  checked={formData.isGlobal}
                  onCheckedChange={(checked) => handleChange("isGlobal", checked)}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar Descuento" : "Crear Descuento"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
