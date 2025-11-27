import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDiscountFamilies(args?: Prisma.DiscountFamilyFindManyArgs) {
  return prisma.discountFamily.findMany(args);
}

export function getDiscountFamily(where: Prisma.DiscountFamilyWhereUniqueInput, args?: Omit<Prisma.DiscountFamilyFindUniqueArgs, 'where'>) {
  return prisma.discountFamily.findUnique({ where, ...(args || {}) });
}

export function createDiscountFamily(data: Prisma.DiscountFamilyCreateInput, args?: Omit<Prisma.DiscountFamilyCreateArgs, 'data'>) {
  return prisma.discountFamily.create({ data, ...(args || {}) });
}

export function updateDiscountFamily(where: Prisma.DiscountFamilyWhereUniqueInput, data: Prisma.DiscountFamilyUpdateInput, args?: Omit<Prisma.DiscountFamilyUpdateArgs, 'where' | 'data'>) {
  return prisma.discountFamily.update({ where, data, ...(args || {}) });
}

export function deleteDiscountFamily(where: Prisma.DiscountFamilyWhereUniqueInput, args?: Omit<Prisma.DiscountFamilyDeleteArgs, 'where'>) {
  return prisma.discountFamily.delete({ where, ...(args || {}) });
}