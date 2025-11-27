import { Router } from 'express';
import {
  listDiscountProductsHandler,
  getDiscountProductHandler,
  createDiscountProductHandler,
  updateDiscountProductHandler,
  deleteDiscountProductHandler,
} from '../controllers/discountProduct.controller';

const router = Router();

router.get('/', listDiscountProductsHandler);
router.get('/:discountId/:itemId', getDiscountProductHandler);
router.post('/', createDiscountProductHandler);
router.put('/:discountId/:itemId', updateDiscountProductHandler);
router.delete('/:discountId/:itemId', deleteDiscountProductHandler);

export default router;