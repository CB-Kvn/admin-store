import {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../services/warehouse.service';

export async function listWarehousesHandler(req: any, res: any) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const warehouses = await listWarehouses({ take, skip });
    res.json(warehouses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar almacenes' });
  }
}

export async function getWarehouseHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const warehouse = await getWarehouse({ id });
    if (!warehouse) return res.status(404).json({ error: 'Almacén no encontrado' });
    res.json(warehouse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener almacén' });
  }
}

export async function createWarehouseHandler(req: any, res: any) {
  try {
    const data = req.body || {};
    const errors: string[] = [];
    if (!data.name) errors.push('name es requerido');
    if (!data.location) errors.push('location es requerido');
    if (!data.address) errors.push('address es requerido');
    if (data.capacity === undefined || Number.isNaN(Number(data.capacity))) errors.push('capacity debe ser numérico');
    if (data.status && !['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(String(data.status))) errors.push('status inválido');
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const created = await createWarehouse({
      name: String(data.name),
      location: String(data.location),
      address: String(data.address),
      manager: data.manager ? String(data.manager) : undefined,
      phone: data.phone ? String(data.phone) : undefined,
      email: data.email ? String(data.email) : undefined,
      capacity: Number(data.capacity),
      currentOccupancy: data.currentOccupancy !== undefined ? Number(data.currentOccupancy) : 0,
      status: data.status,
      lastInventoryDate: data.lastInventoryDate ? new Date(data.lastInventoryDate) : undefined,
      notes: data.notes,
    } as any);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear almacén' });
  }
}

export async function updateWarehouseHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const data = req.body || {};
    const payload: any = {};
    if (data.name !== undefined) payload.name = String(data.name);
    if (data.location !== undefined) payload.location = String(data.location);
    if (data.address !== undefined) payload.address = String(data.address);
    if (data.manager !== undefined) payload.manager = String(data.manager);
    if (data.phone !== undefined) payload.phone = String(data.phone);
    if (data.email !== undefined) payload.email = String(data.email);
    if (data.capacity !== undefined) payload.capacity = Number(data.capacity);
    if (data.currentOccupancy !== undefined) payload.currentOccupancy = Number(data.currentOccupancy);
    if (data.status !== undefined) payload.status = data.status;
    if (data.lastInventoryDate !== undefined) payload.lastInventoryDate = new Date(data.lastInventoryDate);
    if (data.notes !== undefined) payload.notes = String(data.notes);

    const updated = await updateWarehouse({ id }, payload);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar almacén' });
  }
}

export async function deleteWarehouseHandler(req: any, res: any) {
  try {
    const id = String(req.params.id);
    const deleted = await deleteWarehouse({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar almacén' });
  }
}