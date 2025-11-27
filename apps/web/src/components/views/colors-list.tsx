import { useState, useMemo } from "react";
import { Palette, Plus, Search, ArrowUpDown } from "lucide-react";
import { mockColors } from "../../lib/mock-data";
import { Color } from "../../lib/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../empty-state";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

interface ColorsListProps {
  colors?: Color[];
  onAddColor?: () => void;
  onColorClick?: (colorId: string) => void;
}

export function ColorsList({ colors, onAddColor, onColorClick }: ColorsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sourceColors: Color[] = Array.isArray(colors) ? colors : mockColors;

  const filteredColors = useMemo(() => {
    let filtered = [...sourceColors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (color) =>
          color.name.toLowerCase().includes(query) ||
          color.hex.toLowerCase().includes(query) ||
          color.slug?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, sourceColors]);

  if (sourceColors.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Colores</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los colores disponibles para tus productos
              </p>
            </div>
            <Button onClick={onAddColor}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Color
            </Button>
          </div>
          <EmptyState
            icon={Palette}
            title="Sin colores aún"
            description="Crea colores para usar en las variantes de tus productos"
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
      render: (value: any, color: Color) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-border flex-shrink-0"
            style={{ backgroundColor: color.hex }}
          />
          <span>{color.name}</span>
        </div>
      ),
    },
    {
      key: "hex",
      label: "Código Hex",
      sortable: true,
      render: (value: any, color: Color) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {color.hex}
        </code>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (value: any, color: Color) => (
        <span className="text-muted-foreground">{color.slug || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Creado",
      sortable: true,
      render: (value: any, color: Color) => (
        <span className="text-muted-foreground">
          {new Date(color.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Colores</h3>
            <p className="text-sm text-muted-foreground">
              {filteredColors.length} color{filteredColors.length !== 1 ? "es" : ""}{" "}
              {filteredColors.length !== 1 ? "disponibles" : "disponible"}
            </p>
          </div>
          <Button onClick={onAddColor}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Color
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar colores por nombre, código hex o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DataTable
          data={filteredColors}
          columns={columns}
          onRowClick={(color) => onColorClick?.(color.id)}
        />
      </CardContent>
    </Card>
  );
}