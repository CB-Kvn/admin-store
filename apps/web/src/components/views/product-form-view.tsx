import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon, Trash2, GripVertical, Search, Package } from "lucide-react";
// Tipamos el formulario con la interfaz Product del API
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PageHeader } from "../page-header";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { mockProducts } from "../../lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { useAttributes } from "../../hooks/useAttributes";
import { useGetWarehousesQuery, useGetCategoriesQuery, useGetProductByIdQuery } from "../../state";
import type { ApiProduct, ApiAttribute } from "../../lib/api-types";
import type { Product as UiProduct } from "../../lib/types";

// Tipos del recurso de producto según el API
export interface Product {
  id: number;
  familyId: string;
  familySlug: string;
  productName: string;
  productDescription: string;
  brand: string;
  productDetails: ProductDetails;
  productAvailable: boolean;
  sku: string;
  barcode: string;
  title: string;
  attributes: Attribute[];
  price: number;
  compareAtPrice: number | null;
  currency: string;
  variantAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
  categories: CategoryElement[];
  stocks: Stock[];
  discountProducts: DiscountProduct[];
  discountFamily: DiscountFamily[];
  discountCategories: Discount[];
}

export interface Attribute {
  material?: string;
  stone?: string;
  size?: string;
  closureType?: string;
}

export interface CategoryElement {
  itemId: number;
  categoryId: number;
  assignedAt: Date;
  category: CategoryCategory;
}

export interface CategoryCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
  DiscountCategory: DiscountCategory[];
}

export interface DiscountCategory {
  id: number;
  discountId: number;
  categoryId: number;
  discount: Discount;
}

export interface Discount {
  id: number;
  type: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  minQuantity: number | null;
  maxQuantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  usageLimit: number | null;
  timesUsed: number;
  isGlobal: boolean;
}

export interface DiscountProduct {
  id: number;
  discountId: number;
  itemId: number;
  discount: Discount;
}

export interface DiscountFamily {
  id: number;
  discountId: number;
  familyId: string;
  discount: Discount;
}

export interface Image {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  state: boolean;
  itemId: number;
}

export interface ProductDetails {
  finish: string;
  origin: string;
}

