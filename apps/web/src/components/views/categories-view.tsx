import { Folder, FolderTree, Plus } from "lucide-react";
import { Category } from "../../lib/api-types";
import { StatusBadge } from "../status-badge";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PageHeader } from "../page-header";
import { EmptyState } from "../empty-state";
import { Card, CardContent } from "../ui/card";
import { useCategories } from "../../hooks";

interface CategoriesViewProps {
  onCategoryClick?: (categoryId: string) => void;
  onAddCategory?: () => void;
}

export function CategoriesView({ onCategoryClick, onAddCategory }: CategoriesViewProps) {
  const { categories, categoriesLoading } = useCategories();

  const getParentName = (parentId?: string | number | null) => {
    if (!parentId) return null;
    return categories.find(c => c.id === parentId)?.name ?? null;
  };

  const rootCategories = categories.filter((c: Category) => !c.parentId);
  const childCategories = categories.filter((c: Category) => !!c.parentId);

  if (!categoriesLoading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Categorías"
          description="Organiza tus productos en categorías"
          action={
            onAddCategory
              ? { label: "Agregar Categoría", onClick: onAddCategory }
              : undefined
          }
        />
        <EmptyState
          icon={Folder}
          title="Aún no hay categorías"
          description="Crea categorías para organizar tus productos"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        description="Organiza tus productos en categorías"
        action={
          onAddCategory
            ? { label: "Agregar Categoría", onClick: onAddCategory }
            : undefined
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Root Categories */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FolderTree className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg">Categorías Principales</h3>
              </div>
              {categoriesLoading && (
                <div className="text-sm text-muted-foreground mb-4">Cargando categorías...</div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Hijas</TableHead>
                    <TableHead>Creado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootCategories.map(category => {
                    const childCount = categories.filter(
                      (c: Category) => c.parentId === category.id
                    ).length;
                    return (
                      <TableRow
                        key={category.id}
                        className="cursor-pointer"
                        onClick={() => onCategoryClick?.(category.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {category.description}
                        </TableCell>
                        <TableCell>
                          {childCount > 0 ? (
                            <Badge variant="secondary">{childCount}</Badge>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {category.createdAt
                            ? new Date(category.createdAt).toLocaleDateString('es-ES')
                            : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Child Categories */}
            {childCategories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg">Subcategorías</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Padre</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Creado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childCategories.map(category => (
                      <TableRow
                        key={category.id}
                        className="cursor-pointer"
                        onClick={() => onCategoryClick?.(category.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 pl-6">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span>{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getParentName(category.parentId) ?? '—'}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {category.createdAt
                            ? new Date(category.createdAt).toLocaleDateString('es-ES')
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}