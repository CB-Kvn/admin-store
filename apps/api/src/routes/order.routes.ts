import { Router } from 'express';
import { createOrderHandler, updateOrderHandler, deleteOrderHandler, listOrdersHandler, getOrderByIdHandler } from '../controllers/order.controller';

const router = Router();

// Listar órdenes con filtros y include opcional
router.get('/', listOrdersHandler);

// Obtener una orden por id con include opcional
router.get('/:id', getOrderByIdHandler);

// Crear una orden con items y direcciones opcionales
router.post('/', createOrderHandler);

// Actualizar una orden (reemplaza items si se envían)
router.put('/:id', updateOrderHandler);

// Eliminar una orden (limpia sus items)
router.delete('/:id', deleteOrderHandler);

export default router;