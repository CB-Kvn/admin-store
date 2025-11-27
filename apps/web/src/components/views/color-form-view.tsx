import { useEffect, useState } from "react";
import { ArrowLeft, Save, Palette } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PageHeader } from "../page-header";
import { Color } from "../../lib/types";
import { toast } from "sonner";
import { useAttributes } from "../../hooks";
import { useGetColorByIdQuery } from "../../state";

interface ColorFormViewProps {
  colorId?: string;
  onBack?: () => void;
  onSave?: (color: Partial<Color>) => void;
}

export function ColorFormView({ colorId, onBack, onSave }: ColorFormViewProps) {
  const {
    createColor,
    updateColor,
    isCreatingColor,
    isUpdatingColor,
  } = useAttributes();

  const { data: colorData, isLoading: isLoadingColor, error: loadColorError } = useGetColorByIdQuery(colorId!, {
    // Evita la consulta si no hay ID (modo creación)
    skip: !colorId,
  });

  const [formData, setFormData] = useState({
    name: "",
    hex: "#000000",
    slug: "",
  });

  // Sincroniza datos del color cuando se carga desde la API
  useEffect(() => {
    if (colorData) {
      setFormData({
        name: colorData.name ?? "",
        hex: colorData.hex ?? "#000000",
        slug: colorData.slug ?? "",
      });
    }
  }, [colorData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Auto-generate slug from name
    if (field === "name" && !colorId) {
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

    if (!formData.hex.trim()) {
      newErrors.hex = "El código hex es requerido";
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(formData.hex)) {
      newErrors.hex = "Formato de código hex inválido (ej: #FF0000)";
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
      if (colorId) {
        await updateColor({ id: colorId, changes: { name: formData.name, hex: formData.hex, slug: formData.slug } });
        toast.success("Color actualizado exitosamente");
      } else {
        await createColor({ name: formData.name, hex: formData.hex, slug: formData.slug });
        toast.success("Color creado exitosamente");
      }
      onSave?.(formData);
      onBack?.();
    } catch (err: any) {
      console.error("[Atributos] Error guardando color:", err);
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      if (err?.status === 409) {
        setErrors((prev) => ({ ...prev, name: "Ya existe un color con ese nombre" }));
        toast.error("Ya existe un color con ese nombre");
      } else {
        toast.error(apiMessage || "No se pudo guardar el color");
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
          title={colorId ? "Editar Color" : "Agregar Color"}
          description={
            colorId
              ? "Actualiza la información del color"
              : "Crea un nuevo color para las variantes de tus productos"
          }
        />
      </div>

      {colorId && isLoadingColor && (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Cargando datos del color...</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Información del Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ej: Azul Marino"
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!!colorId && isLoadingColor}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hex">
                  Código Hex <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="hex"
                    type="color"
                    value={formData.hex}
                    onChange={(e) => handleChange("hex", e.target.value)}
                    className="w-20 h-10 p-1 cursor-pointer"
                    disabled={!!colorId && isLoadingColor}
                  />
                  <Input
                    value={formData.hex}
                    onChange={(e) => handleChange("hex", e.target.value)}
                    placeholder="#000000"
                    className={`flex-1 ${errors.hex ? "border-destructive" : ""}`}
                    disabled={!!colorId && isLoadingColor}
                  />
                </div>
                {errors.hex && (
                  <p className="text-sm text-destructive">{errors.hex}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="azul-marino"
                  disabled={!!colorId && isLoadingColor}
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
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: formData.hex }}
                />
                <div>
                  <p className="font-medium">{formData.name || "Nombre del Color"}</p>
                  <p className="text-sm text-muted-foreground">{formData.hex}</p>
                  {formData.slug && (
                    <p className="text-xs text-muted-foreground">
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
              <Button type="submit" disabled={isCreatingColor || isUpdatingColor || (!!colorId && isLoadingColor)}>
                <Save className="mr-2 h-4 w-4" />
                {colorId ? "Actualizar Color" : "Crear Color"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}