import { Router } from 'express';
import {
  listDocumentsHandler,
  getDocumentByIdHandler,
  createDocumentHandler,
  updateDocumentHandler,
  deleteDocumentHandler,
} from '../controllers/document.controller';

const router = Router();

router.get('/', listDocumentsHandler);
router.get('/:id', getDocumentByIdHandler);
router.post('/', createDocumentHandler);
router.put('/:id', updateDocumentHandler);
router.delete('/:id', deleteDocumentHandler);

export default router;