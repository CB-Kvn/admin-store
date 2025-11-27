import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDiscountCategories(args?: Prisma.DiscountCategoryFindManyArgs) {
  return prisma.discountCategory.findMany(args);
}

export function getDiscountCategory(where: Prisma.DiscountCategoryWhereUniqueInput, args?: Omit<Prisma.DiscountCategoryFindUniqueArgs, 'where'>) {
  return prisma.discountCategory.findUnique({ where, ...(args || {}) });
}

export function createDiscountCategory(data: Prisma.DiscountCategoryCreateInput, args?: Omit<Prisma.DiscountCategoryCreateArgs, 'data'>) {
  return prisma.discountCategory.create({ data, ...(args || {}) });
}

export function updateDiscountCategory(where: Prisma.DiscountCategoryWhereUniqueInput, data: Prisma.DiscountCategoryUpdateInput, args?: Omit<Prisma.DiscountCategoryUpdateArgs, 'where' | 'data'>) {
  return prisma.discountCategory.update({ where, data, ...(args || {}) });
}

export function deleteDiscountCategory(where: Prisma.DiscountCategoryWhereUniqueInput, args?: Omit<Prisma.DiscountCategoryDeleteArgs, 'where'>) {
  return prisma.discountCategory.delete({ where, ...(args || {}) });
}