import { Router } from 'express';
import {
  listUsersHandler,
  getUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/user.controller';

const router = Router();

router.get('/', listUsersHandler);
router.get('/:id', getUserHandler);
router.post('/', createUserHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;