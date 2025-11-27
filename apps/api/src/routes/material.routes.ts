import { Router } from 'express';
import {
  listMaterialsHandler,
  getMaterialHandler,
  createMaterialHandler,
  updateMaterialHandler,
  deleteMaterialHandler,
} from '../controllers/material.controller';

const router = Router();

router.get('/', listMaterialsHandler);
router.get('/:id', getMaterialHandler);
router.post('/', createMaterialHandler);
router.put('/:id', updateMaterialHandler);
router.delete('/:id', deleteMaterialHandler);

export default router;