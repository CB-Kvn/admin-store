import { Request, Response } from 'express';
import {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../services/material.service';

export async function listMaterialsHandler(req: Request, res: Response) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const items = await listMaterials({ take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar materiales' });
  }
}

export async function getMaterialHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getMaterial({ id });
    if (!item) return res.status(404).json({ error: 'Material no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener material' });
  }
}

export async function createMaterialHandler(req: Request, res: Response) {
  try {
    const data = req.body || {};
    const created = await createMaterial(data);
    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un material con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al crear material' });
  }
}

export async function updateMaterialHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateMaterial({ id }, data);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Material no encontrado', meta: err?.meta });
    }
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un material con ese nombre', meta: err?.meta });
    }
    res.status(500).json({ error: 'Error al actualizar material' });
  }
}

export async function deleteMaterialHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteMaterial({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar material' });
  }
}