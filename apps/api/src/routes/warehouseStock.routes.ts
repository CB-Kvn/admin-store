import { Router } from 'express';
import {
  listWarehouseStocksHandler,
  getWarehouseStockHandler,
  createWarehouseStockHandler,
  updateWarehouseStockHandler,
  deleteWarehouseStockHandler,
} from '../controllers/warehouseStock.controller';

const router = Router();

router.get('/', listWarehouseStocksHandler);
router.get('/:id', getWarehouseStockHandler);
router.post('/', createWarehouseStockHandler);
router.put('/:id', updateWarehouseStockHandler);
router.delete('/:id', deleteWarehouseStockHandler);

export default router;