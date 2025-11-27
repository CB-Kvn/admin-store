import { Request, Response } from 'express';
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service';

export async function listCategoriesHandler(req: Request, res: Response) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const items = await listCategories({ take, skip });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar categorías' });
  }
}

export async function getCategoryHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const item = await getCategory({ id });
    if (!item) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
}

export async function createCategoryHandler(req: Request, res: Response) {
  try {
    const data = req.body || {};
    const created = await createCategory(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
}

export async function updateCategoryHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const data = req.body || {};
    const updated = await updateCategory({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteCategory({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
}