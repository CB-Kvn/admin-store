import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, listFamilies } from '../controllers/product.controller';

const router = Router();

router.get('/', listProducts);
router.get('/families', listFamilies);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;