import { useState } from 'react';
import { Plus, Search, Filter, DollarSign, Check, X, Clock, Edit } from 'lucide-react';
import { PageHeader } from '../page-header';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTable } from '../data-table';
import { StatusBadge } from '../status-badge';
import type { Expense } from '../../lib/api-types';
import { useExpenses } from '../../hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ExpensesViewProps {
  onAddExpense?: () => void;
  onEditExpense?: (id: string) => void;
}

export function ExpensesView({ onAddExpense, onEditExpense }: ExpensesViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { expenses, expensesLoading } = useExpenses({ expensesParams: { limit: 100, offset: 0 } });

  const filteredExpenses = (expenses ?? []).filter(expense => {
    const matchesSearch =
      (expense.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryVariant = (category: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      MATERIALS: 'default',
      TOOLS: 'default',
      MARKETING: 'warning',
      SERVICES: 'default',
      SALARIES: 'error',
      RENT: 'error',
      OTHER: 'default',
    };
    return variants[category] || 'default';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      MATERIALS: 'Materiales',
      TOOLS: 'Herramientas',
      MARKETING: 'Marketing',
      SERVICES: 'Servicios',
      SALARIES: 'Salarios',
      RENT: 'Alquiler',
      OTHER: 'Otro',
    };
    return labels[category] || category;
  };

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.amount ?? 0),
    0
  );
  const totalCount = filteredExpenses.length;

  const columns = [
    {
      key: 'date',
      label: 'Fecha',
      sortable: true,
      render: (_value: any, expense: Expense) =>
        new Date(expense.date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      key: 'description',
      label: 'Descripción',
      sortable: true,
      render: (_value: any, expense: Expense) => (
        <div className="text-foreground">{expense.description}</div>
      ),
    },
    {
      key: 'category',
      label: 'Categoría',
      sortable: true,
      render: (_value: any, expense: Expense) => (
        <StatusBadge
          status={getCategoryLabel(String(expense.category ?? 'other'))}
          variant={getCategoryVariant(String(expense.category ?? 'other'))}
        />
      ),
    },
    {
      key: 'amount',
      label: 'Monto',
      sortable: true,
      render: (_value: any, expense: Expense) => (
        <div>
          <div className="text-foreground">${(expense.amount ?? 0).toFixed(2)}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: any, expense: Expense) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditExpense?.(String(expense.id))}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gastos"
        description="Rastrea y aprueba gastos del negocio"
        action={{ label: 'Agregar Gasto', onClick: onAddExpense }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Total de Gastos</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Registros</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl">{totalCount}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar gastos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Categorías</SelectItem>
              <SelectItem value="MATERIALS">Materiales</SelectItem>
              <SelectItem value="TOOLS">Herramientas</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="SERVICES">Servicios</SelectItem>
              <SelectItem value="SALARIES">Salarios</SelectItem>
              <SelectItem value="RENT">Alquiler</SelectItem>
              <SelectItem value="OTHER">Otro</SelectItem>
            </SelectContent>
         </Select>
        </div>
      </div>

      <DataTable
        data={filteredExpenses}
        columns={columns}
        loading={expensesLoading}
        onRowClick={(expense: Expense) => onEditExpense?.(String(expense.id))}
      />
    </div>
  );
}