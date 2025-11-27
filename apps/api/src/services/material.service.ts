import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listMaterials(args?: Prisma.MaterialFindManyArgs) {
  return prisma.material.findMany(args);
}

export function getMaterial(where: Prisma.MaterialWhereUniqueInput, args?: Omit<Prisma.MaterialFindUniqueArgs, 'where'>) {
  return prisma.material.findUnique({ where, ...(args || {}) });
}

export function createMaterial(data: Prisma.MaterialCreateInput, args?: Omit<Prisma.MaterialCreateArgs, 'data'>) {
  return prisma.material.create({ data, ...(args || {}) });
}

export function updateMaterial(where: Prisma.MaterialWhereUniqueInput, data: Prisma.MaterialUpdateInput, args?: Omit<Prisma.MaterialUpdateArgs, 'where' | 'data'>) {
  return prisma.material.update({ where, data, ...(args || {}) });
}

export function deleteMaterial(where: Prisma.MaterialWhereUniqueInput, args?: Omit<Prisma.MaterialDeleteArgs, 'where'>) {
  return prisma.material.delete({ where, ...(args || {}) });
}