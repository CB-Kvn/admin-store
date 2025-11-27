import { Request, Response } from 'express';
import {
  listStones,
  getStone,
  createStone,
  updateStone,
  deleteStone,
} from '../services/stone.service';

export async function listStonesHandler(req: Request, res: Response) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const items = await listStones({ take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar piedras' });
  }
}

export async function getStoneHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getStone({ id });
    if (!item) return res.status(404).json({ error: 'Piedra no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener piedra' });
  }
}

export async function createStoneHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    // No permitir establecer `id` manualmente al crear; solo campos válidos
    const data: any = {
      name: typeof body.name === 'string' ? body.name.trim() : '',
      slug: typeof body.slug === 'string' ? body.slug.trim() : undefined,
    };
    if (!data.name) return res.status(400).json({ error: 'El nombre es requerido' });

    const created = await createStone(data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2002') {
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(', ') : String(err?.meta?.target || 'campo único');
      return res.status(409).json({ error: `Conflicto: ya existe una piedra con el mismo ${target}` });
    }
    res.status(500).json({ error: 'Error al crear piedra' });
  }
}

export async function updateStoneHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateStone({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar piedra' });
  }
}

export async function deleteStoneHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteStone({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar piedra' });
  }
}