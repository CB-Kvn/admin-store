import { Router } from 'express';
import {
  listCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/category.controller';

const router = Router();

router.get('/', listCategoriesHandler);
router.get('/:id', getCategoryHandler);
router.post('/', createCategoryHandler);
router.put('/:id', updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

export default router;