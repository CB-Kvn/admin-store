import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { useCategories } from '../../hooks';
import { useGetCategoryByIdQuery } from '../../state';

interface CategoryFormViewProps {
  categoryId?: string;
  onBack: () => void;
  onSave?: (data: any) => void;
}

export function CategoryFormView({
  categoryId,
  onBack,
  onSave,
}: CategoryFormViewProps) {
  const isEditing = !!categoryId;
  const { categories, createCategory, updateCategory, isCreatingCategory, isUpdatingCategory } = useCategories();
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery(categoryId!, { skip: !isEditing });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: 0 as number,
  });

  useEffect(() => {
    if (category && isEditing) {
      setFormData({
        name: category.name ?? '',
        slug: category.slug ?? '',
        description: category.description ?? '',
        parentId: (category.parentId ? Number(category.parentId) : 0),
      });
    }
  }, [category, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId === 0 ? undefined :  Number(formData.parentId),
      };

      if (isEditing && categoryId) {
        await updateCategory({ id: categoryId, changes: payload });
        toast.success('Categoría actualizada correctamente');
      } else {
        console.log('Creating category with payload:', payload);
        await createCategory(payload as any);
        toast.success('Categoría creada correctamente');
      }
      onBack();
    } catch (err: any) {
      const message = err?.data?.message || err?.message || 'Error al guardar la categoría';
      toast.error(message);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      // Auto-generate slug from name if not editing
      slug: isEditing
        ? prev.slug
        : value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
    }));
  };

  // Get potential parent categories (exclude self and direct children if editing)
  const availableParents = categories.filter(c => {
    if (!isEditing) return true;
    if (String(c.id) === String(categoryId)) return false;
    if (String(c.parentId) === String(categoryId)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Actualizar detalles de la categoría' : 'Crear una nueva categoría'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Electrónica, Ropa, etc."
                    required
                    disabled={isLoadingCategory || isCreatingCategory || isUpdatingCategory}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="electronica"
                    required
                    pattern="[a-z0-9-]+"
                    title="Solo letras minúsculas, números y guiones"
                    disabled={isLoadingCategory || isCreatingCategory || isUpdatingCategory}
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificador amigable para URL (solo minúsculas, números y guiones)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descripción de la categoría"
                    rows={4}
                    disabled={isLoadingCategory || isCreatingCategory || isUpdatingCategory}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentId">Categoría padre (Opcional)</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={value =>
                      setFormData(prev => ({ ...prev, parentId: value }))
                    }
                    disabled={isLoadingCategory || isCreatingCategory || isUpdatingCategory}
                  >
                    <SelectTrigger id="parentId">
                      <SelectValue placeholder="Ninguna (Categoría raíz)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguna (Categoría raíz)</SelectItem>
                      {availableParents.map(parent => (
                        <SelectItem key={String(parent.id)} value={String(parent.id)}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecciona una categoría padre para crear una subcategoría
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                Cancelar
              </Button>
              </CardContent>
            </Card>

            {isEditing && category && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Creado</div>
                    <div className="text-sm">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString('es-ES')
                        : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Última actualización
                    </div>
                    <div className="text-sm">
                      {category.updatedAt
                        ? new Date(category.updatedAt).toLocaleDateString('es-ES')
                        : '—'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
