import { useEffect, useState } from "react";
import { ArrowLeft, Save, Gem } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PageHeader } from "../page-header";
import type { Stone } from "../../lib/api-types";
import { toast } from "sonner";
import { useAttributes } from "../../hooks";
import { useGetStoneByIdQuery } from "../../state";

interface StoneFormViewProps {
  stoneId?: string;
  onBack?: () => void;
  onSave?: (stone: Partial<Stone>) => void;
}

export function StoneFormView({ stoneId, onBack, onSave }: StoneFormViewProps) {
  const {
    createStone,
    updateStone,
    isCreatingStone,
    isUpdatingStone,
  } = useAttributes();

  const { data: stoneData, isLoading: isLoadingStone } = useGetStoneByIdQuery(stoneId!, {
    skip: !stoneId,
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (stoneData) {
      setFormData({
        name: stoneData.name ?? "",
        slug: stoneData.slug ?? "",
      });
    }
  }, [stoneData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (field === "name" && !stoneId) {
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
      if (stoneId) {
        await updateStone({ id: stoneId, changes: { name: formData.name, slug: formData.slug } });
        toast.success("Piedra actualizada exitosamente");
      } else {
        await createStone({ name: formData.name, slug: formData.slug });
        toast.success("Piedra creada exitosamente");
      }
      onSave?.(formData);
      onBack?.();
    } catch (err: any) {
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      toast.error(apiMessage || "No se pudo guardar la piedra");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={stoneId ? "Editar Piedra" : "Agregar Piedra"}
          description={stoneId ? "Actualiza la información de la piedra" : "Crea una nueva piedra para las variantes"}
        />
      </div>

      {stoneId && isLoadingStone && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Cargando datos de la piedra...</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5" />
              Información de la Piedra
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
                  placeholder="ej: Ónix"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!!stoneId && isLoadingStone}
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
                  placeholder="onix"
                  disabled={!!stoneId && isLoadingStone}
                />
                <p className="text-sm text-muted-foreground">Se genera automáticamente a partir del nombre si se deja vacío</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
              <Button type="submit" disabled={isCreatingStone || isUpdatingStone || (!!stoneId && isLoadingStone)}>
                <Save className="mr-2 h-4 w-4" />
                {stoneId ? "Actualizar Piedra" : "Crear Piedra"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}