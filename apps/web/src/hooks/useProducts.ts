import { useMemo } from 'react';
import type { ProductsListParams, Product, ID, CreateProductInput, UpdateProductInput } from '../lib/api-types';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../state';

export interface UseProductsOptions {
  productsParams?: ProductsListParams;
  skip?: boolean;
}

export function useProducts(options?: UseProductsOptions) {
  const { productsParams, skip = false } = options || {};

  // Queries
  const productsQuery = useGetProductsQuery(productsParams, { skip });

  // Mutations
  const [createProductMutate, createProductState] = useCreateProductMutation();
  const [updateProductMutate, updateProductState] = useUpdateProductMutation();
  const [deleteProductMutate, deleteProductState] = useDeleteProductMutation();

  const loadingAny = productsQuery.isLoading;
  const fetchingAny = productsQuery.isFetching;
  const errorAny = productsQuery.error || undefined;

  const refetchAll = () => {
    void productsQuery.refetch();
  };

  // CRUD actions
  const createProduct = async (input: CreateProductInput) => {
    const result = await createProductMutate(input).unwrap();
    refetchAll();
    console.log('[Productos] Producto creado:', result);
    return result;
  };

  const updateProduct = async ({ id, changes }: { id: ID; changes: UpdateProductInput }) => {
    const result = await updateProductMutate({ id, changes }).unwrap();
    refetchAll();
    console.log('[Productos] Producto actualizado:', result);
    return result;
  };

  const deleteProduct = async (id: ID) => {
    const result = await deleteProductMutate(id).unwrap();
    refetchAll();
    console.log('[Productos] Producto eliminado:', id, result);
    return result;
  };

  const result = useMemo(
    () => ({
      // data
      products: productsQuery.data ?? [],

      // individual states
      productsLoading: productsQuery.isLoading,
      productsError: productsQuery.error,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchProducts: productsQuery.refetch,
      refetchAll,

      // CRUD actions
      createProduct,
      updateProduct,
      deleteProduct,

      // mutation states
      isCreatingProduct: createProductState.isLoading,
      isUpdatingProduct: updateProductState.isLoading,
      isDeletingProduct: deleteProductState.isLoading,

      createProductError: createProductState.error,
      updateProductError: updateProductState.error,
      deleteProductError: deleteProductState.error,
    }),
    [
      productsQuery.data,
      productsQuery.isLoading,
      productsQuery.error,
      loadingAny,
      fetchingAny,
      errorAny,
      productsQuery.refetch,
      createProductState.isLoading,
      updateProductState.isLoading,
      deleteProductState.isLoading,
      createProductState.error,
      updateProductState.error,
      deleteProductState.error,
    ],
  );

  return result;
}