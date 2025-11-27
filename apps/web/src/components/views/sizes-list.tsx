import { useState, useMemo } from "react";
import { Ruler, Plus, Search } from "lucide-react";
import type { Size } from "../../lib/api-types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../empty-state";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";

interface SizesListProps {
  sizes?: Size[];
  onAddSize?: () => void;
  onSizeClick?: (sizeId: string) => void;
}

export function SizesList({ sizes, onAddSize, onSizeClick }: SizesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sourceSizes: Size[] = Array.isArray(sizes) ? sizes : [];

  const filteredSizes = useMemo(() => {
    let filtered = [...sourceSizes];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        (s.name ?? "").toLowerCase().includes(q) || (s.slug ?? "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, sourceSizes]);

  if (sourceSizes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Tamaños</h3>
              <p className="text-sm text-muted-foreground">Gestiona los tamaños disponibles para tus productos</p>
            </div>
            <Button onClick={onAddSize}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Tamaño
            </Button>
          </div>
          <EmptyState
            icon={Ruler}
            title="Sin tamaños aún"
            description="Crea tamaños para usar en las variantes de tus productos"
          />
        </CardContent>
      </Card>
    );
  }

  const columns = [
    { key: "name", label: "Nombre", sortable: true },
    { key: "slug", label: "Slug", sortable: true, render: (_: any, s: Size) => <span className="text-muted-foreground">{s.slug || "-"}</span> },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Tamaños</h3>
            <p className="text-sm text-muted-foreground">
              {filteredSizes.length} tamaño{filteredSizes.length !== 1 ? "s" : ""} disponible{filteredSizes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={onAddSize}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Tamaño
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tamaños por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DataTable data={filteredSizes as any[]} columns={columns} onRowClick={(s: any) => onSizeClick?.(String(s.id))} />
      </CardContent>
    </Card>
  );
}