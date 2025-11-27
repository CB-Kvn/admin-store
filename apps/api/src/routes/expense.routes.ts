import { Router } from 'express';
import {
  listExpensesHandler,
  getExpenseHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from '../controllers/expense.controller';

const router = Router();

router.get('/', listExpensesHandler);
router.get('/:id', getExpenseHandler);
router.post('/', createExpenseHandler);
router.put('/:id', updateExpenseHandler);
router.delete('/:id', deleteExpenseHandler);

export default router;