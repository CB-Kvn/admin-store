import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listOrderItems(args?: Prisma.OrderItemFindManyArgs) {
  return prisma.orderItem.findMany(args);
}

export function getOrderItem(where: Prisma.OrderItemWhereUniqueInput, args?: Omit<Prisma.OrderItemFindUniqueArgs, 'where'>) {
  return prisma.orderItem.findUnique({ where, ...(args || {}) });
}

export function createOrderItem(data: Prisma.OrderItemCreateInput, args?: Omit<Prisma.OrderItemCreateArgs, 'data'>) {
  return prisma.orderItem.create({ data, ...(args || {}) });
}

export function updateOrderItem(where: Prisma.OrderItemWhereUniqueInput, data: Prisma.OrderItemUpdateInput, args?: Omit<Prisma.OrderItemUpdateArgs, 'where' | 'data'>) {
  return prisma.orderItem.update({ where, data, ...(args || {}) });
}

export function deleteOrderItem(where: Prisma.OrderItemWhereUniqueInput, args?: Omit<Prisma.OrderItemDeleteArgs, 'where'>) {
  return prisma.orderItem.delete({ where, ...(args || {}) });
}