import React from 'react';
import { ArrowLeft, Edit, Percent, DollarSign, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { StatusBadge } from '../status-badge';
import { Switch } from '../ui/switch';
import {
  mockDiscounts,
  mockDiscountProducts,
  mockDiscountCategories,
  mockDiscountVariants,
  mockDiscountUsers,
  mockProducts,
  mockCategories,
  mockProductVariants,
  mockUsers,
  mockColors,
} from '../../lib/mock-data';
import { Progress } from '../ui/progress';

interface DiscountDetailViewProps {
  discountId: string;
  onBack: () => void;
  onEdit?: (id: string) => void;
}

export function DiscountDetailView({ discountId, onBack, onEdit }: DiscountDetailViewProps) {
  const discount = mockDiscounts.find(d => d.id === discountId);

  // Get discount assignments
  const assignedProducts = mockDiscountProducts
    .filter(dp => dp.discountId === discountId)
    .map(dp => mockProducts.find(p => p.id === dp.productId))
    .filter(Boolean);

  const assignedCategories = mockDiscountCategories
    .filter(dc => dc.discountId === discountId)
    .map(dc => mockCategories.find(c => c.id === dc.categoryId))
    .filter(Boolean);

  const assignedVariants = mockDiscountVariants
    .filter(dv => dv.discountId === discountId)
    .map(dv => {
      const variant = mockProductVariants.find(v => v.id === dv.variantId);
      if (variant) {
        // Ensure color is populated
        variant.color = mockColors.find(c => c.id === variant.colorId);
      }
      return variant;
    })
    .filter(Boolean);

  const assignedUsers = mockDiscountUsers
    .filter(du => du.discountId === discountId)
    .map(du => mockUsers.find(u => u.id === du.userId))
    .filter(Boolean);

  if (!discount) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="mb-2">Discount not found</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discounts
          </Button>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    return type === 'percentage' ? Percent : DollarSign;
  };

  const getTypeVariant = (type: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      percentage: 'success',
      fixed: 'warning',
      buy_x_get_y: 'default',
    };
    return variants[type] || 'default';
  };

  const usagePercentage = discount.usageLimit
    ? (discount.timesUsed / discount.usageLimit) * 100
    : 0;

  const isExpired = new Date(discount.endDate) < new Date();
  const isUpcoming = new Date(discount.startDate) > new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1>{discount.code || 'Auto-applied Discount'}</h1>
            <p className="text-muted-foreground">
              {discount.isGlobal ? 'Global Discount' : 'Targeted Discount'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit?.(discountId)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant={discount.isActive ? 'outline' : 'default'}>
            {discount.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discount Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Code</div>
                  <div className="flex items-center gap-2">
                    {discount.code ? (
                      <>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <code className="text-lg">{discount.code}</code>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Auto-applied</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="flex items-center gap-2 mt-1">
                    {React.createElement(getTypeIcon(discount.type), {
                      className: 'h-4 w-4',
                    })}
                    <StatusBadge
                      status={discount.type.replace('_', ' ')}
                      variant={getTypeVariant(discount.type)}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Value</div>
                  <div className="text-2xl">
                    {discount.type === 'percentage'
                      ? `${discount.value}%`
                      : `$${discount.value}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-1">
                    {isExpired ? (
                      <StatusBadge status="expired" variant="error" />
                    ) : isUpcoming ? (
                      <StatusBadge status="upcoming" variant="warning" />
                    ) : discount.isActive ? (
                      <StatusBadge status="active" variant="success" />
                    ) : (
                      <StatusBadge status="inactive" variant="default" />
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Start Date</div>
                  <div>
                    {new Date(discount.startDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div>
                    {new Date(discount.endDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-2">Usage</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {discount.timesUsed.toLocaleString()} times used
                      {discount.usageLimit &&
                        ` of ${discount.usageLimit.toLocaleString()}`}
                    </span>
                    {discount.usageLimit && (
                      <span className="text-muted-foreground">
                        {usagePercentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {discount.usageLimit && <Progress value={usagePercentage} />}
                </div>
              </div>

              {(discount.minQuantity || discount.maxQuantity) && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Quantity Rules
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {discount.minQuantity && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Minimum:
                          </span>
                          <Badge variant="outline">{discount.minQuantity}</Badge>
                        </div>
                      )}
                      {discount.maxQuantity && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Maximum:
                          </span>
                          <Badge variant="outline">{discount.maxQuantity}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Assignments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Products */}
              <div>
                <div className="text-sm font-medium mb-3">
                  Assigned Products ({assignedProducts.length})
                </div>
                {assignedProducts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedProducts.map(product => (
                      <Badge key={product!.id} variant="secondary">
                        {product!.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No products assigned</p>
                )}
              </div>

              <Separator />

              {/* Categories */}
              <div>
                <div className="text-sm font-medium mb-3">
                  Assigned Categories ({assignedCategories.length})
                </div>
                {assignedCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedCategories.map(category => (
                      <Badge key={category!.id} variant="secondary">
                        {category!.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No categories assigned
                  </p>
                )}
              </div>

              <Separator />

              {/* Variants */}
              <div>
                <div className="text-sm font-medium mb-3">
                  Assigned Variants ({assignedVariants.length})
                </div>
                {assignedVariants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedVariants.map(variant => (
                      <Badge key={variant!.id} variant="outline">
                        <code className="text-xs">{variant!.sku}</code>
                        {variant!.color && (
                          <span className="ml-1">
                            - {variant!.color.name}
                            {variant!.size && ` / ${variant!.size}`}
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No variants assigned</p>
                )}
              </div>

              <Separator />

              {/* Users */}
              <div>
                <div className="text-sm font-medium mb-3">
                  Assigned Users ({assignedUsers.length})
                </div>
                {assignedUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedUsers.map(user => (
                      <Badge key={user!.id} variant="default">
                        {user!.email}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No users assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <Switch 
                  checked={discount.isActive}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Global</span>
                <Switch 
                  checked={discount.isGlobal}
                  disabled
                />
              </div>
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
                  {new Date(discount.createdAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}