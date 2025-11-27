import { Router } from 'express';
import {
  listBannersHandler,
  getBannerHandler,
  createBannerHandler,
  updateBannerHandler,
  deleteBannerHandler,
} from '../controllers/banner.controller';

const router = Router();

router.get('/', listBannersHandler);
router.get('/:id', getBannerHandler);
router.post('/', createBannerHandler);
router.put('/:id', updateBannerHandler);
router.delete('/:id', deleteBannerHandler);

export default router;