import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDiscounts(args?: Prisma.DiscountFindManyArgs) {
  return prisma.discount.findMany(args);
}

export function getDiscount(where: Prisma.DiscountWhereUniqueInput, args?: Omit<Prisma.DiscountFindUniqueArgs, 'where'>) {
  return prisma.discount.findUnique({ where, ...(args || {}) });
}

export function createDiscount(data: Prisma.DiscountCreateInput, args?: Omit<Prisma.DiscountCreateArgs, 'data'>) {
  return prisma.discount.create({ data, ...(args || {}) });
}

export function updateDiscount(where: Prisma.DiscountWhereUniqueInput, data: Prisma.DiscountUpdateInput, args?: Omit<Prisma.DiscountUpdateArgs, 'where' | 'data'>) {
  return prisma.discount.update({ where, data, ...(args || {}) });
}

export function deleteDiscount(where: Prisma.DiscountWhereUniqueInput, args?: Omit<Prisma.DiscountDeleteArgs, 'where'>) {
  return prisma.discount.delete({ where, ...(args || {}) });
}