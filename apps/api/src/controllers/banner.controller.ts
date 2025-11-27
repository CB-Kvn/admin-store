import { Request, Response } from 'express';
import {
  listBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/banner.service';

export async function listBannersHandler(req: Request, res: Response) {
  try {
    const { limit, offset, status, q, orderBy, orderDir } = req.query as Record<string, string>;

    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;

    const where: any = {};
    if (status) where.status = String(status);
    if (q) where.name = { contains: String(q), mode: 'insensitive' };

    let order: any = undefined;
    if (orderBy && ['createdAt', 'updatedAt', 'dateInit', 'dateEnd', 'name', 'status'].includes(orderBy)) {
      const dir = orderDir === 'asc' ? 'asc' : orderDir === 'desc' ? 'desc' : 'desc';
      order = [{ [orderBy]: dir }];
      if (orderBy !== 'createdAt') order.push({ createdAt: 'desc' });
    } else {
      order = [{ createdAt: 'desc' }];
    }

    const items = await listBanners({ where: Object.keys(where).length ? where : undefined, take, skip, orderBy: order });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar banners' });
  }
}

export async function getBannerHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const item = await getBanner({ id });
    if (!item) return res.status(404).json({ error: 'Banner no encontrado' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener banner' });
  }
}

export async function createBannerHandler(req: Request, res: Response) {
  try {
    const { name, imageUrl, status, dateInit, dateEnd } = req.body || {};

    if (!name || !imageUrl || !status) {
      return res.status(400).json({ error: 'Campos requeridos: name, imageUrl, status' });
    }

    const data: any = {
      name: String(name),
      imageUrl: String(imageUrl),
      status: String(status),
    };

    if (dateInit) data.dateInit = new Date(dateInit);
    if (dateEnd) data.dateEnd = new Date(dateEnd);

    const created = await createBanner(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear banner' });
  }
}

export async function updateBannerHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });

    const { name, imageUrl, status, dateInit, dateEnd } = req.body || {};

    const data: any = {};
    if (name !== undefined) data.name = String(name);
    if (imageUrl !== undefined) data.imageUrl = String(imageUrl);
    if (status !== undefined) data.status = String(status);
    if (dateInit !== undefined) data.dateInit = dateInit ? new Date(dateInit) : null;
    if (dateEnd !== undefined) data.dateEnd = dateEnd ? new Date(dateEnd) : null;

    const updated = await updateBanner({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar banner' });
  }
}

export async function deleteBannerHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteBanner({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar banner' });
  }
}