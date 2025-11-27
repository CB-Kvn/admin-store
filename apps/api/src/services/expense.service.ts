import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export function listExpenses(args?: Prisma.ExpenseFindManyArgs) {
  return prisma.expense.findMany(args);
}

export function getExpense(where: Prisma.ExpenseWhereUniqueInput, args?: Omit<Prisma.ExpenseFindUniqueArgs, 'where'>) {
  return prisma.expense.findUnique({ where, ...(args || {}) });
}

export function createExpense(data: Prisma.ExpenseCreateInput, args?: Omit<Prisma.ExpenseCreateArgs, 'data'>) {
  return prisma.expense.create({ data, ...(args || {}) });
}

export function updateExpense(where: Prisma.ExpenseWhereUniqueInput, data: Prisma.ExpenseUpdateInput, args?: Omit<Prisma.ExpenseUpdateArgs, 'where' | 'data'>) {
  return prisma.expense.update({ where, data, ...(args || {}) });
}

export function deleteExpense(where: Prisma.ExpenseWhereUniqueInput, args?: Omit<Prisma.ExpenseDeleteArgs, 'where'>) {
  return prisma.expense.delete({ where, ...(args || {}) });
}