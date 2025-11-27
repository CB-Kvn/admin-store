import { Router } from 'express';
import {
  listOAuthAccountsHandler,
  getOAuthAccountHandler,
  createOAuthAccountHandler,
  updateOAuthAccountHandler,
  deleteOAuthAccountHandler,
} from '../controllers/oauthAccount.controller';

const router = Router();

router.get('/', listOAuthAccountsHandler);
router.get('/:id', getOAuthAccountHandler);
router.post('/', createOAuthAccountHandler);
router.put('/:id', updateOAuthAccountHandler);
router.delete('/:id', deleteOAuthAccountHandler);

export default router;