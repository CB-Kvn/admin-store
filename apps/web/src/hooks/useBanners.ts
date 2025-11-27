import { useMemo } from 'react';
import type { ID, Banner, CreateBannerInput, UpdateBannerInput } from '../lib/api-types';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '../state/api';

export interface UseBannersOptions {
  skip?: boolean;
}

export function useBanners(options?: UseBannersOptions) {
  const { skip = false } = options || {};

  // Query para listar banners
  const {
    data: banners = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetBannersQuery(skip ? undefined : undefined, { skip });

  // Mutations
  const [createBannerMutation, { isLoading: isCreatingBanner, error: createBannerError }] = useCreateBannerMutation();
  const [updateBannerMutation, { isLoading: isUpdatingBanner, error: updateBannerError }] = useUpdateBannerMutation();
  const [deleteBannerMutation, { isLoading: isDeletingBanner, error: deleteBannerError }] = useDeleteBannerMutation();

  // CRUD actions (API)
  const createBanner = async (input: CreateBannerInput) => {
    const created = await createBannerMutation(input).unwrap();
    return created;
  };

  const updateBanner = async ({ id, changes }: { id: ID; changes: UpdateBannerInput }) => {
    const updated = await updateBannerMutation({ id, changes }).unwrap();
    return updated;
  };

  const deleteBanner = async (id: ID) => {
    const res = await deleteBannerMutation(id).unwrap();
    return res;
  };

  // Aggregated states
  const loadingAny = isLoading || isFetching || isCreatingBanner || isUpdatingBanner || isDeletingBanner;
  const fetchingAny = isFetching;
  const errorAny = (error as unknown) || createBannerError || updateBannerError || deleteBannerError;

  const refetchAll = () => {
    return refetch();
  };

  const result = useMemo(
    () => ({
      // data
      banners,

      // aggregated states
      loadingAny,
      fetchingAny,
      errorAny,

      // refetchers
      refetchBanners: refetchAll,
      refetchAll,

      // CRUD actions
      createBanner,
      updateBanner,
      deleteBanner,

      // mutation states
      isCreatingBanner,
      isUpdatingBanner,
      isDeletingBanner,

      createBannerError,
      updateBannerError,
      deleteBannerError,
    }),
    [
      banners,
      loadingAny,
      fetchingAny,
      errorAny,
      isCreatingBanner,
      isUpdatingBanner,
      isDeletingBanner,
      createBannerError,
      updateBannerError,
      deleteBannerError,
    ],
  );

  return result;
}