import { ArrowLeft, Edit, Folder } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Category } from '../../lib/api-types';
import { useCategories } from '../../hooks';
import { useGetCategoryByIdQuery } from '../../state/api';

interface CategoryDetailViewProps {
  categoryId: string;
  onBack: () => void;
  onCategoryClick?: (categoryId: string) => void;
  onProductClick?: (productId: string) => void;
  onEdit?: (categoryId: string) => void;
}

export function CategoryDetailView({
  categoryId,
  onBack,
  onCategoryClick,
  onProductClick,
  onEdit,
}: CategoryDetailViewProps) {
  const { categories, isLoadingCategories } = useCategories();
  const {
    data: category,
    isLoading: isLoadingCategory,
    error: categoryError,
  } = useGetCategoryByIdQuery(categoryId);

  const parentCategory: Category | undefined =
    category && category.parentId
      ? (categories || []).find(c => String(c.id) === String(category.parentId))
      : undefined;
  const childCategories: Category[] = (categories || []).filter(
    c => String(c.parentId) === String(categoryId)
  );

  const isLoading = isLoadingCategory || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="mb-2 text-muted-foreground">Cargando categoría…</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Categorías
          </Button>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">Categoría no encontrada</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Categorías
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{category.name}</h1>
            <p className="text-muted-foreground">{category.slug}</p>
          </div>
        </div>

        <Button onClick={() => onEdit?.(categoryId)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div>{category.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Slug</div>
                  <code className="text-sm">{category.slug}</code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Parent Category</div>
                  {parentCategory ? (
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => onCategoryClick?.(parentCategory.id)}
                    >
                      {parentCategory.name}
                    </Button>
                  ) : (
                    <div>—</div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div>{category.description}</div>
              </div>
            </CardContent>
          </Card>

          {childCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Child Categories ({childCategories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {childCategories.map(child => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => onCategoryClick?.(child.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{child.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parentCategory && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Parent Category
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onCategoryClick?.(parentCategory.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {parentCategory.name}
                  </Button>
                </div>
              )}
              {childCategories.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Child Categories
                  </div>
                  <Badge variant="outline">{childCategories.length} subcategorías</Badge>
                </div>
              )}
              {!parentCategory && childCategories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Esta es una categoría raíz sin hijos
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString('es-ES')
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString('es-ES')
                    : '—'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