export interface Stock {
  id: string;
  itemId: number;
  warehouseId: string;
  quantity: number;
  minimumStock: number;
  location: string;
  status: string;
  lastUpdated: Date;
  price: number;
  cost: number;
  warehouse: Warehouse;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  lastInventoryDate: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductFormViewProps {
  product?: ApiProduct | null;
  productId?: string;
  onBack: () => void;
  onSave?: (product: Partial<ApiProduct>) => void;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

interface DetailField {
  key: string;
  value: string;
}

export function ProductFormView({ product, productId, onBack, onSave }: ProductFormViewProps) {
  // Si llega productId (modo edición), consultamos el producto en API
  console.log('product', product);
  const { data: apiProduct } = useGetProductByIdQuery(productId as any, { skip: !productId });
  const [formData, setFormData] = useState({
    name: product?.productName || '',
    sku: product?.sku || '',
    brand: product?.brand || '',
    description: product?.productDescription || '',
    price: product?.price != null ? String(product.price) : '',
    compareAtPrice: product?.compareAtPrice != null ? String(product.compareAtPrice) : '',
    cost: (product?.stocks?.[0]?.cost != null) ? String(product.stocks[0].cost) : '',
    quantity: Array.isArray(product?.stocks)
      ? String(product!.stocks.reduce((sum, s) => sum + (s?.quantity ?? 0), 0))
      : '',
    categoryId: product?.categories?.[0]?.categoryId != null ? String(product.categories[0].categoryId) : '',
    status: 'draft',
    barcode: product?.barcode || '',
    available: product?.productAvailable ?? true,
  });
  const [skuTouched, setSkuTouched] = useState<boolean>(!!product);

  // Atributos seleccionados (prepopular desde detalles si existen)
  const initialAttr = (product?.attributes && product.attributes[0]) ? product.attributes[0] : {} as ApiAttribute;
  const [selectedColorId, setSelectedColorId] = useState<string>("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedClosureTypeId, setSelectedClosureTypeId] = useState<string>("");
  const [selectedStone, setSelectedStone] = useState<string>(initialAttr?.stone || "");
  const [selectedSize, setSelectedSize] = useState<string>(initialAttr?.size || "");

  // Bodegas e inventarios planificados
  const { data: warehouses = [] } = useGetWarehousesQuery(undefined);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [inventoryQuantity, setInventoryQuantity] = useState<string>("");
  const [plannedInventories, setPlannedInventories] = useState<
    { warehouseId: string; quantity: number }[]
  >([]);

  // Categorías y subcategorías
  const { data: categories = [] } = useGetCategoriesQuery(undefined);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("none");

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const current = categories.find(c => String(c.id) === String(formData.categoryId));
    if (current) {
      if (current.parentId) {
        setSelectedParentCategoryId(String(current.parentId));
        setSelectedSubcategoryId(String(current.id));
      } else {
        setSelectedParentCategoryId(String(current.id));
        setSelectedSubcategoryId("none");
      }
    } else {
      setSelectedParentCategoryId("");
      setSelectedSubcategoryId("none");
    }
  }, [categories, formData.categoryId]);

  // Carga de listas de atributos
  const { colors, materials, closureTypes, stones, sizes, loadingAny, errorAny } = useAttributes();

  const [images, setImages] = useState<ProductImage[]>([]);
  const [detailFields, setDetailFields] = useState<DetailField[]>(
    product?.productDetails 
      ? Object.entries(product.productDetails).map(([key, value]) => ({ 
          key, 
          value: String(value ?? '') 
        }))
      : []
  );

  // Modo edición y productos relacionados provenientes del API
  const isEditing = !!productId;
  const relatedFromApi: ApiProduct[] = (
    (apiProduct?.relatedItems as ApiProduct[] | undefined) ??
    (product?.relatedItems as ApiProduct[] | undefined) ??
    []
  );

  // Prellenar campos desde API cuando estemos en modo edición y el producto cargue
  useEffect(() => {
    if (!apiProduct) return;
    const p = apiProduct;
    const totalQuantity = Array.isArray(p.stocks)
      ? p.stocks.reduce((sum, s) => sum + (s?.quantity ?? 0), 0)
      : 0;
    const quantity = totalQuantity ? String(totalQuantity) : '';
    setFormData(prev => ({
      ...prev,
      name: String(p.productName ?? prev.name ?? ''),
      sku: String(p.sku ?? prev.sku ?? ''),
      brand: String(p.brand ?? prev.brand ?? ''),
      description: String(p.productDescription ?? prev.description ?? ''),
      price: typeof p.price === 'number' ? String(p.price) : (prev.price ?? ''),
      compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : (prev.compareAtPrice ?? ''),
      // Tomar costo del primer stock (se asume igual entre bodegas)
      cost: (p.stocks?.[0]?.cost != null) ? String(p.stocks[0].cost) : (prev.cost ?? ''),
      quantity,
      categoryId: String(p.categories?.[0]?.categoryId ?? prev.categoryId ?? ''),
      status: String(prev.status ?? 'active'),
      barcode: String(p.barcode ?? prev.barcode ?? ''),
      available: Boolean(p.productAvailable ?? prev.available ?? true),
    }));

    // Atributos (nombres), sólo rellenamos los de texto libre
    const attr = p.attributes?.[0];
    if (attr?.stone) setSelectedStone(String(attr.stone));
    if (attr?.size) setSelectedSize(String(attr.size));
  }, [apiProduct]);

  // Sincronizar imágenes desde API en modo edición
  useEffect(() => {
    const sourceImages = (apiProduct?.images ?? product?.images ?? []) as any[];
    if (Array.isArray(sourceImages) && sourceImages.length) {
      const mapped: ProductImage[] = sourceImages.map((img: any) => ({
        id: String(img.id ?? `img-${Date.now()}`),
        url: String(img.url ?? ''),
        altText: String(img.alt ?? ''),
        isPrimary: !!img.isPrimary,
      }));
      setImages(mapped);
    }
  }, [apiProduct, product]);

  // Cuando atributos y listas estén disponibles, mapear por nombre a IDs para selects
  useEffect(() => {
    if (!apiProduct) return;
    const p = apiProduct;
    const attr = p.attributes?.[0];
    if (!attr) return;

    // Material → ID
    if (attr.material && Array.isArray(materials)) {
      const match = (materials as any[]).find(m => String(m?.name).toLowerCase() === String(attr.material).toLowerCase());
      if (match && match.id != null) setSelectedMaterialId(String(match.id));
    }

    // Tipo de cierre → ID
    if (attr.closureType && Array.isArray(closureTypes)) {
      const match = (closureTypes as any[]).find(ct => String(ct?.name).toLowerCase() === String(attr.closureType).toLowerCase());
      if (match && match.id != null) setSelectedClosureTypeId(String(match.id));
    }
  }, [apiProduct, materials, closureTypes]);
  // Utilidades para generación automática de códigos
  const stripAccents = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const toCode = (text?: string, maxLen: number = 3) => {
    if (!text) return '';
    const cleaned = stripAccents(String(text))
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .toUpperCase();
    // Tomar primeras letras de palabras hasta alcanzar maxLen
    const words = cleaned.split(' ').filter(Boolean);
    let result = '';
    for (const w of words) {
      if (result.length >= maxLen) break;
      result += w.slice(0, Math.max(1, Math.min(maxLen - result.length, 2))); // 1-2 letras por palabra
    }
    if (result.length < maxLen) {
      result = (result + cleaned.replace(/\s/g, '')).slice(0, maxLen);
    }
    return result;
  };

  const generateUUID = () => {
    try {
      if (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.randomUUID) {
        return (globalThis as any).crypto.randomUUID();
      }
    } catch {}
    // Fallback UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const resolveNameById = (list: Array<{ id: any; name: string }>, id?: string) => {
    if (!id) return '';
    const found = list.find((i) => String(i.id) === String(id));
    return found?.name || '';
  };

  // Generar UUID de código de barras automáticamente al crear
  useEffect(() => {
    if (!product) {
      setFormData((prev) => ({
        ...prev,
        barcode: prev.barcode || generateUUID(),
      }));
    }
    // Ejecutar solo una vez al montar en modo creación
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generación automática de SKU basada en combinación de inputs (solo si no ha sido editado manualmente)
  useEffect(() => {
    if (product) return; // No autogenerar en edición
    if (skuTouched) return; // El usuario ya lo editó manualmente

    const categoryName = resolveNameById(categories, formData.categoryId);
    const colorName = resolveNameById(colors as any, selectedColorId);
    const materialName = resolveNameById(materials as any, selectedMaterialId);
    const closureName = resolveNameById(closureTypes as any, selectedClosureTypeId);

    const parts = [
      toCode(formData.brand, 3),
      toCode(categoryName, 3),
      toCode(colorName, 2),
      toCode(materialName, 2),
      toCode(selectedSize, 3),
      toCode(closureName, 2),
    ].filter((p) => p);

    const newSku = parts.join('-').toUpperCase();

    setFormData((prev) => {
      if (prev.sku === newSku) return prev;
      // Actualizar SKU solo si no hay uno establecido manualmente
      return { ...prev, sku: newSku };
    });
  }, [
    product,
    skuTouched,
    formData.brand,
    formData.categoryId,
    selectedColorId,
    selectedMaterialId,
    selectedSize,
    selectedClosureTypeId,
    categories,
    colors,
    materials,
    closureTypes,
  ]);
  const [relatedProducts, setRelatedProducts] = useState<UiProduct[]>([]);
  const [openProductSelector, setOpenProductSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  

  const handleAddImage = () => {
    const newImage: ProductImage = {
      id: `img-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      altText: formData.name || 'Product image',
      isPrimary: images.length === 0,
    };
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSetPrimaryImage = (id: string) => {
    setImages(images.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const handleAddDetailField = () => {
    setDetailFields([...detailFields, { key: '', value: '' }]);
  };

  const handleUpdateDetailField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...detailFields];
    updated[index][field] = value;
    setDetailFields(updated);
  };

  const handleRemoveDetailField = (index: number) => {
    setDetailFields(detailFields.filter((_, i) => i !== index));
  };

  const handleAddRelatedProduct = (productToAdd: UiProduct) => {
    if (!relatedProducts.find(p => p.id === productToAdd.id) && productToAdd.id !== product?.id) {
      setRelatedProducts([...relatedProducts, productToAdd]);
    }
    setOpenProductSelector(false);
    setSearchQuery('');
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    setRelatedProducts(relatedProducts.filter(p => p.id !== productId));
  };

  const availableProducts = mockProducts.filter(p => {
    // Exclude current product and already selected products
    if (p.id === product?.id) return false;
    if (relatedProducts.find(rp => rp.id === p.id)) return false;
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(query) || 
             p.sku.toLowerCase().includes(query) ||
             p.brand?.toLowerCase().includes(query);
    }
    return true;
  });

  const calculateProfitMargin = () => {
    const price = parseFloat(formData.price);
    const cost = parseFloat(formData.cost);
    if (isNaN(price) || isNaN(cost) || price === 0) return null;
    const margin = price - cost;
    const percentage = (margin / price) * 100;
    return { margin, percentage };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const details = detailFields
      .filter(field => field.key.trim() && field.value.trim())
      .reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {} as Record<string, any>);

    // Inyectar atributos seleccionados en detalles
    if (selectedColorId) details.colorId = selectedColorId;
    if (selectedMaterialId) details.materialId = selectedMaterialId;
    if (selectedClosureTypeId) details.closureTypeId = selectedClosureTypeId;
    if (selectedStone) details.stone = selectedStone;
    if (selectedSize) details.size = selectedSize;

    // Inventario inicial por bodega
    if (plannedInventories.length > 0) {
      details.initialInventory = plannedInventories;
    }

    const productData: Partial<Product> = {
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand || undefined,
      description: formData.description,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      cost: parseFloat(formData.cost),
      quantity: parseInt(formData.quantity),
      categoryId: formData.categoryId,
      status: formData.status as any,
      barcode: formData.barcode || undefined,
      available: formData.available,
      details: Object.keys(details).length > 0 ? details : undefined,
    };

    // En edición, incluir payload de imágenes para que el backend actualice la galería
    if (onSave) {
      if (isEditing) {
        const imagesPayload = images.map((img) => ({
          url: img.url,
          alt: img.altText,
          isPrimary: !!img.isPrimary,
          state: true,
        }));
        onSave({ ...(productData as any), images: imagesPayload } as any);
      } else {
        onSave(productData);
      }
    }
  };

  const profitData = calculateProfitMargin();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={onBack} className="-ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Productos
        </Button>
      </div>

      <PageHeader
        title={product ? 'Editar Producto' : 'Crear Producto'}
        breadcrumbs={[
          { label: 'Productos', href: '#' },
          { label: product ? 'Editar' : 'Crear' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Proporciona los detalles esenciales del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ingresa el nombre del producto"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      disabled
                      placeholder="ej., PROD-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                      placeholder="Ingresa la marca"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="barcode">Código de barras</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    disabled
                    placeholder="Ingresa el número de código de barras"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    placeholder="Describe tu producto en detalle..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Precios */}
            <Card>
              <CardHeader>
                <CardTitle>Precios</CardTitle>
                <CardDescription>
                  Configura los detalles de precio del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Precio *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="compareAtPrice">Precio anterior</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Precio original para mostrar descuentos
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cost">Costo por artículo *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) => handleChange('cost', e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tu costo por inventario y envío
                  </p>
                </div>

                {profitData && (
                  <>
                    <Separator />
                    <div className="bg-muted/50 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Margen de ganancia</span>
                        <div className="text-right">
                          <div className="text-success">
                            ${profitData.margin.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {profitData.percentage.toFixed(1)}% de margen
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Inventario */}
            <Card>
              <CardHeader>
                <CardTitle>Inventario</CardTitle>
                <CardDescription>
                  Gestiona los niveles de stock para este producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="0"
                    required
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Cantidad calculada automáticamente desde el inventario por bodega (stocks).
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="available">Disponible para la venta</Label>
                    <p className="text-sm text-muted-foreground">
                      Haz visible este producto para los clientes
                    </p>
                  </div>
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => handleChange('available', checked)}
                  />
                </div>

                <Separator />
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="warehouse">Bodega</Label>
                      <Select
                        value={selectedWarehouseId}
                        onValueChange={(v) => setSelectedWarehouseId(v)}
                      >
                        <SelectTrigger id="warehouse">
                          <SelectValue placeholder="Selecciona una bodega" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map((w) => (
                            <SelectItem key={w.id} value={String(w.id)}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Label htmlFor="warehouse-qty">Cantidad</Label>
                      <Input
                        id="warehouse-qty"
                        type="number"
                        min={0}
                        value={inventoryQuantity}
                        onChange={(e) => setInventoryQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const qtyNum = Number(inventoryQuantity);
                        if (!selectedWarehouseId || Number.isNaN(qtyNum) || qtyNum <= 0) {
                          return;
                        }
                        setPlannedInventories((prev) => {
                          const existingIndex = prev.findIndex(
                            (p) => String(p.warehouseId) === String(selectedWarehouseId)
                          );
                          if (existingIndex >= 0) {
                            const next = [...prev];
                            next[existingIndex] = {
                              warehouseId: selectedWarehouseId,
                              quantity: qtyNum,
                            };
                            return next;
                          }
                          return [
                            ...prev,
                            { warehouseId: selectedWarehouseId, quantity: qtyNum },
                          ];
                        });
                        setInventoryQuantity("");
                      }}
                    >
                      Crear inventario
                    </Button>
                  </div>

                  {plannedInventories.length > 0 && (
                    <div className="space-y-2">
                      <Label>Inventarios planificados</Label>
                      <div className="space-y-2">
                        {plannedInventories.map((pi) => {
                          const wh = warehouses.find(
                            (w) => String(w.id) === String(pi.warehouseId)
                          );
                          return (
                            <div
                              key={`${pi.warehouseId}`}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">
                                  {wh ? wh.name : `Bodega ${pi.warehouseId}`}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Cantidad: {pi.quantity}
                                </span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setPlannedInventories((prev) =>
                                    prev.filter(
                                      (p) => String(p.warehouseId) !== String(pi.warehouseId)
                                    )
                                  )
                                }
                              >
                                Quitar
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Inventario actual por bodega (stocks del producto) */}
                  <Separator />
                  <div className="space-y-2">
                    <Label>Inventario actual por bodega</Label>
                    {(() => {
                      const stocksToDisplay = (apiProduct?.stocks ?? product?.stocks ?? []) as ApiProduct['stocks'];
                      if (!stocksToDisplay || stocksToDisplay.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground">Sin inventario registrado.</p>
                        );
                      }
                      return (
                        <div className="overflow-x-auto rounded-md border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-2">Bodega</th>
                                <th className="text-left p-2">Cantidad</th>
                                <th className="text-left p-2">Mínimo</th>
                                <th className="text-left p-2">Ubicación</th>
                                <th className="text-left p-2">Estado</th>
                                <th className="text-left p-2">Actualizado</th>
                                <th className="text-left p-2">Precio</th>
                                <th className="text-left p-2">Costo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stocksToDisplay.map((s) => (
                                <tr key={String(s.id)} className="border-t">
                                  <td className="p-2">{s.warehouse?.name ?? s.warehouseId}</td>
                                  <td className="p-2">{s.quantity}</td>
                                  <td className="p-2">{s.minimumStock}</td>
                                  <td className="p-2">{s.location}</td>
                                  <td className="p-2 capitalize">{s.status}</td>
                                  <td className="p-2">{s.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : '-'}</td>
                                  <td className="p-2">{typeof s.price === 'number' ? `$${s.price.toFixed(2)}` : '-'}</td>
                                  <td className="p-2">{typeof s.cost === 'number' ? `$${s.cost.toFixed(2)}` : '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del Producto */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Producto</CardTitle>
                <CardDescription>
                  Agrega atributos y especificaciones personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {detailFields.map((field, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Nombre del atributo"
                      value={field.key}
                      onChange={(e) => handleUpdateDetailField(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valor"
                      value={field.value}
                      onChange={(e) => handleUpdateDetailField(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveDetailField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDetailField}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar campo de detalle
                </Button>
              </CardContent>
            </Card>

            

            {/* Productos relacionados */}
            <Card>
              <CardHeader>
                <CardTitle>Productos relacionados</CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Relacionados por familia (solo lectura)'
                    : 'Agrega productos de la misma familia o colección'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  relatedFromApi && relatedFromApi.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left py-2 px-3">Producto</th>
                            <th className="text-left py-2 px-3">Marca</th>
                            <th className="text-left py-2 px-3">SKU</th>
                            <th className="text-left py-2 px-3">Precio</th>
                            <th className="text-left py-2 px-3">Cantidad</th>
                            <th className="text-left py-2 px-3">Familia</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relatedFromApi.map((rp) => {
                            const qty = Array.isArray(rp.stocks)
                              ? rp.stocks.reduce((sum, s) => sum + (s?.quantity ?? 0), 0)
                              : 0;
                            return (
                              <tr key={rp.id} className="border-b">
                                <td className="py-2 px-3 truncate">{rp.productName}</td>
                                <td className="py-2 px-3">{rp.brand || '-'}</td>
                                <td className="py-2 px-3">{rp.sku}</td>
                                <td className="py-2 px-3">{typeof rp.price === 'number' ? `$${rp.price.toFixed(2)}` : '-'}</td>
                                <td className="py-2 px-3">{qty}</td>
                                <td className="py-2 px-3">{rp.familyId}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Este producto no tiene relacionados por familia</p>
                    </div>
                  )
                ) : (
                  <>
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
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>No se encontraron productos.</CommandEmpty>
                            <CommandGroup heading="Productos disponibles">
                              {availableProducts.slice(0, 8).map((p) => (
                                <CommandItem
                                  key={p.id}
                                  onSelect={() => handleAddRelatedProduct(p)}
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

                    {relatedProducts.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left py-2 px-3">Producto</th>
                              <th className="text-left py-2 px-3">Marca</th>
                              <th className="text-left py-2 px-3">SKU</th>
                              <th className="text-left py-2 px-3">Precio</th>
                              <th className="text-left py-2 px-3">Cantidad</th>
                              <th className="text-left py-2 px-3">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {relatedProducts.map((relatedProduct) => (
                              <tr key={relatedProduct.id} className="border-b">
                                <td className="py-2 px-3 truncate">{relatedProduct.name}</td>
                                <td className="py-2 px-3">{relatedProduct.brand || '-'}</td>
                                <td className="py-2 px-3">{relatedProduct.sku}</td>
                                <td className="py-2 px-3">${relatedProduct.price.toFixed(2)}</td>
                                <td className="py-2 px-3">{relatedProduct.quantity}</td>
                                <td className="py-2 px-3">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveRelatedProduct(relatedProduct.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aún no hay productos relacionados</p>
                        <p className="text-xs mt-1">Busca y agrega productos de la misma familia</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Imágenes del Producto */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes del Producto</CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Edita las imágenes del producto y marca la principal'
                    : 'Agrega imágenes para mostrar tu producto'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {images.length > 0 ? (
                    images.map((image) => (
                      <div key={image.id} className="relative group">
                        <AspectRatio ratio={1}>
                          <img
                            src={image.url}
                            alt={image.altText}
                            className="rounded-md object-cover w-full h-full border"
                          />
                        </AspectRatio>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={() => handleRemoveImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          {image.isPrimary ? (
                            <Badge variant="default" className="text-xs">Principal</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Secundaria</Badge>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            className="h-auto p-0 hover:bg-transparent"
                          >
                            {image.isPrimary ? (
                              <span className="text-xs">Imagen principal</span>
                            ) : (
                              <span className="text-xs text-muted-foreground hover:text-foreground">
                                Establecer como principal
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay imágenes todavía</p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center group"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-foreground transition-colors" />
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        Agregar imagen
                      </p>
                    </div>
                  </button>
                </div>
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Haz clic en "Agregar imagen" para subir fotos del producto. La primera imagen se establecerá como principal por defecto.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Atributos */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos</CardTitle>
                <CardDescription>
                  Selecciona color, material, cierre, piedra y tamaño
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorAny && (
                  <p className="text-xs text-destructive">Error al cargar atributos.</p>
                )}
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={selectedColorId}
                    onValueChange={(value) => setSelectedColorId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingAny ? "Cargando..." : "Selecciona color"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(colors || []).map((c) => (
                        <SelectItem key={String((c as any).id)} value={String((c as any).id)}>
                          {(c as any).name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={selectedMaterialId}
                    onValueChange={(value) => setSelectedMaterialId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingAny ? "Cargando..." : "Selecciona material"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(materials || []).map((m) => (
                        <SelectItem key={String((m as any).id)} value={String((m as any).id)}>
                          {(m as any).name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="closure">Cierre</Label>
                  <Select
                    value={selectedClosureTypeId}
                    onValueChange={(value) => setSelectedClosureTypeId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingAny ? "Cargando..." : "Selecciona cierre"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(closureTypes || []).map((ct) => (
                        <SelectItem key={String((ct as any).id)} value={String((ct as any).id)}>
                          {(ct as any).name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="stone" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="stone">Piedra</TabsTrigger>
                    <TabsTrigger value="size">Tamaño</TabsTrigger>
                  </TabsList>
                  <TabsContent value="stone">
                    <div className="mt-4">
                      <Label htmlFor="stone">Piedra</Label>
                      <Select
                        value={selectedStone}
                        onValueChange={(value) => setSelectedStone(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingAny ? "Cargando..." : "Selecciona piedra"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(stones || []).map((s) => (
                            <SelectItem key={String((s as any).id)} value={String((s as any).name)}>
                              {(s as any).name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="size">
                    <div className="mt-4">
                      <Label htmlFor="size">Tamaño</Label>
                      <Select
                        value={selectedSize}
                        onValueChange={(value) => setSelectedSize(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingAny ? "Cargando..." : "Selecciona tamaño"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(sizes || []).map((sz) => (
                            <SelectItem key={String((sz as any).id)} value={String((sz as any).name)}>
                              {(sz as any).name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle>Organización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={selectedParentCategoryId}
                    onValueChange={(value) => {
                      setSelectedParentCategoryId(value);
                      setSelectedSubcategoryId("none");
                      handleChange('categoryId', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => !c.parentId)
                        .map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedParentCategoryId && categories.some(c => String(c.parentId) === String(selectedParentCategoryId)) && (
                  <div>
                    <Label htmlFor="subcategory">Subcategoría</Label>
                    <Select
                      value={selectedSubcategoryId}
                      onValueChange={(value) => {
                        if (value === 'none') {
                          setSelectedSubcategoryId('none');
                          handleChange('categoryId', selectedParentCategoryId);
                        } else {
                          setSelectedSubcategoryId(value);
                          handleChange('categoryId', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona subcategoría (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin subcategoría</SelectItem>
                        {categories
                          .filter((c) => String(c.parentId) === String(selectedParentCategoryId))
                          .map((subcategory) => (
                            <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full">
                  {product ? 'Actualizar Producto' : 'Crear Producto'}
                </Button>
                <Button type="button" variant="outline" onClick={onBack} className="w-full">
                  Cancelar
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="mb-1">
                    <strong className="text-foreground">Nombre del Producto:</strong> Usa nombres claros y descriptivos
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="mb-1">
                    <strong className="text-foreground">Imágenes:</strong> Sube fotos de alta calidad desde múltiples ángulos
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="mb-1">
                    <strong className="text-foreground">Precios:</strong> Considera precios de la competencia y márgenes de ganancia
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
