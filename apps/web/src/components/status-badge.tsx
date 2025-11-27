import { Badge } from "./ui/badge";
import { OrderStatus, ProductStatus, StockStatus } from "../lib/types";

interface StatusBadgeProps {
  status: OrderStatus | ProductStatus | StockStatus;
  type: 'order' | 'product' | 'stock';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === 'order') {
      switch (status as OrderStatus) {
        case 'delivered':
          return 'default';
        case 'shipped':
          return 'secondary';
        case 'processing':
          return 'secondary';
        case 'pending':
          return 'outline';
        case 'cancelled':
          return 'destructive';
        default:
          return 'outline';
      }
    }
    
    if (type === 'product') {
      switch (status as ProductStatus) {
        case 'active':
          return 'default';
        case 'draft':
          return 'secondary';
        case 'archived':
          return 'outline';
        default:
          return 'outline';
      }
    }
    
    if (type === 'stock') {
      switch (status as StockStatus) {
        case 'in_stock':
          return 'default';
        case 'low_stock':
          return 'secondary';
        case 'out_of_stock':
          return 'destructive';
        default:
          return 'outline';
      }
    }
    
    return 'outline';
  };

  const getStatusText = () => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Badge variant={getVariant()} className="capitalize">
      {getStatusText()}
    </Badge>
  );
}
