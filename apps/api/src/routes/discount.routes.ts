import { Router } from 'express';
import {
  listDiscountsHandler,
  getDiscountHandler,
  createDiscountHandler,
  updateDiscountHandler,
  deleteDiscountHandler,
} from '../controllers/discount.controller';

const router = Router();

router.get('/', listDiscountsHandler);
router.get('/:id', getDiscountHandler);
router.post('/', createDiscountHandler);
router.put('/:id', updateDiscountHandler);
router.delete('/:id', deleteDiscountHandler);

export default router;