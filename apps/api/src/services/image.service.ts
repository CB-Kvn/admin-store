import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listImages(args?: Prisma.ImageFindManyArgs) {
  return prisma.image.findMany(args);
}

export function getImage(where: Prisma.ImageWhereUniqueInput, args?: Omit<Prisma.ImageFindUniqueArgs, 'where'>) {
  return prisma.image.findUnique({ where, ...(args || {}) });
}

export function createImage(data: Prisma.ImageCreateInput, args?: Omit<Prisma.ImageCreateArgs, 'data'>) {
  return prisma.image.create({ data, ...(args || {}) });
}

export function updateImage(where: Prisma.ImageWhereUniqueInput, data: Prisma.ImageUpdateInput, args?: Omit<Prisma.ImageUpdateArgs, 'where' | 'data'>) {
  return prisma.image.update({ where, data, ...(args || {}) });
}

export function deleteImage(where: Prisma.ImageWhereUniqueInput, args?: Omit<Prisma.ImageDeleteArgs, 'where'>) {
  return prisma.image.delete({ where, ...(args || {}) });
}