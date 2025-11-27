import {
  listWarehouseStocks,
  getWarehouseStock,
  createWarehouseStock,
  updateWarehouseStock,
  deleteWarehouseStock,
} from '../services/warehouseStock.service';

export async function listWarehouseStocksHandler(req: any, res: any) {
  try {
    const { limit, offset, warehouseId, itemId } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    if (warehouseId) where.warehouseId = String(warehouseId);
    if (itemId) where.itemId = Number(itemId);
    const stocks = await listWarehouseStocks({ where, take, skip });
    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar stock de almacén' });
  }
}

export async function getWarehouseStockHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const stock = await getWarehouseStock({ id });
    if (!stock) return res.status(404).json({ error: 'Stock no encontrado' });
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
}

export async function createWarehouseStockHandler(req: any, res: any) {
  try {
    const { stock, itemId, warehouseId } = req.body || {};
    const errors: string[] = [];
    if (!stock) errors.push('stock es requerido');
    if (itemId === undefined) errors.push('itemId es requerido');
    if (warehouseId === undefined) errors.push('warehouseId es requerido');
    if (stock && stock.quantity !== undefined && Number.isNaN(Number(stock.quantity))) errors.push('quantity debe ser numérico');
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const data: any = { ...stock };
    data.item = { connect: { id: Number(itemId) } };
    data.warehouse = { connect: { id: String(warehouseId) } };

    const created = await createWarehouseStock(data);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear stock' });
  }
}

export async function updateWarehouseStockHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const { stock, itemId, warehouseId } = req.body || {};
    if (!stock) return res.status(400).json({ error: 'Faltan datos de stock (stock)' });

    const data: any = { ...stock };
    if (stock.quantity !== undefined && Number.isNaN(Number(stock.quantity))) return res.status(400).json({ error: 'quantity debe ser numérico' });
    if (itemId !== undefined) data.item = { connect: { id: Number(itemId) } };
    if (warehouseId !== undefined) data.warehouse = { connect: { id: String(warehouseId) } };

    const updated = await updateWarehouseStock({ id }, data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
}

export async function deleteWarehouseStockHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const deleted = await deleteWarehouseStock({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar stock' });
  }
}