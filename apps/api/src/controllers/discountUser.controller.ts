import { Request, Response } from 'express';
import {
  listDiscountUsers,
  getDiscountUser,
  createDiscountUser,
  updateDiscountUser,
  deleteDiscountUser,
} from '../services/discountUser.service';

export async function listDiscountUsersHandler(req: Request, res: Response) {
  try {
    const { limit, offset, discountId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (discountId) where.discountId = Number(discountId);
    const items = await listDiscountUsers({ where, take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar descuentos por usuario' });
  }
}

export async function getDiscountUserHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const userId = String(req.params.userId);
    if (Number.isNaN(discountId) || !userId) return res.status(400).json({ error: 'IDs inválidos' });
    const item = await getDiscountUser({ discountId_userId: { discountId, userId } as any });
    if (!item) return res.status(404).json({ error: 'Asignación no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asignación de usuario' });
  }
}

export async function createDiscountUserHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    let data: any = body;
    if (body.discountId !== undefined && body.userId !== undefined) {
      data = {
        discount: { connect: { id: Number(body.discountId) } },
        user: { connect: { id: String(body.userId) } },
        usageLimit: body.usageLimit,
      };
    }
    const created = await createDiscountUser(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear asignación de usuario' });
  }
}

export async function updateDiscountUserHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const userId = String(req.params.userId);
    if (Number.isNaN(discountId) || !userId) return res.status(400).json({ error: 'IDs inválidos' });
    const data = req.body || {};
    const updated = await updateDiscountUser({ discountId_userId: { discountId, userId } as any }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar asignación de usuario' });
  }
}

export async function deleteDiscountUserHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const userId = String(req.params.userId);
    if (Number.isNaN(discountId) || !userId) return res.status(400).json({ error: 'IDs inválidos' });
    const deleted = await deleteDiscountUser({ discountId_userId: { discountId, userId } as any });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar asignación de usuario' });
  }
}