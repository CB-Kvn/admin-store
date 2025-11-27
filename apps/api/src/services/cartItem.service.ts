import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listCartItems(args?: Prisma.CartItemFindManyArgs) {
  return prisma.cartItem.findMany(args);
}

export function getCartItem(where: Prisma.CartItemWhereUniqueInput, args?: Omit<Prisma.CartItemFindUniqueArgs, 'where'>) {
  return prisma.cartItem.findUnique({ where, ...(args || {}) });
}

export function createCartItem(data: Prisma.CartItemCreateInput, args?: Omit<Prisma.CartItemCreateArgs, 'data'>) {
  return prisma.cartItem.create({ data, ...(args || {}) });
}

export function updateCartItem(where: Prisma.CartItemWhereUniqueInput, data: Prisma.CartItemUpdateInput, args?: Omit<Prisma.CartItemUpdateArgs, 'where' | 'data'>) {
  return prisma.cartItem.update({ where, data, ...(args || {}) });
}

export function deleteCartItem(where: Prisma.CartItemWhereUniqueInput, args?: Omit<Prisma.CartItemDeleteArgs, 'where'>) {
  return prisma.cartItem.delete({ where, ...(args || {}) });
}