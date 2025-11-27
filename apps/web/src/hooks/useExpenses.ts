import { useMemo } from 'react';
import type { PaginationParams, Expense, ID } from '../lib/api-types';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '../state';

export interface UseExpensesOptions {
  expensesParams?: PaginationParams;
  skip?: boolean;
}

export function useExpenses(options?: UseExpensesOptions) {
  const { expensesParams, skip = false } = options || {};

  // Queries
  const expensesQuery = useGetExpensesQuery(expensesParams, { skip });

  // Mutations
  const [createExpenseMutate, createExpenseState] = useCreateExpenseMutation();
  const [updateExpenseMutate, updateExpenseState] = useUpdateExpenseMutation();
  const [deleteExpenseMutate, deleteExpenseState] = useDeleteExpenseMutation();

  const loadingAny = expensesQuery.isLoading;
  const fetchingAny = expensesQuery.isFetching;
  const errorAny = expensesQuery.error || undefined;

  const refetchAll = () => {
    void expensesQuery.refetch();
  };

  // CRUD actions
  const createExpense = async (input: Omit<Expense, 'id'>) => {
    const result = await createExpenseMutate(input).unwrap();
    refetchAll();
    console.log('[Gastos] Gasto creado:', result);
    return result;
  };

  const updateExpense = async ({ id, changes }: { id: ID; changes: Partial<Omit<Expense, 'id'>> }) => {
    const result = await updateExpenseMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Gastos] Gasto actualizado:', result);
    return result;
  };

  const deleteExpense = async (id: ID) => {
    const result = await deleteExpenseMutate(id).unwrap();
    refetchAll();
    console.log('[Gastos] Gasto eliminado:', id, result);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      expenses: expensesQuery.data ?? [],

      // individual states
      expensesLoading: expensesQuery.isLoading,
      expensesError: expensesQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchExpenses: expensesQuery.refetch,
      refetchAll,

      // CRUD actions
      createExpense,
      updateExpense,
      deleteExpense,

      // mutation states
      isCreatingExpense: createExpenseState.isLoading,
      isUpdatingExpense: updateExpenseState.isLoading,
      isDeletingExpense: deleteExpenseState.isLoading,

      createExpenseError: createExpenseState.error,
      updateExpenseError: updateExpenseState.error,
      deleteExpenseError: deleteExpenseState.error,
    }),
    [
      expensesQuery.data,
      expensesQuery.isLoading,
      expensesQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      expensesQuery.refetch,
      createExpenseState.isLoading,
      updateExpenseState.isLoading,
      deleteExpenseState.isLoading,
      createExpenseState.error,
      updateExpenseState.error,
      deleteExpenseState.error,
    ],
  );

  return result;
}