import { Router } from 'express';
import {
  listClosureTypesHandler,
  getClosureTypeHandler,
  createClosureTypeHandler,
  updateClosureTypeHandler,
  deleteClosureTypeHandler,
} from '../controllers/closureType.controller';

const router = Router();

router.get('/', listClosureTypesHandler);
router.get('/:id', getClosureTypeHandler);
router.post('/', createClosureTypeHandler);
router.put('/:id', updateClosureTypeHandler);
router.delete('/:id', deleteClosureTypeHandler);

export default router;