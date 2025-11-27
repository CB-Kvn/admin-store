import { Router } from 'express';
import {
  listWarehousesHandler,
  getWarehouseHandler,
  createWarehouseHandler,
  updateWarehouseHandler,
  deleteWarehouseHandler,
} from '../controllers/warehouse.controller';

const router = Router();

router.get('/', listWarehousesHandler);
router.get('/:id', getWarehouseHandler);
router.post('/', createWarehouseHandler);
router.put('/:id', updateWarehouseHandler);
router.delete('/:id', deleteWarehouseHandler);

export default router;