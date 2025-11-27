import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listCatalogItems(args?: Prisma.CatalogItemFindManyArgs) {
  return prisma.catalogItem.findMany(args);
}

export function getCatalogItem(where: Prisma.CatalogItemWhereUniqueInput, args?: Omit<Prisma.CatalogItemFindUniqueArgs, 'where'>) {
  return prisma.catalogItem.findUnique({ where, ...(args || {}) });
}

export function createCatalogItem(data: Prisma.CatalogItemCreateInput, args?: Omit<Prisma.CatalogItemCreateArgs, 'data'>) {
  return prisma.catalogItem.create({ data, ...(args || {}) });
}

export function updateCatalogItem(where: Prisma.CatalogItemWhereUniqueInput, data: Prisma.CatalogItemUpdateInput, args?: Omit<Prisma.CatalogItemUpdateArgs, 'where' | 'data'>) {
  return prisma.catalogItem.update({ where, data, ...(args || {}) });
}

export function deleteCatalogItem(where: Prisma.CatalogItemWhereUniqueInput, args?: Omit<Prisma.CatalogItemDeleteArgs, 'where'>) {
  return prisma.catalogItem.delete({ where, ...(args || {}) });
}