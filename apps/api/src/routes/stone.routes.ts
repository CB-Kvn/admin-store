import { Router } from 'express';
import {
  listStonesHandler,
  getStoneHandler,
  createStoneHandler,
  updateStoneHandler,
  deleteStoneHandler,
} from '../controllers/stone.controller';

const router = Router();

router.get('/', listStonesHandler);
router.get('/:id', getStoneHandler);
router.post('/', createStoneHandler);
router.put('/:id', updateStoneHandler);
router.delete('/:id', deleteStoneHandler);

export default router;