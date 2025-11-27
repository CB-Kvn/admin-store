import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

export function listAuditLogs(args?: Prisma.AuditLogFindManyArgs) {
  return prisma.auditLog.findMany(args);
}

export function getAuditLog(where: Prisma.AuditLogWhereUniqueInput, args?: Omit<Prisma.AuditLogFindUniqueArgs, 'where'>) {
  return prisma.auditLog.findUnique({ where, ...(args || {}) });
}

export function createAuditLog(data: Prisma.AuditLogCreateInput, args?: Omit<Prisma.AuditLogCreateArgs, 'data'>) {
  return prisma.auditLog.create({ data, ...(args || {}) });
}

export function updateAuditLog(where: Prisma.AuditLogWhereUniqueInput, data: Prisma.AuditLogUpdateInput, args?: Omit<Prisma.AuditLogUpdateArgs, 'where' | 'data'>) {
  return prisma.auditLog.update({ where, data, ...(args || {}) });
}

export function deleteAuditLog(where: Prisma.AuditLogWhereUniqueInput, args?: Omit<Prisma.AuditLogDeleteArgs, 'where'>) {
  return prisma.auditLog.delete({ where, ...(args || {}) });
}