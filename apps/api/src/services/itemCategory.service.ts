import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listItemCategories(args?: Prisma.ItemCategoryFindManyArgs) {
  return prisma.itemCategory.findMany(args);
}

export function getItemCategory(where: Prisma.ItemCategoryWhereUniqueInput, args?: Omit<Prisma.ItemCategoryFindUniqueArgs, 'where'>) {
  return prisma.itemCategory.findUnique({ where, ...(args || {}) });
}

export function createItemCategory(data: Prisma.ItemCategoryCreateInput, args?: Omit<Prisma.ItemCategoryCreateArgs, 'data'>) {
  return prisma.itemCategory.create({ data, ...(args || {}) });
}

export function updateItemCategory(where: Prisma.ItemCategoryWhereUniqueInput, data: Prisma.ItemCategoryUpdateInput, args?: Omit<Prisma.ItemCategoryUpdateArgs, 'where' | 'data'>) {
  return prisma.itemCategory.update({ where, data, ...(args || {}) });
}

export function deleteItemCategory(where: Prisma.ItemCategoryWhereUniqueInput, args?: Omit<Prisma.ItemCategoryDeleteArgs, 'where'>) {
  return prisma.itemCategory.delete({ where, ...(args || {}) });
}