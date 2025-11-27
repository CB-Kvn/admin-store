import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export function listBanners(args?: Prisma.BannerFindManyArgs) {
  return prisma.banner.findMany(args);
}

export function getBanner(where: Prisma.BannerWhereUniqueInput, args?: Omit<Prisma.BannerFindUniqueArgs, 'where'>) {
  return prisma.banner.findUnique({ where, ...(args || {}) });
}

export function createBanner(data: Prisma.BannerCreateInput, args?: Omit<Prisma.BannerCreateArgs, 'data'>) {
  return prisma.banner.create({ data, ...(args || {}) });
}

export function updateBanner(where: Prisma.BannerWhereUniqueInput, data: Prisma.BannerUpdateInput, args?: Omit<Prisma.BannerUpdateArgs, 'where' | 'data'>) {
  return prisma.banner.update({ where, data, ...(args || {}) });
}

export function deleteBanner(where: Prisma.BannerWhereUniqueInput, args?: Omit<Prisma.BannerDeleteArgs, 'where'>) {
  return prisma.banner.delete({ where, ...(args || {}) });
}