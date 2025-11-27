import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDiscountUsers(args?: Prisma.DiscountUserFindManyArgs) {
  return prisma.discountUser.findMany(args);
}

export function getDiscountUser(where: Prisma.DiscountUserWhereUniqueInput, args?: Omit<Prisma.DiscountUserFindUniqueArgs, 'where'>) {
  return prisma.discountUser.findUnique({ where, ...(args || {}) });
}

export function createDiscountUser(data: Prisma.DiscountUserCreateInput, args?: Omit<Prisma.DiscountUserCreateArgs, 'data'>) {
  return prisma.discountUser.create({ data, ...(args || {}) });
}

export function updateDiscountUser(where: Prisma.DiscountUserWhereUniqueInput, data: Prisma.DiscountUserUpdateInput, args?: Omit<Prisma.DiscountUserUpdateArgs, 'where' | 'data'>) {
  return prisma.discountUser.update({ where, data, ...(args || {}) });
}

export function deleteDiscountUser(where: Prisma.DiscountUserWhereUniqueInput, args?: Omit<Prisma.DiscountUserDeleteArgs, 'where'>) {
  return prisma.discountUser.delete({ where, ...(args || {}) });
}