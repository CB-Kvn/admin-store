import { useEffect, useState } from "react";
import { ArrowLeft, Save, Ruler } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PageHeader } from "../page-header";
import type { Size } from "../../lib/api-types";
import { toast } from "sonner";
import { useAttributes } from "../../hooks";
import { useGetSizeByIdQuery } from "../../state";

interface SizeFormViewProps {
  sizeId?: string;
  onBack?: () => void;
  onSave?: (size: Partial<Size>) => void;
}

export function SizeFormView({ sizeId, onBack, onSave }: SizeFormViewProps) {
  const {
    createSize,
    updateSize,
    isCreatingSize,
    isUpdatingSize,
  } = useAttributes();

  const { data: sizeData, isLoading: isLoadingSize } = useGetSizeByIdQuery(sizeId!, {
    skip: !sizeId,
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (sizeData) {
      setFormData({
        name: sizeData.name ?? "",
        slug: sizeData.slug ?? "",
      });
    }
  }, [sizeData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (field === "name" && !sizeId) {
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
    if (!validateForm()) return;
    try {
      if (sizeId) {
        await updateSize({ id: sizeId, changes: { name: formData.name, slug: formData.slug } });
        toast.success("Tamaño actualizado exitosamente");
      } else {
        await createSize({ name: formData.name, slug: formData.slug });
        toast.success("Tamaño creado exitosamente");
      }
      onSave?.(formData);
      onBack?.();
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      toast.error(apiMessage || "No se pudo guardar el tamaño");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={sizeId ? "Editar Tamaño" : "Agregar Tamaño"}
          description={sizeId ? "Actualiza la información del tamaño" : "Crea un nuevo tamaño para las variantes"}
        />
      </div>

      {sizeId && isLoadingSize && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Cargando datos del tamaño...</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Información del Tamaño
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ej: Grande"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!!sizeId && isLoadingSize}
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
                  placeholder="grande"
                  disabled={!!sizeId && isLoadingSize}
                />
                <p className="text-sm text-muted-foreground">Se genera automáticamente a partir del nombre si se deja vacío</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
              <Button type="submit" disabled={isCreatingSize || isUpdatingSize || (!!sizeId && isLoadingSize)}>
                <Save className="mr-2 h-4 w-4" />
                {sizeId ? "Actualizar Tamaño" : "Crear Tamaño"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}