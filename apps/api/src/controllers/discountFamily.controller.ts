import { Request, Response } from 'express';
import {
  listDiscountFamilies,
  getDiscountFamily,
  createDiscountFamily,
  updateDiscountFamily,
  deleteDiscountFamily,
} from '../services/discountFamily.service';

export async function listDiscountFamiliesHandler(req: Request, res: Response) {
  try {
    const { limit, offset, discountId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (discountId) where.discountId = Number(discountId);
    const items = await listDiscountFamilies({ where, take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar descuentos por familia' });
  }
}

export async function getDiscountFamilyHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const familyId = String(req.params.familyId);
    if (Number.isNaN(discountId) || !familyId) return res.status(400).json({ error: 'IDs inválidos' });
    const item = await getDiscountFamily({ discountId_familyId: { discountId, familyId } as any });
    if (!item) return res.status(404).json({ error: 'Asignación no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener asignación de familia' });
  }
}

export async function createDiscountFamilyHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    let data: any = body;
    if (body.discountId !== undefined && body.familyId !== undefined) {
      data = {
        discount: { connect: { id: Number(body.discountId) } },
        family: { connect: { familyId: String(body.familyId) } },
      };
    }
    const created = await createDiscountFamily(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear asignación de familia' });
  }
}

export async function updateDiscountFamilyHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const familyId = String(req.params.familyId);
    if (Number.isNaN(discountId) || !familyId) return res.status(400).json({ error: 'IDs inválidos' });
    const data = req.body || {};
    const updated = await updateDiscountFamily({ discountId_familyId: { discountId, familyId } as any }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar asignación de familia' });
  }
}

export async function deleteDiscountFamilyHandler(req: Request, res: Response) {
  try {
    const discountId = Number(req.params.discountId);
    const familyId = String(req.params.familyId);
    if (Number.isNaN(discountId) || !familyId) return res.status(400).json({ error: 'IDs inválidos' });
    const deleted = await deleteDiscountFamily({ discountId_familyId: { discountId, familyId } as any });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar asignación de familia' });
  }
}