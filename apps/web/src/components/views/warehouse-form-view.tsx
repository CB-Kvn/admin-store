import { useEffect, useState } from "react";
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
import { useWarehouses } from "../../hooks/useWarehouses";
import { useGetWarehouseByIdQuery } from "../../state";

interface WarehouseFormViewProps {
  warehouseId?: string;
  onBack: () => void;
}

export function WarehouseFormView({ warehouseId, onBack }: WarehouseFormViewProps) {
  const isEditing = !!warehouseId;
  const { createWarehouse, updateWarehouse, isCreatingWarehouse, isUpdatingWarehouse } = useWarehouses();
  const { data: warehouseData, isLoading: isLoadingWarehouse } = useGetWarehouseByIdQuery(warehouseId!, {
    skip: !isEditing,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    manager: "",
    phone: "",
    email: "",
    status: "ACTIVE" as WarehouseStatus,
    capacity: "",
    currentOccupancy: "",
    lastInventoryDate: "",
    notes: "",
  });

  useEffect(() => {
    if (warehouseData && isEditing) {
      setFormData({
        name: warehouseData.name ?? "",
        location: warehouseData.location ?? "",
        address: (warehouseData as any).address ?? "",
        manager: (warehouseData as any).manager ?? "",
        phone: (warehouseData as any).phone ?? "",
        email: (warehouseData as any).email ?? "",
        status: (warehouseData as any).status ?? "ACTIVE",
        capacity: warehouseData.capacity != null ? String(warehouseData.capacity) : "",
        currentOccupancy: (warehouseData as any).currentOccupancy != null ? String((warehouseData as any).currentOccupancy) : "",
        lastInventoryDate: (warehouseData as any).lastInventoryDate
          ? new Date((warehouseData as any).lastInventoryDate).toISOString().slice(0, 10)
          : "",
        notes: (warehouseData as any).notes ?? "",
      });
    }
  }, [warehouseData, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.location || !formData.address || !formData.capacity) {
      toast.error("Por favor completa nombre, ubicación, dirección y capacidad");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        manager: formData.manager.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        status: formData.status,
        capacity: Number(formData.capacity),
        currentOccupancy: formData.currentOccupancy ? Number(formData.currentOccupancy) : 0,
        lastInventoryDate: formData.lastInventoryDate ? new Date(formData.lastInventoryDate).toISOString() : undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (Number.isNaN(payload.capacity)) {
        toast.error("Capacidad debe ser numérica");
        return;
      }

      if (Number.isNaN(payload.currentOccupancy)) {
        toast.error("Ocupación actual debe ser numérica");
        return;
      }

      if (isEditing && warehouseId) {
        await updateWarehouse({ id: warehouseId, changes: payload });
        toast.success("Almacén actualizado correctamente");
      } else {
        await createWarehouse(payload);
        toast.success("Almacén creado correctamente");
      }
      onBack();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.error || "Error al guardar el almacén");
    }
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
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  Dirección <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Calle, número, ciudad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Responsable</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleChange("manager", e.target.value)}
                  placeholder="Nombre del encargado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Ej. +1 555 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@empresa.com"
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

              <div className="space-y-2">
                <Label htmlFor="lastInventoryDate">Último inventario</Label>
                <Input
                  id="lastInventoryDate"
                  type="date"
                  value={formData.lastInventoryDate}
                  onChange={(e) => handleChange("lastInventoryDate", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Comentarios adicionales"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingWarehouse || isUpdatingWarehouse || isLoadingWarehouse}>
              {isEditing ? "Actualizar Almacén" : "Crear Almacén"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
