import { useState, useMemo } from "react";
import { Lock, Plus, Search } from "lucide-react";
import { mockClosureTypes } from "../../lib/mock-data";
import { ClosureType } from "../../lib/types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../empty-state";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";

interface ClosureTypesListProps {
  closureTypes?: ClosureType[];
  onAddClosureType?: () => void;
  onClosureTypeClick?: (closureTypeId: string) => void;
}

export function ClosureTypesList({
  closureTypes,
  onAddClosureType,
  onClosureTypeClick,
}: ClosureTypesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sourceClosureTypes: ClosureType[] = Array.isArray(closureTypes) ? closureTypes : mockClosureTypes;

  const filteredClosureTypes = useMemo(() => {
    let filtered = [...sourceClosureTypes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (closureType) =>
          closureType.name.toLowerCase().includes(query) ||
          closureType.slug?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, sourceClosureTypes]);

  if (sourceClosureTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Tipos de Cierre</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona los tipos de cierre disponibles para tus productos
              </p>
            </div>
            <Button onClick={onAddClosureType}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Tipo de Cierre
            </Button>
          </div>
          <EmptyState
            icon={Lock}
            title="Sin tipos de cierre aún"
            description="Crea tipos de cierre para usar en las variantes de tus productos"
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
      render: (value: any, closureType: ClosureType) => (
        <span className="text-muted-foreground">{closureType.slug || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Creado",
      sortable: true,
      render: (value: any, closureType: ClosureType) => (
        <span className="text-muted-foreground">
          {new Date(closureType.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Actualizado",
      sortable: true,
      render: (value: any, closureType: ClosureType) => (
        <span className="text-muted-foreground">
          {new Date(closureType.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Tipos de Cierre</h3>
            <p className="text-sm text-muted-foreground">
              {filteredClosureTypes.length} tipo
              {filteredClosureTypes.length !== 1 ? "s" : ""} de cierre disponible
              {filteredClosureTypes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={onAddClosureType}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Tipo de Cierre
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tipos de cierre por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DataTable
          data={filteredClosureTypes}
          columns={columns}
          onRowClick={(closureType) => onClosureTypeClick?.(closureType.id)}
        />
      </CardContent>
    </Card>
  );
}