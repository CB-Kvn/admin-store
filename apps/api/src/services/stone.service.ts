import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listStones(args?: Prisma.StoneFindManyArgs) {
  return prisma.stone.findMany(args);
}

export function getStone(where: Prisma.StoneWhereUniqueInput, args?: Omit<Prisma.StoneFindUniqueArgs, 'where'>) {
  return prisma.stone.findUnique({ where, ...(args || {}) });
}

export function createStone(data: Prisma.StoneCreateInput, args?: Omit<Prisma.StoneCreateArgs, 'data'>) {
  return prisma.stone.create({ data, ...(args || {}) });
}

export function updateStone(where: Prisma.StoneWhereUniqueInput, data: Prisma.StoneUpdateInput, args?: Omit<Prisma.StoneUpdateArgs, 'where' | 'data'>) {
  return prisma.stone.update({ where, data, ...(args || {}) });
}

export function deleteStone(where: Prisma.StoneWhereUniqueInput, args?: Omit<Prisma.StoneDeleteArgs, 'where'>) {
  return prisma.stone.delete({ where, ...(args || {}) });
}