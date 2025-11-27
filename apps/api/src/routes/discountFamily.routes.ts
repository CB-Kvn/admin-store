import { Router } from 'express';
import {
  listDiscountFamiliesHandler,
  getDiscountFamilyHandler,
  createDiscountFamilyHandler,
  updateDiscountFamilyHandler,
  deleteDiscountFamilyHandler,
} from '../controllers/discountFamily.controller';

const router = Router();

router.get('/', listDiscountFamiliesHandler);
router.get('/:discountId/:familyId', getDiscountFamilyHandler);
router.post('/', createDiscountFamilyHandler);
router.put('/:discountId/:familyId', updateDiscountFamilyHandler);
router.delete('/:discountId/:familyId', deleteDiscountFamilyHandler);

export default router;