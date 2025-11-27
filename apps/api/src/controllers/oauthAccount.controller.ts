import { Request, Response } from 'express';
import {
  listOAuthAccounts,
  getOAuthAccount,
  createOAuthAccount,
  updateOAuthAccount,
  deleteOAuthAccount,
} from '../services/oauthAccount.service';

export async function listOAuthAccountsHandler(req: Request, res: Response) {
  try {
    const { limit, offset, userId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (userId) where.userId = String(userId);
    const items = await listOAuthAccounts({ take, skip, where: Object.keys(where).length ? where : undefined });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar cuentas OAuth' });
  }
}

export async function getOAuthAccountHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const item = await getOAuthAccount({ id });
    if (!item) return res.status(404).json({ error: 'Cuenta OAuth no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cuenta OAuth' });
  }
}

export async function createOAuthAccountHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const errors: string[] = [];
    if (!body.provider) errors.push('provider es requerido');
    if (!body.providerAccountId) errors.push('providerAccountId es requerido');
    if (!body.userId) errors.push('userId es requerido');
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const data: any = {
      provider: String(body.provider),
      providerAccountId: String(body.providerAccountId),
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      tokenType: body.tokenType,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      scope: body.scope,
      user: { connect: { id: String(body.userId) } },
    };

    let created;
    try {
      created = await createOAuthAccount(data);
    } catch (err: any) {
      if (err?.code === 'P2002' && Array.isArray(err?.meta?.target) && err.meta.target.includes('providerAccountId')) {
        return res.status(409).json({ error: 'providerAccountId ya existe' });
      }
      throw err;
    }
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cuenta OAuth' });
  }
}

export async function updateOAuthAccountHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const body = req.body || {};
    const data: any = {};
    if (body.provider !== undefined) data.provider = String(body.provider);
    if (body.providerAccountId !== undefined) data.providerAccountId = String(body.providerAccountId);
    if (body.accessToken !== undefined) data.accessToken = body.accessToken;
    if (body.refreshToken !== undefined) data.refreshToken = body.refreshToken;
    if (body.tokenType !== undefined) data.tokenType = body.tokenType;
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.scope !== undefined) data.scope = body.scope;
    if (body.userId !== undefined) data.user = { connect: { id: String(body.userId) } };

    let updated;
    try {
      updated = await updateOAuthAccount({ id }, data);
    } catch (err: any) {
      if (err?.code === 'P2025') {
        return res.status(404).json({ error: 'Cuenta OAuth no encontrada' });
      }
      if (err?.code === 'P2002' && Array.isArray(err?.meta?.target) && err.meta.target.includes('providerAccountId')) {
        return res.status(409).json({ error: 'providerAccountId ya existe' });
      }
      throw err;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cuenta OAuth' });
  }
}

export async function deleteOAuthAccountHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteOAuthAccount({ id });
    res.json(deleted);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Cuenta OAuth no encontrada' });
    res.status(500).json({ error: 'Error al eliminar cuenta OAuth' });
  }
}