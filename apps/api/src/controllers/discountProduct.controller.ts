import { Request, Response } from 'express';
import {
  listDiscountProducts,
  getDiscountProduct,
  createDiscountProduct,
  updateDiscountProduct,
  deleteDiscountProduct,
} from '../services/discountProduct.service';

export async function listDiscountProductsHandler(req: Request, res: Response) {
  try {
    const { limit, offset, discountId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (discountId) where.discountId = Number(discountId);
    const items = await listDiscountProducts({ where, take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar descuentos por producto' });
  }
}

export async function getDiscountProductHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(discountId) || Number.isNaN(itemId)) return res.status(400).json({ error: 'IDs inválidos' });
    const item = await getDiscountProduct({ discountId_itemId: { discountId, itemId } as any });
    if (!item) return res.status(404).json({ error: 'Asignación no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asignación de producto' });
  }
}

export async function createDiscountProductHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    let data: any = body;
    if (body.discountId !== undefined && body.itemId !== undefined) {
      data = {
        discount: { connect: { id: Number(body.discountId) } },
        item: { connect: { id: Number(body.itemId) } },
      };
    }
    const created = await createDiscountProduct(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear asignación de producto' });
  }
}

export async function updateDiscountProductHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(discountId) || Number.isNaN(itemId)) return res.status(400).json({ error: 'IDs inválidos' });
    const data = req.body || {};
    const updated = await updateDiscountProduct({ discountId_itemId: { discountId, itemId } as any }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar asignación de producto' });
  }
}

export async function deleteDiscountProductHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(discountId) || Number.isNaN(itemId)) return res.status(400).json({ error: 'IDs inválidos' });
    const deleted = await deleteDiscountProduct({ discountId_itemId: { discountId, itemId } as any });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar asignación de producto' });
  }
}