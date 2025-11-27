import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listWarehouses(args?: Prisma.WarehouseFindManyArgs) {
  return prisma.warehouse.findMany(args);
}

export function getWarehouse(where: Prisma.WarehouseWhereUniqueInput, args?: Omit<Prisma.WarehouseFindUniqueArgs, 'where'>) {
  return prisma.warehouse.findUnique({ where, ...(args || {}) });
}

export function createWarehouse(data: Prisma.WarehouseCreateInput, args?: Omit<Prisma.WarehouseCreateArgs, 'data'>) {
  return prisma.warehouse.create({ data, ...(args || {}) });
}

export function updateWarehouse(where: Prisma.WarehouseWhereUniqueInput, data: Prisma.WarehouseUpdateInput, args?: Omit<Prisma.WarehouseUpdateArgs, 'where' | 'data'>) {
  return prisma.warehouse.update({ where, data, ...(args || {}) });
}

export function deleteWarehouse(where: Prisma.WarehouseWhereUniqueInput, args?: Omit<Prisma.WarehouseDeleteArgs, 'where'>) {
  return prisma.warehouse.delete({ where, ...(args || {}) });
}