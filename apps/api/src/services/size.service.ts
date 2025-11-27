import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listSizes(args?: Prisma.SizeFindManyArgs) {
  return prisma.size.findMany(args);
}

export function getSize(where: Prisma.SizeWhereUniqueInput, args?: Omit<Prisma.SizeFindUniqueArgs, 'where'>) {
  return prisma.size.findUnique({ where, ...(args || {}) });
}

export function createSize(data: Prisma.SizeCreateInput, args?: Omit<Prisma.SizeCreateArgs, 'data'>) {
  return prisma.size.create({ data, ...(args || {}) });
}

export function updateSize(where: Prisma.SizeWhereUniqueInput, data: Prisma.SizeUpdateInput, args?: Omit<Prisma.SizeUpdateArgs, 'where' | 'data'>) {
  return prisma.size.update({ where, data, ...(args || {}) });
}

export function deleteSize(where: Prisma.SizeWhereUniqueInput, args?: Omit<Prisma.SizeDeleteArgs, 'where'>) {
  return prisma.size.delete({ where, ...(args || {}) });
}