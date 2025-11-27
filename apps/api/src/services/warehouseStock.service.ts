import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listWarehouseStocks(args?: Prisma.WarehouseStockFindManyArgs) {
  return prisma.warehouseStock.findMany(args);
}

export function getWarehouseStock(where: Prisma.WarehouseStockWhereUniqueInput, args?: Omit<Prisma.WarehouseStockFindUniqueArgs, 'where'>) {
  return prisma.warehouseStock.findUnique({ where, ...(args || {}) });
}

export function createWarehouseStock(data: Prisma.WarehouseStockCreateInput, args?: Omit<Prisma.WarehouseStockCreateArgs, 'data'>) {
  return prisma.warehouseStock.create({ data, ...(args || {}) });
}

export function updateWarehouseStock(where: Prisma.WarehouseStockWhereUniqueInput, data: Prisma.WarehouseStockUpdateInput, args?: Omit<Prisma.WarehouseStockUpdateArgs, 'where' | 'data'>) {
  return prisma.warehouseStock.update({ where, data, ...(args || {}) });
}

export function deleteWarehouseStock(where: Prisma.WarehouseStockWhereUniqueInput, args?: Omit<Prisma.WarehouseStockDeleteArgs, 'where'>) {
  return prisma.warehouseStock.delete({ where, ...(args || {}) });
}