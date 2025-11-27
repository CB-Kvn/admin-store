import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listDocuments(args?: Prisma.DocumentFindManyArgs) {
  return prisma.document.findMany(args);
}

export function getDocument(where: Prisma.DocumentWhereUniqueInput, args?: Omit<Prisma.DocumentFindUniqueArgs, 'where'>) {
  return prisma.document.findUnique({ where, ...(args || {}) });
}

export function createDocument(data: Prisma.DocumentCreateInput, args?: Omit<Prisma.DocumentCreateArgs, 'data'>) {
  return prisma.document.create({ data, ...(args || {}) });
}

export function updateDocument(where: Prisma.DocumentWhereUniqueInput, data: Prisma.DocumentUpdateInput, args?: Omit<Prisma.DocumentUpdateArgs, 'where' | 'data'>) {
  return prisma.document.update({ where, data, ...(args || {}) });
}

export function deleteDocument(where: Prisma.DocumentWhereUniqueInput, args?: Omit<Prisma.DocumentDeleteArgs, 'where'>) {
  return prisma.document.delete({ where, ...(args || {}) });
}