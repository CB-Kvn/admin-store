import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft, Calendar as CalendarIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { useBanners } from "../../hooks/useBanners";
import { useGetBannerByIdQuery } from "../../state/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { BannerStatusApi, Banner } from "../../lib/api-types";

interface BannerFormViewProps {
  bannerId?: string;
  onBack: () => void;
}

export function BannerFormView({ bannerId, onBack }: BannerFormViewProps) {
  const isEditing = !!bannerId;
  const { data: bannerData } = useGetBannerByIdQuery(bannerId!, { skip: !isEditing });
  const banner = bannerData as Banner | undefined;
  const { createBanner, updateBanner, isCreatingBanner, isUpdatingBanner } = useBanners();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    dateInit: new Date(),
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "ACTIVE" as BannerStatusApi,
    imageUrl: "",
  });

  // Load banner data when editing
  useEffect(() => {
    if (banner) {
      setFormData({
        name: banner.name || "",
        dateInit: banner.dateInit ? new Date(banner.dateInit) : new Date(),
        dateEnd: banner.dateEnd ? new Date(banner.dateEnd) : new Date(),
        status: (banner.status as BannerStatusApi) || "ACTIVE",
        imageUrl: banner.imageUrl || "",
      });
    }
  }, [banner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.imageUrl) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    const payload = {
      name: formData.name,
      dateInit: formData.dateInit?.toISOString(),
      dateEnd: formData.dateEnd?.toISOString(),
      status: formData.status,
      imageUrl: formData.imageUrl,
    };

    const action = isEditing
      ? updateBanner({ id: bannerId!, changes: payload })
      : createBanner(payload);

    Promise.resolve(action)
      .then(() => {
        toast.success(isEditing ? "Banner actualizado exitosamente" : "Banner creado exitosamente");
        onBack();
      })
      .catch((err) => {
        console.error("[Banner] Error al guardar:", err);
        toast.error("No se pudo guardar el banner");
      });
  };

  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Banner" : "Nuevo Banner"}
        breadcrumbs={[
          { label: "Banners", href: "#" },
          { label: isEditing ? "Editar" : "Nuevo" },
        ]}
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
            <h3 className="mb-4">Información del Banner</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Nombre del Banner <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ej., Oferta de Verano 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value as BannerStatusApi)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    <SelectItem value="EXPIRED">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de prioridad removido (no soportado por API) */}

              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.dateInit, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateInit}
                      onSelect={(date) => date && handleChange("dateInit", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.dateEnd, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateEnd}
                      onSelect={(date) => date && handleChange("dateEnd", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Campo de URL de enlace removido (no soportado por API) */}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Imagen del Banner</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">
                  URL de Imagen <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://ejemplo.com/banner.jpg"
                  required
                />
              </div>

              {formData.imageUrl && (
                <div className="rounded-lg border overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa del banner"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/1200x400?text=URL+de+Imagen+Inválida";
                    }}
                  />
                </div>
              )}

              <div className="p-4 border border-dashed rounded-lg text-center">
                <Upload className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Funcionalidad de carga iría aquí
                </p>
                <p className="text-muted-foreground">
                  Por ahora, ingresa una URL de imagen arriba
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingBanner || isUpdatingBanner}>
              {isEditing ? "Actualizar Banner" : "Crear Banner"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}