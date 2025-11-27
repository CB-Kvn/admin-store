import { Router } from 'express';
import {
  listStockMovementsHandler,
  getStockMovementHandler,
  createStockMovementHandler,
  updateStockMovementHandler,
  deleteStockMovementHandler,
} from '../controllers/stockMovement.controller';

const router = Router();

router.get('/', listStockMovementsHandler);
router.get('/:id', getStockMovementHandler);
router.post('/', createStockMovementHandler);
router.put('/:id', updateStockMovementHandler);
router.delete('/:id', deleteStockMovementHandler);

export default router;