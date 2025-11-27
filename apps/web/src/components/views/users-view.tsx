import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import { mockUsers } from '../../lib/mock-data';
import type { User } from '../../lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface UsersViewProps {
  onUserClick?: (userId: string) => void;
  onAddUser?: () => void;
}

export function UsersView({ onUserClick, onAddUser }: UsersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'inactive' && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleVariant = (role: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      admin: 'error',
      manager: 'warning',
      staff: 'default',
      customer: 'success',
    };
    return variants[role] || 'default';
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (_value: any, user: User) => (
        <div>
          <div className="text-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground">
            {user.firstName} {user.lastName}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (_value: any, user: User) => (
        <StatusBadge status={user.role} variant={getRoleVariant(user.role)} />
      ),
    },
    {
      key: 'active',
      label: 'Activo',
      sortable: true,
      render: (_value: any, user: User) => (
        <StatusBadge
          status={user.active ? 'active' : 'inactive'}
          variant={user.active ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'lastLogin',
      label: 'Último Acceso',
      sortable: true,
      render: (_value: any, user: User) =>
        user.lastLogin
          ? new Date(user.lastLogin).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—',
    },
    {
      key: 'loginAttempts',
      label: 'Intentos de Acceso',
      sortable: true,
      render: (_value: any, user: User) => (
        <span className={user.loginAttempts >= 3 ? 'text-destructive' : ''}>
          {user.loginAttempts}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creado',
      sortable: true,
      render: (_value: any, user: User) =>
        new Date(user.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Administra cuentas de usuario y permisos"
        action={
          <Button onClick={onAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios por email o nombre..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        onRowClick={user => onUserClick?.(user.id)}
      />
    </div>
  );
}