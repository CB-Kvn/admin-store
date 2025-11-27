import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listStockMovements(args?: Prisma.StockMovementFindManyArgs) {
  return prisma.stockMovement.findMany(args);
}

export function getStockMovement(where: Prisma.StockMovementWhereUniqueInput, args?: Omit<Prisma.StockMovementFindUniqueArgs, 'where'>) {
  return prisma.stockMovement.findUnique({ where, ...(args || {}) });
}

export function createStockMovement(data: Prisma.StockMovementCreateInput, args?: Omit<Prisma.StockMovementCreateArgs, 'data'>) {
  return prisma.stockMovement.create({ data, ...(args || {}) });
}

export function updateStockMovement(where: Prisma.StockMovementWhereUniqueInput, data: Prisma.StockMovementUpdateInput, args?: Omit<Prisma.StockMovementUpdateArgs, 'where' | 'data'>) {
  return prisma.stockMovement.update({ where, data, ...(args || {}) });
}

export function deleteStockMovement(where: Prisma.StockMovementWhereUniqueInput, args?: Omit<Prisma.StockMovementDeleteArgs, 'where'>) {
  return prisma.stockMovement.delete({ where, ...(args || {}) });
}