import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listOAuthAccounts(args?: Prisma.OAuthAccountFindManyArgs) {
  return prisma.oAuthAccount.findMany(args);
}

export function getOAuthAccount(where: Prisma.OAuthAccountWhereUniqueInput, args?: Omit<Prisma.OAuthAccountFindUniqueArgs, 'where'>) {
  return prisma.oAuthAccount.findUnique({ where, ...(args || {}) });
}

export function createOAuthAccount(data: Prisma.OAuthAccountCreateInput, args?: Omit<Prisma.OAuthAccountCreateArgs, 'data'>) {
  return prisma.oAuthAccount.create({ data, ...(args || {}) });
}

export function updateOAuthAccount(where: Prisma.OAuthAccountWhereUniqueInput, data: Prisma.OAuthAccountUpdateInput, args?: Omit<Prisma.OAuthAccountUpdateArgs, 'where' | 'data'>) {
  return prisma.oAuthAccount.update({ where, data, ...(args || {}) });
}

export function deleteOAuthAccount(where: Prisma.OAuthAccountWhereUniqueInput, args?: Omit<Prisma.OAuthAccountDeleteArgs, 'where'>) {
  return prisma.oAuthAccount.delete({ where, ...(args || {}) });
}