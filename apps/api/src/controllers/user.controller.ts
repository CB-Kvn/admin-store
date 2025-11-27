import { Request, Response } from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service';
import {
  createOAuthAccount,
  updateOAuthAccount,
  getOAuthAccount,
} from '../services/oauthAccount.service';

export async function listUsersHandler(req: Request, res: Response) {
  try {
    const { limit, offset, active } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (active === 'true') where.active = true;
    if (active === 'false') where.active = false;
    const items = await listUsers({ take, skip, where: Object.keys(where).length ? where : undefined });
    res.json(items);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const item = await getUser({ id });
    if (!item) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(item);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

export async function createUserHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data: any = {};
    // Requeridos
    if (!body.email) return res.status(400).json({ error: 'email es requerido' });
    if (!body.password) return res.status(400).json({ error: 'password es requerido' });
    data.email = String(body.email);
    data.password = String(body.password);
    // Opcionales
    if (body.role !== undefined) data.role = body.role;
    if (body.active !== undefined) data.active = !!body.active;
    if (body.passwordChangedAt !== undefined) data.passwordChangedAt = body.passwordChangedAt ? new Date(body.passwordChangedAt) : null;
    if (body.loginAttempts !== undefined) data.loginAttempts = Number(body.loginAttempts);
    if (body.lockedUntil !== undefined) data.lockedUntil = body.lockedUntil ? new Date(body.lockedUntil) : null;
    if (body.lastLogin !== undefined) data.lastLogin = body.lastLogin ? new Date(body.lastLogin) : null;
    if (body.refreshToken !== undefined) data.refreshToken = body.refreshToken;

    let created;
    try {
      created = await createUser(data);
    } catch (err: any) {
      if (err?.code === 'P2002' && Array.isArray(err?.meta?.target) && err.meta.target.includes('email')) {
        return res.status(409).json({ error: 'Email ya registrado' });
      }
      throw err;
    }

    // Cuentas OAuth opcionales
    const oauth = body.oauthAccounts ?? body.oauthAccount;
    const oauthList: any[] = Array.isArray(oauth) ? oauth : oauth ? [oauth] : [];
    for (const acc of oauthList) {
      if (!acc) continue;
      const payload: any = {
        provider: String(acc.provider || ''),
        providerAccountId: String(acc.providerAccountId || ''),
        accessToken: acc.accessToken,
        refreshToken: acc.refreshToken,
        tokenType: acc.tokenType,
        expiresAt: acc.expiresAt ? new Date(acc.expiresAt) : undefined,
        scope: acc.scope,
        user: { connect: { id: created.id } },
      };
      if (!payload.provider || !payload.providerAccountId) continue; // ignora entradas incompletas
      try {
        await createOAuthAccount(payload);
      } catch (err: any) {
        // Si ya existe por providerAccountId, intentamos actualizar
        if (err?.code === 'P2002') {
          const existing = await getOAuthAccount({ providerAccountId: payload.providerAccountId });
          if (existing) {
            await updateOAuthAccount({ providerAccountId: existing.providerAccountId }, {
              provider: payload.provider,
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
              tokenType: payload.tokenType,
              expiresAt: payload.expiresAt,
              scope: payload.scope,
              user: { connect: { id: created.id } },
            });
          }
        }
      }
    }

    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const body = req.body || {};
    const data: any = {};
    if (body.email !== undefined) data.email = String(body.email);
    if (body.password !== undefined) data.password = String(body.password);
    if (body.role !== undefined) data.role = body.role;
    if (body.active !== undefined) data.active = !!body.active;
    if (body.passwordChangedAt !== undefined) data.passwordChangedAt = body.passwordChangedAt ? new Date(body.passwordChangedAt) : null;
    if (body.loginAttempts !== undefined) data.loginAttempts = Number(body.loginAttempts);
    if (body.lockedUntil !== undefined) data.lockedUntil = body.lockedUntil ? new Date(body.lockedUntil) : null;
    if (body.lastLogin !== undefined) data.lastLogin = body.lastLogin ? new Date(body.lastLogin) : null;
    if (body.refreshToken !== undefined) data.refreshToken = body.refreshToken;

    let updated;
    try {
      updated = await updateUser({ id }, data);
    } catch (err: any) {
      if (err?.code === 'P2025') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (err?.code === 'P2002' && Array.isArray(err?.meta?.target) && err.meta.target.includes('email')) {
        return res.status(409).json({ error: 'Email ya registrado' });
      }
      throw err;
    }

    // Upsert de cuentas OAuth opcionales
    const oauth = body.oauthAccounts ?? body.oauthAccount;
    const oauthList: any[] = Array.isArray(oauth) ? oauth : oauth ? [oauth] : [];
    for (const acc of oauthList) {
      if (!acc || !acc.providerAccountId) continue;
      const where = { providerAccountId: String(acc.providerAccountId) } as any;
      const existing = await getOAuthAccount(where);
      const payload: any = {
        provider: acc.provider !== undefined ? String(acc.provider) : undefined,
        accessToken: acc.accessToken,
        refreshToken: acc.refreshToken,
        tokenType: acc.tokenType,
        expiresAt: acc.expiresAt ? new Date(acc.expiresAt) : undefined,
        scope: acc.scope,
        user: { connect: { id } },
      };
      if (existing) {
        await updateOAuthAccount(where, payload);
      } else {
        await createOAuthAccount({
          provider: String(acc.provider || ''),
          providerAccountId: String(acc.providerAccountId),
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          tokenType: payload.tokenType,
          expiresAt: payload.expiresAt,
          scope: payload.scope,
          user: { connect: { id } },
        });
      }
    }

    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await deleteUser({ id });
    res.json(deleted);
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}