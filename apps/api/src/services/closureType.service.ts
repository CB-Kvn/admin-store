import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listClosureTypes(args?: Prisma.ClosureTypeFindManyArgs) {
  return prisma.closureType.findMany(args);
}

export function getClosureType(where: Prisma.ClosureTypeWhereUniqueInput, args?: Omit<Prisma.ClosureTypeFindUniqueArgs, 'where'>) {
  return prisma.closureType.findUnique({ where, ...(args || {}) });
}

export function createClosureType(data: Prisma.ClosureTypeCreateInput, args?: Omit<Prisma.ClosureTypeCreateArgs, 'data'>) {
  return prisma.closureType.create({ data, ...(args || {}) });
}

export function updateClosureType(where: Prisma.ClosureTypeWhereUniqueInput, data: Prisma.ClosureTypeUpdateInput, args?: Omit<Prisma.ClosureTypeUpdateArgs, 'where' | 'data'>) {
  return prisma.closureType.update({ where, data, ...(args || {}) });
}

export function deleteClosureType(where: Prisma.ClosureTypeWhereUniqueInput, args?: Omit<Prisma.ClosureTypeDeleteArgs, 'where'>) {
  return prisma.closureType.delete({ where, ...(args || {}) });
}