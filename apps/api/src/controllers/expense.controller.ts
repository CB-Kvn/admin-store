import { Request, Response } from 'express';
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/expense.service';

export async function listExpensesHandler(req: Request, res: Response) {
  try {
    const { limit, offset, userId, category, paymentMethod, state, minDate, maxDate, minAmount, maxAmount, q, orderBy, orderDir } = req.query as Record<string, string>;

    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;

    const where: any = {};
    if (userId) where.userId = String(userId);
    if (category) where.category = String(category);
    if (paymentMethod) where.paymentMethod = String(paymentMethod);
    if (state === 'true') where.state = true;
    if (state === 'false') where.state = false;
    if (minDate) where.date = { ...(where.date || {}), gte: new Date(minDate) };
    if (maxDate) where.date = { ...(where.date || {}), lte: new Date(maxDate) };
    if (minAmount !== undefined && !Number.isNaN(Number(minAmount))) where.amount = { ...(where.amount || {}), gte: Number(minAmount) };
    if (maxAmount !== undefined && !Number.isNaN(Number(maxAmount))) where.amount = { ...(where.amount || {}), lte: Number(maxAmount) };
    if (q) where.OR = [
      { description: { contains: String(q), mode: 'insensitive' } },
      { notes: { contains: String(q), mode: 'insensitive' } },
    ];

    let order: any = undefined;
    if (orderBy && ['date', 'amount', 'createdAt'].includes(orderBy)) {
      const dir = orderDir === 'asc' ? 'asc' : orderDir === 'desc' ? 'desc' : 'desc';
      order = [{ [orderBy]: dir }];
      if (orderBy !== 'createdAt') order.push({ createdAt: 'desc' });
    } else {
      order = [{ date: 'desc' }, { createdAt: 'desc' }];
    }

    const items = await listExpenses({ where: Object.keys(where).length ? where : undefined, take, skip, orderBy: order });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar gastos' });
  }
}

export async function getExpenseHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const item = await getExpense({ id });
    if (!item) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener gasto' });
  }
}

export async function createExpenseHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const errors: string[] = [];
    if (body.date === undefined) errors.push('date es requerido');
    if (body.description === undefined) errors.push('description es requerido');
    if (body.amount === undefined || Number.isNaN(Number(body.amount))) errors.push('amount es requerido y debe ser numérico');
    if (body.category === undefined) errors.push('category es requerido');
    if (body.paymentMethod === undefined) errors.push('paymentMethod es requerido');
    if (body.userId === undefined) errors.push('userId es requerido');
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const data: any = {
      date: new Date(body.date),
      description: String(body.description),
      amount: Number(body.amount),
      category: String(body.category),
      paymentMethod: String(body.paymentMethod),
      receipt: body.receipt,
      notes: body.notes,
      // Usamos el campo escalar userId según el esquema actual
      userId: String(body.userId),
      approvedBy: body.approvedBy,
      approvedAt: body.approvedAt ? new Date(body.approvedAt) : undefined,
      state: body.state === undefined ? true : !!body.state,
      subtotal: body.subtotal !== undefined ? Number(body.subtotal) : Number(body.amount),
      taxes: body.taxes !== undefined ? Number(body.taxes) : 0,
    };

    const created = await createExpense(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear gasto' });
  }
}

export async function updateExpenseHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const body = req.body || {};
    const data: any = {};
    if (body.date !== undefined) data.date = body.date ? new Date(body.date) : null;
    if (body.description !== undefined) data.description = String(body.description);
    if (body.amount !== undefined) {
      if (Number.isNaN(Number(body.amount))) return res.status(400).json({ error: 'amount debe ser numérico' });
      data.amount = Number(body.amount);
    }
    if (body.category !== undefined) data.category = String(body.category);
    if (body.paymentMethod !== undefined) data.paymentMethod = String(body.paymentMethod);
    if (body.receipt !== undefined) data.receipt = body.receipt;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.userId !== undefined) {
      // Actualizamos únicamente el campo escalar userId
      data.userId = String(body.userId);
    }
    if (body.approvedBy !== undefined) data.approvedBy = body.approvedBy;
    if (body.approvedAt !== undefined) data.approvedAt = body.approvedAt ? new Date(body.approvedAt) : null;
    if (body.state !== undefined) data.state = !!body.state;
    if (body.subtotal !== undefined) {
      if (Number.isNaN(Number(body.subtotal))) return res.status(400).json({ error: 'subtotal debe ser numérico' });
      data.subtotal = Number(body.subtotal);
    }
    if (body.taxes !== undefined) {
      if (Number.isNaN(Number(body.taxes))) return res.status(400).json({ error: 'taxes debe ser numérico' });
      data.taxes = Number(body.taxes);
    }

    let updated;
    try {
      updated = await updateExpense({ id }, data);
    } catch (err: any) {
      if (err?.code === 'P2025') return res.status(404).json({ error: 'Gasto no encontrado' });
      throw err;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar gasto' });
  }
}

export async function deleteExpenseHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteExpense({ id });
    res.json(deleted);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Gasto no encontrado' });
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
}