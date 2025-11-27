import { useState } from 'react';
import { Plus, Search, Filter, Percent, DollarSign } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import { mockDiscounts } from '../../lib/mock-data';
import type { Discount } from '../../lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';

interface DiscountsViewProps {
  onDiscountClick?: (discountId: string) => void;
  onAddDiscount?: () => void;
}

export function DiscountsView({ onDiscountClick, onAddDiscount }: DiscountsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDiscounts = mockDiscounts.filter(discount => {
    const matchesSearch =
      discount.code?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || discount.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && discount.isActive) ||
      (statusFilter === 'inactive' && !discount.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

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

  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (_value: any, discount: Discount) => (
        <div>
          <div className="text-foreground">{discount.code || 'Auto-applied'}</div>
          {discount.isGlobal && (
            <Badge variant="outline" className="mt-1">
              Global
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (_value: any, discount: Discount) => {
        const Icon = getTypeIcon(discount.type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <StatusBadge
              status={discount.type.replace('_', ' ')}
              variant={getTypeVariant(discount.type)}
            />
          </div>
        );
      },
    },
    {
      key: 'value',
      label: 'Value',
      sortable: true,
      render: (_value: any, discount: Discount) => (
        <span>
          {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
        </span>
      ),
    },
    {
      key: 'timesUsed',
      label: 'Usage',
      sortable: true,
      render: (_value: any, discount: Discount) => (
        <div className="text-sm">
          <div>
            {discount.timesUsed.toLocaleString()}
            {discount.usageLimit && ` / ${discount.usageLimit.toLocaleString()}`}
          </div>
          {discount.usageLimit && (
            <div className="text-xs text-muted-foreground">
              {((discount.timesUsed / discount.usageLimit) * 100).toFixed(1)}% used
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Active Period',
      sortable: true,
      render: (_value: any, discount: Discount) => (
        <div className="text-sm">
          <div>{new Date(discount.startDate).toLocaleDateString('es-ES')}</div>
          <div className="text-xs text-muted-foreground">
            to {new Date(discount.endDate).toLocaleDateString('es-ES')}
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (_value: any, discount: Discount) => (
        <StatusBadge
          status={discount.isActive ? 'active' : 'inactive'}
          variant={discount.isActive ? 'success' : 'default'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        description="Manage promotional codes and discounts"
        action={
          <Button onClick={onAddDiscount}>
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredDiscounts}
        columns={columns}
        onRowClick={discount => onDiscountClick?.(discount.id)}
      />
    </div>
  );
}
