import { useEffect, useState } from "react";
import { ArrowLeft, Save, Layers } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PageHeader } from "../page-header";
import { Material } from "../../lib/types";
import { toast } from "sonner";
import { useAttributes } from "../../hooks";
import { useGetMaterialByIdQuery } from "../../state";

interface MaterialFormViewProps {
  materialId?: string;
  onBack?: () => void;
  onSave?: (material: Partial<Material>) => void;
}

export function MaterialFormView({
  materialId,
  onBack,
  onSave,
}: MaterialFormViewProps) {
  const {
    createMaterial,
    updateMaterial,
    isCreatingMaterial,
    isUpdatingMaterial,
  } = useAttributes();

  const { data: materialData, isLoading: isLoadingMaterial, error: loadMaterialError } = useGetMaterialByIdQuery(materialId!, {
    skip: !materialId,
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (materialData) {
      setFormData({
        name: materialData.name ?? "",
        slug: materialData.slug ?? "",
      });
    }
  }, [materialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-generate slug from name
    if (field === "name" && !materialId) {
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
      if (materialId) {
        await updateMaterial({ id: materialId, changes: { name: formData.name, slug: formData.slug } });
        toast.success("Material actualizado exitosamente");
      } else {
        await createMaterial({ name: formData.name, slug: formData.slug });
        toast.success("Material creado exitosamente");
      }
      onSave?.(formData);
      onBack?.();
    } catch (err: any) {
      console.error("[Atributos] Error guardando material:", err);
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      if (err?.status === 409) {
        setErrors((prev) => ({ ...prev, name: "Ya existe un material con ese nombre" }));
        toast.error("Ya existe un material con ese nombre");
      } else {
        toast.error(apiMessage || "No se pudo guardar el material");
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
          title={materialId ? "Editar Material" : "Agregar Material"}
          description={
            materialId
              ? "Actualiza la información del material"
              : "Crea un nuevo material para las variantes de tus productos"
          }
        />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Información del Material
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {materialId && isLoadingMaterial && (
              <p className="text-muted-foreground">Cargando datos del material...</p>
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
                  placeholder="ej: Algodón Orgánico"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!!materialId && isLoadingMaterial}
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
                  placeholder="algodon-organico"
                  disabled={!!materialId && isLoadingMaterial}
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
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {formData.name || "Nombre del Material"}
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
              <Button type="submit" disabled={isCreatingMaterial || isUpdatingMaterial || (!!materialId && isLoadingMaterial)}>
                <Save className="mr-2 h-4 w-4" />
                {materialId ? "Actualizar Material" : "Crear Material"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}