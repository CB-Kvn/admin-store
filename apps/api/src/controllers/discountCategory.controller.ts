import { Request, Response } from 'express';
import {
  listDiscountCategories,
  getDiscountCategory,
  createDiscountCategory,
  updateDiscountCategory,
  deleteDiscountCategory,
} from '../services/discountCategory.service';

export async function listDiscountCategoriesHandler(req: Request, res: Response) {
  try {
    const { limit, offset, discountId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (discountId) where.discountId = Number(discountId);
    const items = await listDiscountCategories({ where, take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar descuentos por categoría' });
  }
}

export async function getDiscountCategoryHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(discountId) || Number.isNaN(categoryId)) return res.status(400).json({ error: 'IDs inválidos' });
    const item = await getDiscountCategory({ discountId_categoryId: { discountId, categoryId } as any });
    if (!item) return res.status(404).json({ error: 'Asignación no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asignación de categoría' });
  }
}

export async function createDiscountCategoryHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    let data: any = body;
    if (body.discountId !== undefined && body.categoryId !== undefined) {
      data = {
        discount: { connect: { id: Number(body.discountId) } },
        category: { connect: { id: Number(body.categoryId) } },
      };
    }
    const created = await createDiscountCategory(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear asignación de categoría' });
  }
}

export async function updateDiscountCategoryHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(discountId) || Number.isNaN(categoryId)) return res.status(400).json({ error: 'IDs inválidos' });
    const data = req.body || {};
    const updated = await updateDiscountCategory({ discountId_categoryId: { discountId, categoryId } as any }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar asignación de categoría' });
  }
}

export async function deleteDiscountCategoryHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(discountId) || Number.isNaN(categoryId)) return res.status(400).json({ error: 'IDs inválidos' });
    const deleted = await deleteDiscountCategory({ discountId_categoryId: { discountId, categoryId } as any });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar asignación de categoría' });
  }
}