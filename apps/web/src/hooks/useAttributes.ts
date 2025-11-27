import { useMemo } from 'react';
import type { PaginationParams, Material, Color, ClosureType, Size, Stone, ID } from '../lib/api-types';
import {
  useGetMaterialsQuery,
  useGetColorsQuery,
  useGetClosureTypesQuery,
  useGetSizesQuery,
  useGetStonesQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useUpdateColorMutation,
  useCreateColorMutation,
  useDeleteColorMutation,
  useDeleteClosureTypeMutation,
  useCreateClosureTypeMutation,
  useUpdateClosureTypeMutation,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
  useCreateStoneMutation,
  useUpdateStoneMutation,
  useDeleteStoneMutation,
} from '../state';

export interface UseAttributesOptions {
  materialsParams?: PaginationParams;
  colorsParams?: PaginationParams;
  closureTypesParams?: PaginationParams;
  sizesParams?: PaginationParams;
  stonesParams?: PaginationParams;
  skip?: boolean;
}

export function useAttributes(options?: UseAttributesOptions) {
  const {
    materialsParams,
    colorsParams,
    closureTypesParams,
    sizesParams,
    stonesParams,
    skip = false,
  } = options || {};

  const materialsQuery = useGetMaterialsQuery(materialsParams, { skip });
  const colorsQuery = useGetColorsQuery(colorsParams, { skip });
  const closureTypesQuery = useGetClosureTypesQuery(closureTypesParams, { skip });
  const sizesQuery = useGetSizesQuery(sizesParams, { skip });
  const stonesQuery = useGetStonesQuery(stonesParams, { skip });

  // Mutations
  const [createMaterialMutate, createMaterialState] = useCreateMaterialMutation();
  const [updateMaterialMutate, updateMaterialState] = useUpdateMaterialMutation();
  const [deleteMaterialMutate, deleteMaterialState] = useDeleteMaterialMutation();
  const [createColorMutate, createColorState] = useCreateColorMutation();
  const [updateColorMutate, updateColorState] = useUpdateColorMutation();
  const [deleteColorMutate, deleteColorState] = useDeleteColorMutation();
  const [createClosureTypeMutate, createClosureTypeState] = useCreateClosureTypeMutation();
  const [updateClosureTypeMutate, updateClosureTypeState] = useUpdateClosureTypeMutation();
  const [deleteClosureTypeMutate, deleteClosureTypeState] = useDeleteClosureTypeMutation();
  const [createSizeMutate, createSizeState] = useCreateSizeMutation();
  const [updateSizeMutate, updateSizeState] = useUpdateSizeMutation();
  const [deleteSizeMutate, deleteSizeState] = useDeleteSizeMutation();
  const [createStoneMutate, createStoneState] = useCreateStoneMutation();
  const [updateStoneMutate, updateStoneState] = useUpdateStoneMutation();
  const [deleteStoneMutate, deleteStoneState] = useDeleteStoneMutation();

  const loadingAny =
    materialsQuery.isLoading ||
    colorsQuery.isLoading ||
    closureTypesQuery.isLoading ||
    sizesQuery.isLoading ||
    stonesQuery.isLoading;
  const fetchingAny =
    materialsQuery.isFetching ||
    colorsQuery.isFetching ||
    closureTypesQuery.isFetching ||
    sizesQuery.isFetching ||
    stonesQuery.isFetching;
  const errorAny =
    materialsQuery.error ||
    colorsQuery.error ||
    closureTypesQuery.error ||
    sizesQuery.error ||
    stonesQuery.error ||
    undefined;

  const refetchAll = () => {
    void materialsQuery.refetch();
    void colorsQuery.refetch();
    void closureTypesQuery.refetch();
    void sizesQuery.refetch();
    void stonesQuery.refetch();
  };

  // CRUD actions
  const createMaterial = async (input: Omit<Material, 'id'>) => {
    const result = await createMaterialMutate(input).unwrap();
    // RTK invalidation triggers refetch; ensure immediate refresh
    refetchAll();
    console.log('[Atributos] Material creado:', result);
    return result;
  };

  const updateMaterial = async ({ id, changes }: { id: ID; changes: Partial<Omit<Material, 'id'>> }) => {
    const result = await updateMaterialMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Atributos] Material actualizado:', result);
    return result;
  };

  const deleteMaterial = async (id: ID) => {
    const result = await deleteMaterialMutate(id).unwrap();
    refetchAll();
    console.log('[Atributos] Material eliminado:', id, result);
    return result;
  };

  const updateColor = async ({ id, changes }: { id: ID; changes: Partial<Omit<Color, 'id'>> }) => {
    const result = await updateColorMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Atributos] Color actualizado:', result);
    return result;
  };

  const createColor = async (input: Omit<Color, 'id'>) => {
    const result = await createColorMutate(input).unwrap();
    refetchAll();
    console.log('[Atributos] Color creado:', result);
    return result;
  };

  const deleteColor = async (id: ID) => {
    const result = await deleteColorMutate(id).unwrap();
    refetchAll();
    console.log('[Atributos] Color eliminado:', id, result);
    return result;
  };

  const deleteClosureType = async (id: ID) => {
    const result = await deleteClosureTypeMutate(id).unwrap();
    refetchAll();
    console.log('[Atributos] Tipo de cierre eliminado:', id, result);
    return result;
  };

  const createClosureType = async (input: Omit<ClosureType, 'id'>) => {
    const result = await createClosureTypeMutate(input).unwrap();
    refetchAll();
    console.log('[Atributos] Tipo de cierre creado:', result);
    return result;
  };

  const updateClosureType = async ({ id, changes }: { id: ID; changes: Partial<Omit<ClosureType, 'id'>> }) => {
    const result = await updateClosureTypeMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Atributos] Tipo de cierre actualizado:', result);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      materials: materialsQuery.data ?? [],
      colors: colorsQuery.data ?? [],
      closureTypes: closureTypesQuery.data ?? [],
      sizes: sizesQuery.data ?? [],
      stones: stonesQuery.data ?? [],

      // individual states
      materialsLoading: materialsQuery.isLoading,
      colorsLoading: colorsQuery.isLoading,
      closureTypesLoading: closureTypesQuery.isLoading,
      sizesLoading: sizesQuery.isLoading,
      stonesLoading: stonesQuery.isLoading,

      materialsError: materialsQuery.error,
      colorsError: colorsQuery.error,
      closureTypesError: closureTypesQuery.error,
      sizesError: sizesQuery.error,
      stonesError: stonesQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchMaterials: materialsQuery.refetch,
      refetchColors: colorsQuery.refetch,
      refetchClosureTypes: closureTypesQuery.refetch,
      refetchSizes: sizesQuery.refetch,
      refetchStones: stonesQuery.refetch,
      refetchAll,

      // CRUD actions
      // Materials
      createMaterial,
      updateMaterial,
      deleteMaterial,
      // Colors
      createColor,
      updateColor,
      deleteColor,
      // Closure Types
      createClosureType,
      updateClosureType,
      deleteClosureType,
      // Sizes
      createSize: async (input: Omit<Size, 'id'>) => {
        const result = await createSizeMutate(input).unwrap();
        refetchAll();
        console.log('[Atributos] Tamaño creado:', result);
        return result;
      },
      updateSize: async ({ id, changes }: { id: ID; changes: Partial<Omit<Size, 'id'>> }) => {
        const result = await updateSizeMutate({ id, changes }).unwrap();
        refetchAll();
        console.log('[Atributos] Tamaño actualizado:', result);
        return result;
      },
      deleteSize: async (id: ID) => {
        const result = await deleteSizeMutate(id).unwrap();
        refetchAll();
        console.log('[Atributos] Tamaño eliminado:', id, result);
        return result;
      },
      // Stones
      createStone: async (input: Omit<Stone, 'id'>) => {
        const result = await createStoneMutate(input).unwrap();
        refetchAll();
        console.log('[Atributos] Piedra creada:', result);
        return result;
      },
      updateStone: async ({ id, changes }: { id: ID; changes: Partial<Omit<Stone, 'id'>> }) => {
        const result = await updateStoneMutate({ id, changes }).unwrap();
        refetchAll();
        console.log('[Atributos] Piedra actualizada:', result);
        return result;
      },
      deleteStone: async (id: ID) => {
        const result = await deleteStoneMutate(id).unwrap();
        refetchAll();
        console.log('[Atributos] Piedra eliminada:', id, result);
        return result;
      },

      // mutation states
      isCreatingMaterial: createMaterialState.isLoading,
      isUpdatingMaterial: updateMaterialState.isLoading,
      isDeletingMaterial: deleteMaterialState.isLoading,
      isCreatingColor: createColorState.isLoading,
      isUpdatingColor: updateColorState.isLoading,
      isDeletingColor: deleteColorState.isLoading,
      isCreatingClosureType: createClosureTypeState.isLoading,
      isUpdatingClosureType: updateClosureTypeState.isLoading,
      isDeletingClosureType: deleteClosureTypeState.isLoading,
      isCreatingSize: createSizeState.isLoading,
      isUpdatingSize: updateSizeState.isLoading,
      isDeletingSize: deleteSizeState.isLoading,
      isCreatingStone: createStoneState.isLoading,
      isUpdatingStone: updateStoneState.isLoading,
      isDeletingStone: deleteStoneState.isLoading,

      createMaterialError: createMaterialState.error,
      updateMaterialError: updateMaterialState.error,
      deleteMaterialError: deleteMaterialState.error,
      createColorError: createColorState.error,
      updateColorError: updateColorState.error,
      deleteColorError: deleteColorState.error,
      createClosureTypeError: createClosureTypeState.error,
      updateClosureTypeError: updateClosureTypeState.error,
      deleteClosureTypeError: deleteClosureTypeState.error,
      createSizeError: createSizeState.error,
      updateSizeError: updateSizeState.error,
      deleteSizeError: deleteSizeState.error,
      createStoneError: createStoneState.error,
      updateStoneError: updateStoneState.error,
      deleteStoneError: deleteStoneState.error,
    }),
    [
      materialsQuery.data,
      colorsQuery.data,
      closureTypesQuery.data,
      sizesQuery.data,
      stonesQuery.data,
      materialsQuery.isLoading,
      colorsQuery.isLoading,
      closureTypesQuery.isLoading,
      sizesQuery.isLoading,
      stonesQuery.isLoading,
      materialsQuery.error,
      colorsQuery.error,
      closureTypesQuery.error,
      sizesQuery.error,
      stonesQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      materialsQuery.refetch,
      colorsQuery.refetch,
      closureTypesQuery.refetch,
      sizesQuery.refetch,
      stonesQuery.refetch,
      createMaterialState.isLoading,
      updateMaterialState.isLoading,
      deleteMaterialState.isLoading,
      createColorState.isLoading,
      updateColorState.isLoading,
      deleteColorState.isLoading,
      createClosureTypeState.isLoading,
      updateClosureTypeState.isLoading,
      deleteClosureTypeState.isLoading,
      createSizeState.isLoading,
      updateSizeState.isLoading,
      deleteSizeState.isLoading,
      createStoneState.isLoading,
      updateStoneState.isLoading,
      deleteStoneState.isLoading,
      createMaterialState.error,
      updateMaterialState.error,
      deleteMaterialState.error,
      createColorState.error,
      updateColorState.error,
      deleteColorState.error,
      createClosureTypeState.error,
      updateClosureTypeState.error,
      deleteClosureTypeState.error,
      createSizeState.error,
      updateSizeState.error,
      deleteSizeState.error,
      createStoneState.error,
      updateStoneState.error,
      deleteStoneState.error,
    ],
  );

  return result;
}