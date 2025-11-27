import { Router } from 'express';
import {
  listColorsHandler,
  getColorHandler,
  createColorHandler,
  updateColorHandler,
  deleteColorHandler,
} from '../controllers/color.controller';

const router = Router();

router.get('/', listColorsHandler);
router.get('/:id', getColorHandler);
router.post('/', createColorHandler);
router.put('/:id', updateColorHandler);
router.delete('/:id', deleteColorHandler);

export default router;