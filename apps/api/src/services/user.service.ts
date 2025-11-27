import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listUsers(args?: Prisma.UserFindManyArgs) {
  return prisma.user.findMany(args);
}

export function getUser(where: Prisma.UserWhereUniqueInput, args?: Omit<Prisma.UserFindUniqueArgs, 'where'>) {
  return prisma.user.findUnique({ where, ...(args || {}) });
}

export function createUser(data: Prisma.UserCreateInput, args?: Omit<Prisma.UserCreateArgs, 'data'>) {
  return prisma.user.create({ data, ...(args || {}) });
}

export function updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput, args?: Omit<Prisma.UserUpdateArgs, 'where' | 'data'>) {
  return prisma.user.update({ where, data, ...(args || {}) });
}

export function deleteUser(where: Prisma.UserWhereUniqueInput, args?: Omit<Prisma.UserDeleteArgs, 'where'>) {
  return prisma.user.delete({ where, ...(args || {}) });
}