import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft, Calendar as CalendarIcon, X, Search, Package, Tag, Users, Grid3x3 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import type { DiscountType } from "../../lib/types";
import {
  mockDiscounts,
  mockProducts,
  mockCategories,
  mockProductVariants,
  mockUsers,
  mockDiscountProducts,
  mockDiscountCategories,
  mockDiscountVariants,
  mockDiscountUsers,
} from "../../lib/mock-data";

interface DiscountFormViewProps {
  discountId?: string;
  onBack: () => void;
}

export function DiscountFormView({ discountId, onBack }: DiscountFormViewProps) {
  const isEditing = !!discountId;
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as DiscountType,
    value: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    isGlobal: false,
    minQuantity: "",
    maxQuantity: "",
  });

  // Assignment states
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Search states
  const [assignmentType, setAssignmentType] = useState<'products' | 'categories' | 'variants' | 'users'>('products');
  const [openProductSelector, setOpenProductSelector] = useState(false);
  const [openCategorySelector, setOpenCategorySelector] = useState(false);
  const [openVariantSelector, setOpenVariantSelector] = useState(false);
  const [openUserSelector, setOpenUserSelector] = useState(false);
  const [searchQueryProducts, setSearchQueryProducts] = useState('');
  const [searchQueryCategories, setSearchQueryCategories] = useState('');
  const [searchQueryVariants, setSearchQueryVariants] = useState('');
  const [searchQueryUsers, setSearchQueryUsers] = useState('');

  // Load discount data when editing
  useEffect(() => {
    if (discountId) {
      const discount = mockDiscounts.find(d => d.id === discountId);
      if (discount) {
        setFormData({
          code: discount.code || "",
          type: discount.type,
          value: discount.value.toString(),
          startDate: new Date(discount.startDate),
          endDate: new Date(discount.endDate),
          isActive: discount.isActive,
          isGlobal: discount.isGlobal || false,
          minQuantity: discount.minQuantity?.toString() || "",
          maxQuantity: discount.maxQuantity?.toString() || "",
        });

        // Load assignments
        const assignedProducts = mockDiscountProducts
          .filter(dp => dp.discountId === discountId)
          .map(dp => dp.productId);
        setSelectedProducts(assignedProducts);

        const assignedCategories = mockDiscountCategories
          .filter(dc => dc.discountId === discountId)
          .map(dc => dc.categoryId);
        setSelectedCategories(assignedCategories);

        const assignedVariants = mockDiscountVariants
          .filter(dv => dv.discountId === discountId)
          .map(dv => dv.variantId);
        setSelectedVariants(assignedVariants);

        const assignedUsers = mockDiscountUsers
          .filter(du => du.discountId === discountId)
          .map(du => du.userId);
        setSelectedUsers(assignedUsers);
      }
    }
  }, [discountId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.value) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    if (formData.code && formData.isGlobal) {
      toast.error("Los descuentos globales no pueden tener un código");
      return;
    }

    // In a real app, this would make an API call
    toast.success(isEditing ? "Descuento actualizado exitosamente" : "Descuento creado exitosamente");
    onBack();
  };

  const handleChange = (field: string, value: string | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
    setOpenProductSelector(false);
    setSearchQueryProducts('');
  };

  const handleAddCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    setOpenCategorySelector(false);
    setSearchQueryCategories('');
  };

  const handleAddVariant = (variantId: string) => {
    if (!selectedVariants.includes(variantId)) {
      setSelectedVariants([...selectedVariants, variantId]);
    }
    setOpenVariantSelector(false);
    setSearchQueryVariants('');
  };

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
    setOpenUserSelector(false);
    setSearchQueryUsers('');
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleVariant = (variantId: string) => {
    setSelectedVariants(prev =>
      prev.includes(variantId)
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  const removeVariant = (variantId: string) => {
    setSelectedVariants(prev => prev.filter(id => id !== variantId));
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  // Filter available items
  const availableProducts = mockProducts.filter(p => {
    if (selectedProducts.includes(p.id)) return false;
    if (searchQueryProducts) {
      const query = searchQueryProducts.toLowerCase();
      return p.name.toLowerCase().includes(query) || 
             p.sku.toLowerCase().includes(query) ||
             p.brand?.toLowerCase().includes(query);
    }
    return true;
  });

  const availableCategories = mockCategories.filter(c => {
    if (selectedCategories.includes(c.id)) return false;
    if (searchQueryCategories) {
      const query = searchQueryCategories.toLowerCase();
      return c.name.toLowerCase().includes(query);
    }
    return true;
  });

  const availableVariants = mockProductVariants.filter(v => {
    if (selectedVariants.includes(v.id)) return false;
    if (searchQueryVariants) {
      const query = searchQueryVariants.toLowerCase();
      return v.sku.toLowerCase().includes(query) || v.size?.toLowerCase().includes(query);
    }
    return true;
  });

  const availableUsers = mockUsers.filter(u => {
    if (selectedUsers.includes(u.id)) return false;
    if (searchQueryUsers) {
      const query = searchQueryUsers.toLowerCase();
      return u.email.toLowerCase().includes(query) || u.name?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Descuento" : "Nuevo Descuento"}
        breadcrumbs={[
          { label: "Descuentos", href: "#" },
          { label: isEditing ? "Editar" : "Nuevo" },
        ]}
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Atrás
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Información del Descuento</CardTitle>
              <CardDescription>
                Define los detalles básicos y el tipo de descuento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Descuento</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                  placeholder="ej., VERANO2024"
                  disabled={formData.isGlobal}
                />
                <p className="text-muted-foreground">
                  Dejar vacío para descuentos globales
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo de Descuento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto fijo</SelectItem>
                    <SelectItem value="buy_x_get_y">Compra X Obtén Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  Valor <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  placeholder={formData.type === "percentage" ? "ej., 10" : "ej., 50.00"}
                  required
                />
                <p className="text-muted-foreground">
                  {formData.type === "percentage" ? "Porcentaje de descuento" : "Monto de descuento en moneda"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Fecha de inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && handleChange("startDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && handleChange("endDate", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {formData.type === "buy_x_get_y" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="minQuantity">Cantidad mínima</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      min="0"
                      value={formData.minQuantity}
                      onChange={(e) => handleChange("minQuantity", e.target.value)}
                      placeholder="Opcional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxQuantity">Cantidad máxima</Label>
                    <Input
                      id="maxQuantity"
                      type="number"
                      min="0"
                      value={formData.maxQuantity}
                      onChange={(e) => handleChange("maxQuantity", e.target.value)}
                      placeholder="Opcional"
                    />
                  </div>
                </>
              )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Configura la activación y comportamiento del descuento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Activo</Label>
                  <p className="text-muted-foreground">
                    Habilita o deshabilita este descuento
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isGlobal">Descuento global</Label>
                  <p className="text-muted-foreground">
                    Aplica automáticamente a todas las órdenes sin código
                  </p>
                </div>
                <Switch
                  id="isGlobal"
                  checked={formData.isGlobal}
                  onCheckedChange={(checked) => handleChange("isGlobal", checked)}
                />
              </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asignaciones</CardTitle>
              <CardDescription>
                Selecciona a qué productos, categorías, variantes o usuarios aplica este descuento.
                Si no seleccionas nada y el descuento es global, se aplicará a todo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assignmentType">Tipo de asignación</Label>
                <Select
                  value={assignmentType}
                  onValueChange={(value: any) => setAssignmentType(value)}
                >
                  <SelectTrigger id="assignmentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Productos</SelectItem>
                    <SelectItem value="categories">Categorías</SelectItem>
                    <SelectItem value="variants">Variantes</SelectItem>
                    <SelectItem value="users">Usuarios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Productos */}
              {assignmentType === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <Label className="text-base">Productos</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecciona productos específicos para este descuento
                  </p>

                  <Popover open={openProductSelector} onOpenChange={setOpenProductSelector}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar y agregar productos...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar por nombre, SKU o marca..." 
                        value={searchQueryProducts}
                        onValueChange={setSearchQueryProducts}
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron productos.</CommandEmpty>
                        <CommandGroup heading="Productos disponibles">
                          {availableProducts.slice(0, 8).map((p) => (
                            <CommandItem
                              key={p.id}
                              onSelect={() => handleAddProduct(p.id)}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{p.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {p.sku} • ${p.price.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-2 px-3">Producto</th>
                          <th className="text-left py-2 px-3">Marca</th>
                          <th className="text-left py-2 px-3">SKU</th>
                          <th className="text-left py-2 px-3">Precio</th>
                          <th className="text-left py-2 px-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.map(productId => {
                          const product = mockProducts.find(p => p.id === productId);
                          return product ? (
                            <tr key={productId} className="border-b">
                              <td className="py-2 px-3 truncate">{product.name}</td>
                              <td className="py-2 px-3">{product.brand || '-'}</td>
                              <td className="py-2 px-3">{product.sku}</td>
                              <td className="py-2 px-3">${product.price.toFixed(2)}</td>
                              <td className="py-2 px-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeProduct(productId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aún no hay productos asignados</p>
                    <p className="text-xs mt-1">Busca y agrega productos al descuento</p>
                  </div>
                )}
                </div>
              )}

              <Separator />

              {/* Categorías */}
              {assignmentType === 'categories' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <Label className="text-base">Categorías</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aplica el descuento a todos los productos en estas categorías
                  </p>

                  <Popover open={openCategorySelector} onOpenChange={setOpenCategorySelector}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar y agregar categorías...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar por nombre de categoría..." 
                        value={searchQueryCategories}
                        onValueChange={setSearchQueryCategories}
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                        <CommandGroup heading="Categorías disponibles">
                          {availableCategories.slice(0, 8).map((c) => (
                            <CommandItem
                              key={c.id}
                              onSelect={() => handleAddCategory(c.id)}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{c.name}</div>
                                  {c.description && (
                                    <div className="text-xs text-muted-foreground truncate">
                                      {c.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedCategories.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-2 px-3">Categoría</th>
                          <th className="text-left py-2 px-3">Descripción</th>
                          <th className="text-left py-2 px-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCategories.map(categoryId => {
                          const category = mockCategories.find(c => c.id === categoryId);
                          return category ? (
                            <tr key={categoryId} className="border-b">
                              <td className="py-2 px-3">{category.name}</td>
                              <td className="py-2 px-3 truncate">{category.description || '-'}</td>
                              <td className="py-2 px-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeCategory(categoryId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aún no hay categorías asignadas</p>
                    <p className="text-xs mt-1">Busca y agrega categorías al descuento</p>
                  </div>
                )}
                </div>
              )}

              <Separator />

              {/* Variantes */}
              {assignmentType === 'variants' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-muted-foreground" />
                    <Label className="text-base">Variantes de Productos</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aplica el descuento a variantes específicas (SKUs)
                  </p>

                  <Popover open={openVariantSelector} onOpenChange={setOpenVariantSelector}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar y agregar variantes...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar por SKU o tamaño..." 
                        value={searchQueryVariants}
                        onValueChange={setSearchQueryVariants}
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron variantes.</CommandEmpty>
                        <CommandGroup heading="Variantes disponibles">
                          {availableVariants.slice(0, 8).map((v) => (
                            <CommandItem
                              key={v.id}
                              onSelect={() => handleAddVariant(v.id)}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Grid3x3 className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                      {v.sku}
                                    </code>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {v.size && `Talla ${v.size}`}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedVariants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-2 px-3">SKU</th>
                          <th className="text-left py-2 px-3">Tamaño</th>
                          <th className="text-left py-2 px-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVariants.map(variantId => {
                          const variant = mockProductVariants.find(v => v.id === variantId);
                          return variant ? (
                            <tr key={variantId} className="border-b">
                              <td className="py-2 px-3">
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                  {variant.sku}
                                </code>
                              </td>
                              <td className="py-2 px-3">{variant.size || '-'}</td>
                              <td className="py-2 px-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariant(variantId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                    <Grid3x3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aún no hay variantes asignadas</p>
                    <p className="text-xs mt-1">Busca y agrega variantes al descuento</p>
                  </div>
                )}
                </div>
              )}

              <Separator />

              {/* Usuarios */}
              {assignmentType === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Label className="text-base">Usuarios Específicos</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Descuentos personalizados para usuarios seleccionados
                  </p>

                  <Popover open={openUserSelector} onOpenChange={setOpenUserSelector}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar y agregar usuarios...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar por email o nombre..." 
                        value={searchQueryUsers}
                        onValueChange={setSearchQueryUsers}
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                        <CommandGroup heading="Usuarios disponibles">
                          {availableUsers.slice(0, 8).map((u) => (
                            <CommandItem
                              key={u.id}
                              onSelect={() => handleAddUser(u.id)}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{u.email}</div>
                                  {u.name && (
                                    <div className="text-xs text-muted-foreground truncate">
                                      {u.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-2 px-3">Email</th>
                          <th className="text-left py-2 px-3">Nombre</th>
                          <th className="text-left py-2 px-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUsers.map(userId => {
                          const user = mockUsers.find(u => u.id === userId);
                          return user ? (
                            <tr key={userId} className="border-b">
                              <td className="py-2 px-3">{user.email}</td>
                              <td className="py-2 px-3">{user.name || '-'}</td>
                              <td className="py-2 px-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeUser(userId)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aún no hay usuarios asignados</p>
                    <p className="text-xs mt-1">Busca y agrega usuarios al descuento</p>
                  </div>
                )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar Descuento" : "Crear Descuento"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
