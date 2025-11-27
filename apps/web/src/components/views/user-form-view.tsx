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
import { Switch } from "../ui/switch";
import type { UserRole } from "../../lib/types";

interface UserFormViewProps {
  userId?: string;
  onBack: () => void;
}

export function UserFormView({ userId, onBack }: UserFormViewProps) {
  const isEditing = !!userId;
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "staff" as UserRole,
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // In a real app, this would make an API call
    toast.success(isEditing ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
    onBack();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
        breadcrumbs={[
          { label: "Usuarios", href: "#" },
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
            <h3 className="mb-4">Información del Usuario</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellido <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="staff">Personal</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active">Estado</Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleChange("active", checked)}
                  />
                  <span className="text-muted-foreground">
                    {formData.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {!isEditing && (
            <Card className="p-6">
              <h3 className="mb-4">Contraseña</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Contraseña <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar Contraseña <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required={!isEditing}
                  />
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar Usuario" : "Crear Usuario"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
