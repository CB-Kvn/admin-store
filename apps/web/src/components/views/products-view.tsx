import { useState } from "react";
import { Plus, Package, Search, Filter, Tag } from "lucide-react";
import { Product } from "../../lib/types";
import type { Product as ApiProduct } from "../../lib/api-types";
import { useProducts } from "../../hooks";
import { DataTable } from "../data-table";
import { StatusBadge } from "../status-badge";
import { PageHeader } from "../page-header";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface ProductsViewProps {
  onProductClick?: (productId: string) => void;
  onAddProduct?: () => void;
}

export function ProductsView({ onProductClick, onAddProduct }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  // Hook: fetch real products
  const { products: apiProducts } = useProducts();

  // Map API products to UI model, filling dummy data when missing
  const toUiProduct = (p: ApiProduct): Product => {
    const rawStocks = Array.isArray((p as any).stocks) ? (p as any).stocks : [];
    const quantity = typeof p.stock === 'number'
      ? p.stock
      : rawStocks.reduce((sum: number, s: any) => sum + (typeof s?.quantity === 'number' ? s.quantity : 0), 0);
    const stockStatus: Product["stockStatus"] = quantity === 0 ? 'out_of_stock' : quantity < 10 ? 'low_stock' : 'in_stock';
    const productName: string | undefined = (p as any).name ?? (p as any).productName;
    const productSku: string | undefined = (p as any).sku ?? (p as any).productSku;
    const brand: string | undefined = (p as any).brand ?? (p as any).brandName;
    const description: string | undefined = (p as any).description ?? (p as any).productDescription;
    const compareAtPrice: number | undefined = (p as any).compareAtPrice ?? (p as any).listPrice;
    const cost: number = (p as any).cost ?? (p as any).unitCost ?? 0;
    const barcode: string | undefined = (p as any).barcode ?? (p as any).ean ?? (p as any).upc;
    const statusValue: Product["status"] = ((p as any).status as Product["status"]) ?? ((p as any).state as Product["status"]) ?? 'active';
    const available: boolean = (p as any).available ?? (p as any).isAvailable ?? true;
    const createdAt: string = (p.createdAt as any) ?? (p as any).createdAt ?? (p as any).dateCreated ?? new Date().toISOString();
    const updatedAt: string = (p.updatedAt as any) ?? (p as any).updatedAt ?? (p as any).dateUpdated ?? new Date().toISOString();
    const discountProducts = Array.isArray((p as any).discountProducts) ? (p as any).discountProducts : [];
    const discountFamily = Array.isArray((p as any).discountFamily) ? (p as any).discountFamily : [];
    const discountCategories = Array.isArray((p as any).discountCategories) ? (p as any).discountCategories : [];
    const categoryDirect = (p as any)?.category;
    const categoriesList = Array.isArray((p as any)?.categories) ? (p as any).categories : [];
    const categoryCandidate = categoryDirect || categoriesList[0] || undefined;
    const imagesFirstUrl: string | undefined = Array.isArray((p as any).images) ? (p as any).images[0]?.url : undefined;
    const imageUrl: string | undefined = (p as any).imageUrl ?? imagesFirstUrl;

    console.log('[ProductsView] toUiProduct variables (L35-58)', {
      rawStocks,
      quantity,
      stockStatus,
      productName,
      productSku,
      brand,
      description,
      compareAtPrice,
      cost,
      barcode,
      statusValue,
      available,
      createdAt,
      updatedAt,
      discountProducts,
      discountFamily,
      discountCategories,
      categoryDirect,
      categoriesList,
      categoryCandidate,
      imagesFirstUrl,
      imageUrl,
    });
 
    return {
      id: String(p.id ?? Math.random()),
      name: productName ?? 'Producto sin nombre',
      slug: (p as any).slug ?? (productName ? productName.toLowerCase().replace(/\s+/g, '-') : 'producto-sin-slug'),
      brand: brand ?? 'Genérico',
      description: description ?? 'Sin descripción',
      details: (p as any).details ?? undefined,
      price: typeof p.price === 'number' ? p.price : 0,
      compareAtPrice: compareAtPrice ?? undefined,
      cost: cost,
      sku: productSku ?? 'SKU-NA',
      barcode: barcode ?? undefined,
      quantity,
      stockStatus,
      status: statusValue,
      categoryId: (p.categoryId as any) ?? (categoryCandidate?.id as any) ?? 'cat-dummy',
      category: {
        id: (categoryCandidate?.category?.id as any) ?? (p.categoryId as any) ?? 'cat-dummy',
        name: (categoryCandidate?.category?.name as any) ?? 'Sin categoría',
        slug: (categoryCandidate?.category?.slug as any) ?? 'sin-categoria',
        description: (categoryCandidate?.category?.description as any) ?? '',
        parentId: (categoryCandidate?.category?.parentId as any),
        productCount: (categoryCandidate?.category?.productCount as any) ?? 0,
        createdAt: (categoryCandidate?.category?.createdAt as any) ?? new Date().toISOString(),
        updatedAt: (categoryCandidate?.category?.updatedAt as any) ?? new Date().toISOString(),
      },
      imageUrl: imageUrl,
      images: (p as any).images ?? undefined,
      variants: (p as any).variants ?? undefined,
      tags: Array.isArray((p as any).tags) ? (p as any).tags : [],
      available: available,
      createdAt: createdAt,
      updatedAt: updatedAt,
      discountCounts: {
        products: discountProducts.length,
        family: discountFamily.length,
        categories: discountCategories.length,
      },
    };
  };

  const uiProducts: Product[] = (apiProducts ?? []).map(toUiProduct);
  const productsSource: Product[] = uiProducts.length > 0
    ? uiProducts
    : [{
        id: 'prod-dummy',
        name: 'Producto de ejemplo',
        slug: 'producto-ejemplo',
        brand: 'Genérico',
        description: 'Datos no disponibles. Mostrando ejemplo.',
        price: 0,
        cost: 0,
        sku: 'SKU-DUMMY',
        quantity: 10,
        stockStatus: 'in_stock',
        status: 'draft',
        categoryId: 'cat-dummy',
        category: {
          id: 'cat-dummy',
          name: 'Sin categoría',
          slug: 'sin-categoria',
          description: '',
          productCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tags: [],
        available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];

  const filteredProducts = productsSource.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    const matchesStock =
      stockFilter === "all" || product.stockStatus === stockFilter;

    return matchesSearch && matchesStatus && matchesStock;
  });

  const getStockVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      in_stock: 'success',
      low_stock: 'warning',
      out_of_stock: 'error',
    };
    return variants[status] || 'default';
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      active: 'success',
      draft: 'warning',
      archived: 'default',
    };
    return variants[status] || 'default';
  };

  const columns = [
    {
      key: 'name',
      label: 'Producto',
      sortable: true,
      render: (_value: any, product: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-foreground">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'discounts',
      label: 'Descuentos',
      sortable: false,
      render: (_value: any, product: Product) => {
        const p = product.discountCounts?.products ?? 0;
        const f = product.discountCounts?.family ?? 0;
        const c = product.discountCounts?.categories ?? 0;
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1"><Tag className="h-4 w-4" />P {p}</Badge>
            <Badge variant="outline">F {f}</Badge>
            <Badge variant="outline">C {c}</Badge>
          </div>
        );
      },
    },
    {
      key: 'category',
      label: 'Categoría',
      sortable: true,
      render: (_value: any, product: Product) => product.category?.name || '—',
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (_value: any, product: Product) => (
        <div>
          <div>${product.price.toFixed(2)}</div>
          {product.compareAtPrice && (
            <div className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
      render: (_value: any, product: Product) => (
        <div>
          <div>{product.quantity}</div>
          <StatusBadge
            status={product.stockStatus.replace('_', ' ')}
            variant={getStockVariant(product.stockStatus)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (_value: any, product: Product) => (
        <StatusBadge
          status={product.status}
          variant={getStatusVariant(product.status)}
        />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Actualizado',
      sortable: true,
      render: (_value: any, product: Product) =>
        new Date(product.updatedAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Administra tu catálogo de productos"
        action={
          onAddProduct
            ? { label: "Agregar Producto", onClick: onAddProduct }
            : undefined
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="archived">Archivado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Stocks</SelectItem>
              <SelectItem value="in_stock">En Stock</SelectItem>
              <SelectItem value="low_stock">Stock Bajo</SelectItem>
              <SelectItem value="out_of_stock">Sin Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        onRowClick={product => onProductClick?.(product.id)}
        showViewToggle={true}
        viewMode="cards"
        itemsPerPage={12}
        showPagination={true}
        cardRender={(product: Product) => (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                </div>
              </div>
              <StatusBadge
                status={product.status}
                variant={getStatusVariant(product.status)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Precio</p>
                <div>
                  <div>${product.price.toFixed(2)}</div>
                  {product.compareAtPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stock</p>
                <div>
                  <div>{product.quantity}</div>
                  <StatusBadge
                    status={product.stockStatus.replace('_', ' ')}
                    variant={getStockVariant(product.stockStatus)}
                  />
                </div>
              </div>
            </div>

            {product.category && (
              <>
                <Separator />
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{product.category.name}</span>
                </div>
              </>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}