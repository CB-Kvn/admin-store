import { useMemo } from 'react';
import type { PaginationParams, Warehouse, ID, CreateWarehouseInput, UpdateWarehouseInput } from '../lib/api-types';
import {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} from '../state';

export interface UseWarehousesOptions {
  warehousesParams?: PaginationParams;
  skip?: boolean;
}

export function useWarehouses(options?: UseWarehousesOptions) {
  const { warehousesParams, skip = false } = options || {};

  // Queries
  const warehousesQuery = useGetWarehousesQuery(warehousesParams, { skip });

  // Mutations
  const [createWarehouseMutate, createWarehouseState] = useCreateWarehouseMutation();
  const [updateWarehouseMutate, updateWarehouseState] = useUpdateWarehouseMutation();
  const [deleteWarehouseMutate, deleteWarehouseState] = useDeleteWarehouseMutation();

  const loadingAny = warehousesQuery.isLoading;
  const fetchingAny = warehousesQuery.isFetching;
  const errorAny = warehousesQuery.error || undefined;

  const refetchAll = () => {
    void warehousesQuery.refetch();
  };

  // CRUD actions
  const createWarehouse = async (input: CreateWarehouseInput) => {
    const result = await createWarehouseMutate(input).unwrap();
    refetchAll();
    console.log('[Almacenes] Almacén creado:', result);
    return result;
  };

  const updateWarehouse = async ({ id, changes }: { id: ID; changes: UpdateWarehouseInput }) => {
    const result = await updateWarehouseMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Almacenes] Almacén actualizado:', result);
    return result;
  };

  const deleteWarehouse = async (id: ID) => {
    const result = await deleteWarehouseMutate(id).unwrap();
    refetchAll();
    console.log('[Almacenes] Almacén eliminado:', id, result);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      warehouses: warehousesQuery.data ?? [],

      // individual states
      warehousesLoading: warehousesQuery.isLoading,
      warehousesError: warehousesQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchWarehouses: warehousesQuery.refetch,
      refetchAll,

      // CRUD actions
      createWarehouse,
      updateWarehouse,
      deleteWarehouse,

      // mutation states
      isCreatingWarehouse: createWarehouseState.isLoading,
      isUpdatingWarehouse: updateWarehouseState.isLoading,
      isDeletingWarehouse: deleteWarehouseState.isLoading,

      createWarehouseError: createWarehouseState.error,
      updateWarehouseError: updateWarehouseState.error,
      deleteWarehouseError: deleteWarehouseState.error,
    }),
    [
      warehousesQuery.data,
      warehousesQuery.isLoading,
      warehousesQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      warehousesQuery.refetch,
      createWarehouseState.isLoading,
      updateWarehouseState.isLoading,
      deleteWarehouseState.isLoading,
      createWarehouseState.error,
      updateWarehouseState.error,
      deleteWarehouseState.error,
    ],
  );

  return result;
}