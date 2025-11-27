import { useState, useMemo } from "react";
import { Layers, Plus, Search } from "lucide-react";
import { mockMaterials } from "../../lib/mock-data";
import { Material } from "../../lib/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../empty-state";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";

interface MaterialsListProps {
  materials?: Material[];
  onAddMaterial?: () => void;
  onMaterialClick?: (materialId: string) => void;
}

export function MaterialsList({
  materials,
  onAddMaterial,
  onMaterialClick,
}: MaterialsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sourceMaterials: Material[] = Array.isArray(materials) ? materials : mockMaterials;

  const filteredMaterials = useMemo(() => {
    let filtered = [...sourceMaterials];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.name.toLowerCase().includes(query) ||
          material.slug?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, sourceMaterials]);

  if (sourceMaterials.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Materiales</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los materiales disponibles para tus productos
              </p>
            </div>
            <Button onClick={onAddMaterial}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Material
            </Button>
          </div>
          <EmptyState
            icon={Layers}
            title="Sin materiales aún"
            description="Crea materiales para usar en las variantes de tus productos"
          />
        </CardContent>
      </Card>
    );
  }

  const columns = [
    {
      key: "name",
      label: "Nombre",
      sortable: true,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (value: any, material: Material) => (
        <span className="text-muted-foreground">{material.slug || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Creado",
      sortable: true,
      render: (value: any, material: Material) => (
        <span className="text-muted-foreground">
          {new Date(material.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Actualizado",
      sortable: true,
      render: (value: any, material: Material) => (
        <span className="text-muted-foreground">
          {new Date(material.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Materiales</h3>
            <p className="text-sm text-muted-foreground">
              {filteredMaterials.length} material
              {filteredMaterials.length !== 1 ? "es" : ""} disponible{filteredMaterials.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={onAddMaterial}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Material
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materiales por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DataTable
          data={filteredMaterials}
          columns={columns}
          onRowClick={(material) => onMaterialClick?.(material.id)}
        />
      </CardContent>
    </Card>
  );
}