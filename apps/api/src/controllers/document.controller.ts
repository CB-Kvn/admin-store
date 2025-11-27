import { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma';
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/document.service';

// GET /documents
export async function listDocumentsHandler(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;
    const orderByField = (req.query.orderBy as string) || 'createdAt';
    const orderDir = ((req.query.orderDir as string) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    const userId = req.query.userId as string | undefined;
    const type = req.query.type as string | undefined;
    const mimeType = req.query.mimeType as string | undefined;
    const q = req.query.q as string | undefined;

    const where: Prisma.DocumentWhereInput = {} as any;
    if (userId) (where as any).userId = userId;
    if (type) (where as any).type = type;
    if (mimeType) (where as any).mimeType = { contains: mimeType, mode: 'insensitive' } as any;
    if (q) {
      (where as any).OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { fileName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.DocumentOrderByWithRelationInput = {
      [orderByField]: orderDir,
    } as any;

    const docs = await listDocuments({ where, orderBy, take: limit, skip: offset });
    return res.status(200).json(docs);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to list documents', error: err?.message || String(err) });
  }
}

// GET /documents/:id
export async function getDocumentByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const doc = await getDocument({ id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    return res.status(200).json(doc);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get document', error: err?.message || String(err) });
  }
}

// POST /documents
export async function createDocumentHandler(req: Request, res: Response) {
  try {
    const data = req.body as Prisma.DocumentCreateInput;
    const created = await createDocument(data);
    return res.status(201).json(created);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate key', meta: err?.meta });
    }
    return res.status(500).json({ message: 'Failed to create document', error: err?.message || String(err) });
  }
}

// PUT /documents/:id
export async function updateDocumentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body as Prisma.DocumentUpdateInput;
    const updated = await updateDocument({ id }, data);
    return res.status(200).json(updated);
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Document not found', meta: err?.meta });
    }
    return res.status(500).json({ message: 'Failed to update document', error: err?.message || String(err) });
  }
}

// DELETE /documents/:id
export async function deleteDocumentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument({ id });
    return res.status(200).json({ message: 'Document deleted', document: deleted });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete document', error: err?.message || String(err) });
  }
}