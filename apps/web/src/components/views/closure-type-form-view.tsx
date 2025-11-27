import { useEffect, useState } from "react";
import { ArrowLeft, Save, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PageHeader } from "../page-header";
import { ClosureType } from "../../lib/types";
import { toast } from "sonner";
import { useAttributes } from "../../hooks";
import { useGetClosureTypeByIdQuery } from "../../state";

interface ClosureTypeFormViewProps {
  closureTypeId?: string;
  onBack?: () => void;
  onSave?: (closureType: Partial<ClosureType>) => void;
}

export function ClosureTypeFormView({
  closureTypeId,
  onBack,
  onSave,
}: ClosureTypeFormViewProps) {
  const {
    createClosureType,
    updateClosureType,
    isCreatingClosureType,
    isUpdatingClosureType,
  } = useAttributes();

  const { data: closureTypeData, isLoading: isLoadingClosureType, error: loadClosureError } = useGetClosureTypeByIdQuery(closureTypeId!, {
    skip: !closureTypeId,
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (closureTypeData) {
      setFormData({
        name: closureTypeData.name ?? "",
        slug: closureTypeData.slug ?? "",
      });
    }
  }, [closureTypeData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-generate slug from name
    if (field === "name" && !closureTypeId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (closureTypeId) {
        await updateClosureType({ id: closureTypeId, changes: { name: formData.name, slug: formData.slug } });
        toast.success("Tipo de cierre actualizado exitosamente");
      } else {
        await createClosureType({ name: formData.name, slug: formData.slug });
        toast.success("Tipo de cierre creado exitosamente");
      }
      onSave?.(formData);
      onBack?.();
    } catch (err: any) {
      console.error("[Atributos] Error guardando tipo de cierre:", err);
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      if (err?.status === 409) {
        setErrors((prev) => ({ ...prev, name: "Ya existe un tipo de cierre con ese nombre" }));
        toast.error("Ya existe un tipo de cierre con ese nombre");
      } else {
        toast.error(apiMessage || "No se pudo guardar el tipo de cierre");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={closureTypeId ? "Editar Tipo de Cierre" : "Agregar Tipo de Cierre"}
          description={
            closureTypeId
              ? "Actualiza la información del tipo de cierre"
              : "Crea un nuevo tipo de cierre para las variantes de tus productos"
          }
        />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Información del Tipo de Cierre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {closureTypeId && isLoadingClosureType && (
              <p className="text-muted-foreground">Cargando datos del tipo de cierre...</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ej: Cremallera"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!!closureTypeId && isLoadingClosureType}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="cremallera"
                  disabled={!!closureTypeId && isLoadingClosureType}
                />
                <p className="text-sm text-muted-foreground">
                  Versión amigable para URL del nombre (se genera automáticamente si se deja vacío)
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Vista Previa</Label>
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {formData.name || "Nombre del Tipo de Cierre"}
                  </p>
                  {formData.slug && (
                    <p className="text-sm text-muted-foreground">
                      Slug: {formData.slug}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreatingClosureType || isUpdatingClosureType || (!!closureTypeId && isLoadingClosureType)}>
                <Save className="mr-2 h-4 w-4" />
                {closureTypeId ? "Actualizar Tipo de Cierre" : "Crear Tipo de Cierre"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}