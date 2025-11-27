import { Prisma } from '../../generated/prisma';
import prisma from '../prisma';


export function listAddresses(args?: Prisma.AddressFindManyArgs) {
  return prisma.address.findMany(args);
}

export function getAddress(where: Prisma.AddressWhereUniqueInput, args?: Omit<Prisma.AddressFindUniqueArgs, 'where'>) {
  return prisma.address.findUnique({ where, ...(args || {}) });
}

export function createAddress(data: Prisma.AddressCreateInput, args?: Omit<Prisma.AddressCreateArgs, 'data'>) {
  return prisma.address.create({ data, ...(args || {}) });
}

export function updateAddress(where: Prisma.AddressWhereUniqueInput, data: Prisma.AddressUpdateInput, args?: Omit<Prisma.AddressUpdateArgs, 'where' | 'data'>) {
  return prisma.address.update({ where, data, ...(args || {}) });
}

export function deleteAddress(where: Prisma.AddressWhereUniqueInput, args?: Omit<Prisma.AddressDeleteArgs, 'where'>) {
  return prisma.address.delete({ where, ...(args || {}) });
}