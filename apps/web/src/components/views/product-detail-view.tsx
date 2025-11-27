import { ArrowLeft, Edit, Package, Image as ImageIcon, Warehouse } from "lucide-react";
import { mockProducts, mockCategories, mockProductImages } from "../../lib/mock-data";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatusBadge } from "../status-badge";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface ProductDetailViewProps {
  productId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
  onManageStock?: () => void;
}

export function ProductDetailView({ productId, onBack, onEdit, onManageStock }: ProductDetailViewProps) {
  const product = mockProducts.find(p => p.id === productId);
  const productImages = mockProductImages.filter(img => img.productId === productId);
  const productCategory = mockCategories.find(c => c.id === product?.categoryId);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">Product not found</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{product.name}</h1>
            <p className="text-muted-foreground">{product.sku}</p>
          </div>
        </div>

        <Button onClick={() => onEdit?.(productId)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div>{product.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">SKU</div>
                  <div>{product.sku}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Brand</div>
                  <div>{product.brand || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div>{product.category?.name || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <StatusBadge
                    status={product.status}
                    variant={getStatusVariant(product.status)}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Available</div>
                  <StatusBadge
                    status={product.available ? 'yes' : 'no'}
                    variant={product.available ? 'success' : 'error'}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div>{product.description}</div>
              </div>

              {product.details && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Details</div>
                    <div className="grid gap-2">
                      {Object.entries(product.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {productCategory && (
                    <Badge variant="default">
                      {productCategory.name}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Materials</TableHead>
                      <TableHead>Closure Types</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Compare At</TableHead>
                      <TableHead>Available</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map(variant => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <code className="text-xs">{variant.sku}</code>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {variant.barcode || '—'}
                          </code>
                        </TableCell>
                        <TableCell>{variant.size || '—'}</TableCell>
                        <TableCell>
                          {variant.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: variant.color.hexCode }}
                              />
                              <span>{variant.color.name}</span>
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          {variant.materials && variant.materials.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {variant.materials.map(material => (
                                <Badge key={material.id} variant="outline" className="text-xs">
                                  {material.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          {variant.closureTypes && variant.closureTypes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {variant.closureTypes.map(closure => (
                                <Badge key={closure.id} variant="outline" className="text-xs">
                                  {closure.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground">
                            ${variant.price.toFixed(2)}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {variant.currency}
                          </div>
                        </TableCell>
                        <TableCell>
                          {variant.compareAtPrice ? (
                            <span className="text-sm line-through text-muted-foreground">
                              ${variant.compareAtPrice.toFixed(2)}
                            </span>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={variant.available ? 'available' : 'unavailable'}
                            variant={variant.available ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Inventory</CardTitle>
              {onManageStock && (
                <Button onClick={onManageStock} variant="outline" size="sm">
                  <Warehouse className="mr-2 h-4 w-4" />
                  Manage Stock
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Quantity</div>
                  <div>{product.quantity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Stock Status</div>
                  <StatusBadge
                    status={product.stockStatus.replace('_', ' ')}
                    variant={getStockVariant(product.stockStatus)}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Barcode</div>
                  <div>{product.barcode || '—'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-2xl">${product.price.toFixed(2)}</div>
              </div>
              {product.compareAtPrice && (
                <div>
                  <div className="text-sm text-muted-foreground">Compare at Price</div>
                  <div className="line-through text-muted-foreground">
                    ${product.compareAtPrice.toFixed(2)}
                  </div>
                </div>
              )}
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Cost per Item</div>
                <div>${product.cost.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Profit Margin</div>
                <div className="text-success">
                  ${(product.price - product.cost).toFixed(2)} (
                  {(((product.price - product.cost) / product.price) * 100).toFixed(1)}%)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {productImages.length > 0 ? (
                productImages.length === 1 ? (
                  // Single image - show without carousel
                  <div>
                    <AspectRatio ratio={1}>
                      <img
                        src={productImages[0].url}
                        alt={productImages[0].altText}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        Image 1
                      </span>
                      {productImages[0].isPrimary && (
                        <Badge variant="success" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  // Multiple images - show carousel
                  <Carousel className="w-full">
                    <CarouselContent>
                      {productImages.map((image, index) => (
                        <CarouselItem key={image.id}>
                          <div>
                            <AspectRatio ratio={1}>
                              <img
                                src={image.url}
                                alt={image.altText}
                                className="rounded-md object-cover w-full h-full"
                              />
                            </AspectRatio>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                Image {index + 1} of {productImages.length}
                              </span>
                              {image.isPrimary && (
                                <Badge variant="success" className="text-xs">
                                  Primary
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                )
              ) : (
                <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No images</p>
                  </div>
                </div>
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
                  {new Date(product.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm">
                  {new Date(product.updatedAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
