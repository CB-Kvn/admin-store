import { Request, Response } from 'express';
import {
  listDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../services/discount.service';

export async function listDiscountsHandler(req: Request, res: Response) {
  try {
    const { limit, offset, isActive } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    const items = await listDiscounts({ where, take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar descuentos' });
  }
}

export async function getDiscountHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getDiscount({ id });
    if (!item) return res.status(404).json({ error: 'Descuento no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener descuento' });
  }
}

export async function createDiscountHandler(req: Request, res: Response) {
  try {
    const data = req.body || {};
    const created = await createDiscount(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear descuento' });
  }
}

export async function updateDiscountHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateDiscount({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar descuento' });
  }
}

export async function deleteDiscountHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteDiscount({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar descuento' });
  }
}