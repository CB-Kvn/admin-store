import { Request, Response } from 'express';
import {
  listColors,
  getColor,
  createColor,
  updateColor,
  deleteColor,
} from '../services/color.service';

export async function listColorsHandler(req: Request, res: Response) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const items = await listColors({ take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar colores' });
  }
}

export async function getColorHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getColor({ id });
    if (!item) return res.status(404).json({ error: 'Color no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener color' });
  }
}

export async function createColorHandler(req: Request, res: Response) {
  try {
    const data = req.body || {};
    const created = await createColor(data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un color con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al crear color' });
  }
}

export async function updateColorHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateColor({ id }, data);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Color no encontrado', meta: err?.meta });
    }
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un color con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al actualizar color' });
  }
}

export async function deleteColorHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteColor({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar color' });
  }
}