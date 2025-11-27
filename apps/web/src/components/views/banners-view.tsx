import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Edit } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import type { Banner } from '../../lib/api-types';
import { useBanners } from '../../hooks/useBanners';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BannersViewProps {
  onAddBanner?: () => void;
  onEditBanner?: (id: string) => void;
}

export function BannersView({ onAddBanner, onEditBanner }: BannersViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { banners, loadingAny } = useBanners();

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      EXPIRED: 'default',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      EXPIRED: 'Expirado',
    };
    return labels[status] || status;
  };

  const columns = [
    {
      key: 'imageUrl',
      label: 'Vista Previa',
      render: (_value: any, banner: Banner) => (
        <ImageWithFallback
          src={banner.imageUrl}
          alt={banner.name}
          className="h-12 w-20 rounded object-cover"
        />
      ),
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (_value: any, banner: Banner) => (
        <div className="text-foreground">{banner.name}</div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (_value: any, banner: Banner) => (
        <StatusBadge
          status={getStatusLabel(banner.status)}
          variant={getStatusVariant(banner.status)}
        />
      ),
    },
    {
      key: 'dateInit',
      label: 'Período Activo',
      sortable: true,
      render: (_value: any, banner: Banner) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{banner.dateInit ? new Date(banner.dateInit).toLocaleDateString('es-ES') : '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{banner.dateEnd ? new Date(banner.dateEnd).toLocaleDateString('es-ES') : '-'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creado',
      sortable: true,
      render: (_value: any, banner: Banner) =>
        banner.createdAt
          ? new Date(banner.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: any, banner: Banner) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditBanner?.(banner.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Gestiona banners promocionales y campañas"
        action={
          <Button onClick={onAddBanner}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Banner
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar banners..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="ACTIVE">Activo</SelectItem>
            <SelectItem value="INACTIVE">Inactivo</SelectItem>
            <SelectItem value="EXPIRED">Expirado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredBanners} columns={columns} />
    </div>
  );
}