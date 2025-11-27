import {
  listStockMovements,
  getStockMovement,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
} from '../services/stockMovement.service';

export async function listStockMovementsHandler(req: any, res: any) {
  try {
    const { limit, offset, stockId, warehouseId, itemId, startDate, endDate } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (stockId) where.stockId = String(stockId);
    if (warehouseId || itemId) {
      where.stock = {};
      if (warehouseId) where.stock.warehouseId = String(warehouseId);
      if (itemId) where.stock.itemId = Number(itemId);
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    const movements = await listStockMovements({ where, take, skip, orderBy: { date: 'desc' } });
    res.json(movements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar movimientos de stock' });
  }
}

export async function getStockMovementHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const movement = await getStockMovement({ id });
    if (!movement) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener movimiento' });
  }
}

export async function createStockMovementHandler(req: any, res: any) {
  try {
    const { movement, stockId } = req.body || {};
    const errors: string[] = [];
    if (!movement) errors.push('movement es requerido');
    if (movement && movement.type && !['IN', 'OUT', 'TRANSFER'].includes(String(movement.type))) errors.push('type inválido');
    if (movement && (movement.quantity === undefined || Number.isNaN(Number(movement.quantity)))) errors.push('quantity debe ser numérico');
    if (!stockId) errors.push('stockId es requerido');
    if (!movement?.userId) errors.push('userId es requerido');
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const data: any = { ...movement };
    data.stock = { connect: { id: String(stockId) } };

    const created = await createStockMovement(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear movimiento' });
  }
}

export async function updateStockMovementHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const { movement, stockId } = req.body || {};
    if (!movement) return res.status(400).json({ error: 'Faltan datos del movimiento (movement)' });

    if (movement.type && !['IN', 'OUT', 'TRANSFER'].includes(String(movement.type))) return res.status(400).json({ error: 'type inválido' });
    if (movement.quantity !== undefined && Number.isNaN(Number(movement.quantity))) return res.status(400).json({ error: 'quantity debe ser numérico' });

    const data: any = { ...movement };
    if (stockId !== undefined) data.stock = { connect: { id: String(stockId) } };

    const updated = await updateStockMovement({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar movimiento' });
  }
}

export async function deleteStockMovementHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const deleted = await deleteStockMovement({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar movimiento' });
  }
}