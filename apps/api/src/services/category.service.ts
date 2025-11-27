import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listCategories(args?: Prisma.CategoryFindManyArgs) {
  return prisma.category.findMany(args);
}

export function getCategory(where: Prisma.CategoryWhereUniqueInput, args?: Omit<Prisma.CategoryFindUniqueArgs, 'where'>) {
  return prisma.category.findUnique({ where, ...(args || {}) });
}

export function createCategory(data: Prisma.CategoryCreateInput, args?: Omit<Prisma.CategoryCreateArgs, 'data'>) {
  return prisma.category.create({ data, ...(args || {}) });
}

export function updateCategory(where: Prisma.CategoryWhereUniqueInput, data: Prisma.CategoryUpdateInput, args?: Omit<Prisma.CategoryUpdateArgs, 'where' | 'data'>) {
  return prisma.category.update({ where, data, ...(args || {}) });
}

export function deleteCategory(where: Prisma.CategoryWhereUniqueInput, args?: Omit<Prisma.CategoryDeleteArgs, 'where'>) {
  return prisma.category.delete({ where, ...(args || {}) });
}