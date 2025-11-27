import { Request, Response } from 'express';
import {
  listClosureTypes,
  getClosureType,
  createClosureType,
  updateClosureType,
  deleteClosureType,
} from '../services/closureType.service';

export async function listClosureTypesHandler(req: Request, res: Response) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const items = await listClosureTypes({ take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar tipos de cierre' });
  }
}

export async function getClosureTypeHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getClosureType({ id });
    if (!item) return res.status(404).json({ error: 'Tipo de cierre no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tipo de cierre' });
  }
}

export async function createClosureTypeHandler(req: Request, res: Response) {
  try {
    const data = req.body || {};
    const created = await createClosureType(data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un tipo de cierre con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al crear tipo de cierre' });
  }
}

export async function updateClosureTypeHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateClosureType({ id }, data);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Tipo de cierre no encontrado', meta: err?.meta });
    }
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un tipo de cierre con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al actualizar tipo de cierre' });
  }
}

export async function deleteClosureTypeHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteClosureType({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tipo de cierre' });
  }
}