import { useMemo } from 'react';
import type { PaginationParams, StockMovement, ID } from '../lib/api-types';
import {
  useGetStockMovementsQuery,
  useCreateStockMovementMutation,
  useUpdateStockMovementMutation,
  useDeleteStockMovementMutation,
} from '../state';

export interface UseStockMovementsOptions {
  movementsParams?: PaginationParams;
  skip?: boolean;
}

export function useStockMovements(options?: UseStockMovementsOptions) {
  const { movementsParams, skip = false } = options || {};

  // Queries
  const stockMovementsQuery = useGetStockMovementsQuery(movementsParams, { skip });

  // Mutations
  const [createMovementMutate, createMovementState] = useCreateStockMovementMutation();
  const [updateMovementMutate, updateMovementState] = useUpdateStockMovementMutation();
  const [deleteMovementMutate, deleteMovementState] = useDeleteStockMovementMutation();

  const loadingAny = stockMovementsQuery.isLoading;
  const fetchingAny = stockMovementsQuery.isFetching;
  const errorAny = stockMovementsQuery.error || undefined;

  const refetchAll = () => {
    void stockMovementsQuery.refetch();
  };

  // CRUD actions
  const createStockMovement = async (input: Omit<StockMovement, 'id'>) => {
    const result = await createMovementMutate(input).unwrap();
    refetchAll();
    console.log('[Movimientos] Movimiento creado:', result);
    return result;
  };

  const updateStockMovement = async (
    id: ID,
    changes: Partial<Omit<StockMovement, 'id'>>,
  ) => {
    const result = await updateMovementMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Movimientos] Movimiento actualizado:', result);
    return result;
  };

  const deleteStockMovement = async (id: ID) => {
    const result = await deleteMovementMutate(id).unwrap();
    refetchAll();
    console.log('[Movimientos] Movimiento eliminado:', id);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      stockMovements: stockMovementsQuery.data ?? [],

      // individual states
      stockMovementsLoading: stockMovementsQuery.isLoading,
      stockMovementsError: stockMovementsQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchStockMovements: stockMovementsQuery.refetch,
      refetchAll,

      // CRUD actions
      createStockMovement,
      updateStockMovement,
      deleteStockMovement,

      // mutation states
      isCreatingStockMovement: createMovementState.isLoading,
      isUpdatingStockMovement: updateMovementState.isLoading,
      isDeletingStockMovement: deleteMovementState.isLoading,

      createStockMovementError: createMovementState.error,
      updateStockMovementError: updateMovementState.error,
      deleteStockMovementError: deleteMovementState.error,
    }),
    [
      stockMovementsQuery.data,
      stockMovementsQuery.isLoading,
      stockMovementsQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      stockMovementsQuery.refetch,
      createMovementState.isLoading,
      updateMovementState.isLoading,
      deleteMovementState.isLoading,
      createMovementState.error,
      updateMovementState.error,
      deleteMovementState.error,
    ],
  );

  return result;
}