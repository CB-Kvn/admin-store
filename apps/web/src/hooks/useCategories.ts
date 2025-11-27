import { useMemo } from 'react';
import type { PaginationParams, Category, ID } from '../lib/api-types';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../state';

export interface UseCategoriesOptions {
  categoriesParams?: PaginationParams;
  skip?: boolean;
}

export function useCategories(options?: UseCategoriesOptions) {
  const { categoriesParams, skip = false } = options || {};

  // Queries
  const categoriesQuery = useGetCategoriesQuery(categoriesParams, { skip });

  // Mutations
  const [createCategoryMutate, createCategoryState] = useCreateCategoryMutation();
  const [updateCategoryMutate, updateCategoryState] = useUpdateCategoryMutation();
  const [deleteCategoryMutate, deleteCategoryState] = useDeleteCategoryMutation();

  const loadingAny = categoriesQuery.isLoading;
  const fetchingAny = categoriesQuery.isFetching;
  const errorAny = categoriesQuery.error || undefined;

  const refetchAll = () => {
    void categoriesQuery.refetch();
  };

  // CRUD actions
  const createCategory = async (input: Omit<Category, 'id'>) => {
    const result = await createCategoryMutate(input).unwrap();
    refetchAll();
    console.log('[Categorías] Categoría creada:', result);
    return result;
  };

  const updateCategory = async ({ id, changes }: { id: ID; changes: Partial<Omit<Category, 'id'>> }) => {
    const result = await updateCategoryMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Categorías] Categoría actualizada:', result);
    return result;
  };

  const deleteCategory = async (id: ID) => {
    const result = await deleteCategoryMutate(id).unwrap();
    refetchAll();
    console.log('[Categorías] Categoría eliminada:', id, result);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      categories: categoriesQuery.data ?? [],

      // individual states
      categoriesLoading: categoriesQuery.isLoading,
      categoriesError: categoriesQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchCategories: categoriesQuery.refetch,
      refetchAll,

      // CRUD actions
      createCategory,
      updateCategory,
      deleteCategory,

      // mutation states
      isCreatingCategory: createCategoryState.isLoading,
      isUpdatingCategory: updateCategoryState.isLoading,
      isDeletingCategory: deleteCategoryState.isLoading,

      createCategoryError: createCategoryState.error,
      updateCategoryError: updateCategoryState.error,
      deleteCategoryError: deleteCategoryState.error,
    }),
    [
      categoriesQuery.data,
      categoriesQuery.isLoading,
      categoriesQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      categoriesQuery.refetch,
      createCategoryState.isLoading,
      updateCategoryState.isLoading,
      deleteCategoryState.isLoading,
      createCategoryState.error,
      updateCategoryState.error,
      deleteCategoryState.error,
    ],
  );

  return result;
}