import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { WarehouseStatus } from "../../lib/types";

interface WarehouseFormViewProps {
  warehouseId?: string;
  onBack: () => void;
}

export function WarehouseFormView({ warehouseId, onBack }: WarehouseFormViewProps) {
  const isEditing = !!warehouseId;
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "active" as WarehouseStatus,
    capacity: "",
    currentOccupancy: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.location || !formData.capacity) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // In a real app, this would make an API call
    toast.success(isEditing ? "Almacén actualizado correctamente" : "Almacén creado correctamente");
    onBack();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Almacén" : "Nuevo Almacén"}
        breadcrumbs={[
          { label: "Almacenes", href: "#" },
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
            <h3 className="mb-4">Información del Almacén</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Almacén <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ej., Almacén Principal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">
                  Ubicación <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="ej., Nueva York, USA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Capacidad (unidades) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="ej., 10000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentOccupancy">Ocupación actual (unidades)</Label>
                <Input
                  id="currentOccupancy"
                  type="number"
                  min="0"
                  value={formData.currentOccupancy}
                  onChange={(e) => handleChange("currentOccupancy", e.target.value)}
                  placeholder="ej., 5000"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar Almacén" : "Crear Almacén"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
