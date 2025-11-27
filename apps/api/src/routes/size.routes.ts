import { Router } from 'express';
import {
  listSizesHandler,
  getSizeHandler,
  createSizeHandler,
  updateSizeHandler,
  deleteSizeHandler,
} from '../controllers/size.controller';

const router = Router();

router.get('/', listSizesHandler);
router.get('/:id', getSizeHandler);
router.post('/', createSizeHandler);
router.put('/:id', updateSizeHandler);
router.delete('/:id', deleteSizeHandler);

export default router;