import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDiscountProducts(args?: Prisma.DiscountProductFindManyArgs) {
  return prisma.discountProduct.findMany(args);
}

export function getDiscountProduct(where: Prisma.DiscountProductWhereUniqueInput, args?: Omit<Prisma.DiscountProductFindUniqueArgs, 'where'>) {
  return prisma.discountProduct.findUnique({ where, ...(args || {}) });
}

export function createDiscountProduct(data: Prisma.DiscountProductCreateInput, args?: Omit<Prisma.DiscountProductCreateArgs, 'data'>) {
  return prisma.discountProduct.create({ data, ...(args || {}) });
}

export function updateDiscountProduct(where: Prisma.DiscountProductWhereUniqueInput, data: Prisma.DiscountProductUpdateInput, args?: Omit<Prisma.DiscountProductUpdateArgs, 'where' | 'data'>) {
  return prisma.discountProduct.update({ where, data, ...(args || {}) });
}

export function deleteDiscountProduct(where: Prisma.DiscountProductWhereUniqueInput, args?: Omit<Prisma.DiscountProductDeleteArgs, 'where'>) {
  return prisma.discountProduct.delete({ where, ...(args || {}) });
}