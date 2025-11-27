import { useState, useMemo } from "react";
import { Gem, Plus, Search } from "lucide-react";
import type { Stone } from "../../lib/api-types";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { EmptyState } from "../empty-state";
import { DataTable } from "../data-table";
import { Input } from "../ui/input";

interface StonesListProps {
  stones?: Stone[];
  onAddStone?: () => void;
  onStoneClick?: (stoneId: string) => void;
}

export function StonesList({ stones, onAddStone, onStoneClick }: StonesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const sourceStones: Stone[] = Array.isArray(stones) ? stones : [];

  const filteredStones = useMemo(() => {
    let filtered = [...sourceStones];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        (s.name ?? "").toLowerCase().includes(q) || (s.slug ?? "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchQuery, sourceStones]);

  if (sourceStones.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Piedras</h3>
              <p className="text-sm text-muted-foreground">Gestiona las piedras disponibles para tus productos</p>
            </div>
            <Button onClick={onAddStone}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Piedra
            </Button>
          </div>
          <EmptyState
            icon={Gem}
            title="Sin piedras aún"
            description="Crea piedras para usar en las variantes de tus productos"
          />
        </CardContent>
      </Card>
    );
  }

  const columns = [
    { key: "name", label: "Nombre", sortable: true },
    { key: "slug", label: "Slug", sortable: true, render: (_: any, s: Stone) => <span className="text-muted-foreground">{s.slug || "-"}</span> },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Piedras</h3>
            <p className="text-sm text-muted-foreground">
              {filteredStones.length} piedra{filteredStones.length !== 1 ? "s" : ""} disponible{filteredStones.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={onAddStone}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Piedra
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar piedras por nombre o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DataTable data={filteredStones as any[]} columns={columns} onRowClick={(s: any) => onStoneClick?.(String(s.id))} />
      </CardContent>
    </Card>
  );
}