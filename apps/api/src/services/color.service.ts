import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listColors(args?: Prisma.ColorFindManyArgs) {
  return prisma.color.findMany(args);
}

export function getColor(where: Prisma.ColorWhereUniqueInput, args?: Omit<Prisma.ColorFindUniqueArgs, 'where'>) {
  return prisma.color.findUnique({ where, ...(args || {}) });
}

export function createColor(data: Prisma.ColorCreateInput, args?: Omit<Prisma.ColorCreateArgs, 'data'>) {
  return prisma.color.create({ data, ...(args || {}) });
}

export function updateColor(where: Prisma.ColorWhereUniqueInput, data: Prisma.ColorUpdateInput, args?: Omit<Prisma.ColorUpdateArgs, 'where' | 'data'>) {
  return prisma.color.update({ where, data, ...(args || {}) });
}

export function deleteColor(where: Prisma.ColorWhereUniqueInput, args?: Omit<Prisma.ColorDeleteArgs, 'where'>) {
  return prisma.color.delete({ where, ...(args || {}) });
}