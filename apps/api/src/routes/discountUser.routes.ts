import { Router } from 'express';
import {
  listDiscountUsersHandler,
  getDiscountUserHandler,
  createDiscountUserHandler,
  updateDiscountUserHandler,
  deleteDiscountUserHandler,
} from '../controllers/discountUser.controller';

const router = Router();

router.get('/', listDiscountUsersHandler);
router.get('/:discountId/:userId', getDiscountUserHandler);
router.post('/', createDiscountUserHandler);
router.put('/:discountId/:userId', updateDiscountUserHandler);
router.delete('/:discountId/:userId', deleteDiscountUserHandler);

export default router;