import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listCarts(args?: Prisma.CartFindManyArgs) {
  return prisma.cart.findMany(args);
}

export function getCart(where: Prisma.CartWhereUniqueInput, args?: Omit<Prisma.CartFindUniqueArgs, 'where'>) {
  return prisma.cart.findUnique({ where, ...(args || {}) });
}

export function createCart(data: Prisma.CartCreateInput, args?: Omit<Prisma.CartCreateArgs, 'data'>) {
  return prisma.cart.create({ data, ...(args || {}) });
}

export function updateCart(where: Prisma.CartWhereUniqueInput, data: Prisma.CartUpdateInput, args?: Omit<Prisma.CartUpdateArgs, 'where' | 'data'>) {
  return prisma.cart.update({ where, data, ...(args || {}) });
}

export function deleteCart(where: Prisma.CartWhereUniqueInput, args?: Omit<Prisma.CartDeleteArgs, 'where'>) {
  return prisma.cart.delete({ where, ...(args || {}) });
}