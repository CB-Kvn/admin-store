import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listPurchaseOrders(args?: Prisma.PurchaseOrderFindManyArgs) {
  return prisma.purchaseOrder.findMany(args);
}

export function getPurchaseOrder(where: Prisma.PurchaseOrderWhereUniqueInput, args?: Omit<Prisma.PurchaseOrderFindUniqueArgs, 'where'>) {
  return prisma.purchaseOrder.findUnique({ where, ...(args || {}) });
}

export function createPurchaseOrder(data: Prisma.PurchaseOrderCreateInput, args?: Omit<Prisma.PurchaseOrderCreateArgs, 'data'>) {
  return prisma.purchaseOrder.create({ data, ...(args || {}) });
}

export function updatePurchaseOrder(where: Prisma.PurchaseOrderWhereUniqueInput, data: Prisma.PurchaseOrderUpdateInput, args?: Omit<Prisma.PurchaseOrderUpdateArgs, 'where' | 'data'>) {
  return prisma.purchaseOrder.update({ where, data, ...(args || {}) });
}

export function deletePurchaseOrder(where: Prisma.PurchaseOrderWhereUniqueInput, args?: Omit<Prisma.PurchaseOrderDeleteArgs, 'where'>) {
  return prisma.purchaseOrder.delete({ where, ...(args || {}) });
}