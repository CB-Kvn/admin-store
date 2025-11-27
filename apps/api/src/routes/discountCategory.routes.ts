import { Router } from 'express';
import {
  listDiscountCategoriesHandler,
  getDiscountCategoryHandler,
  createDiscountCategoryHandler,
  updateDiscountCategoryHandler,
  deleteDiscountCategoryHandler,
} from '../controllers/discountCategory.controller';

const router = Router();

router.get('/', listDiscountCategoriesHandler);
router.get('/:discountId/:categoryId', getDiscountCategoryHandler);
router.post('/', createDiscountCategoryHandler);
router.put('/:discountId/:categoryId', updateDiscountCategoryHandler);
router.delete('/:discountId/:categoryId', deleteDiscountCategoryHandler);

export default router;