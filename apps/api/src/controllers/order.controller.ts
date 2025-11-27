import { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma';
import {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrder,
  listPurchaseOrders,
} from '../services/purchaseOrder.service';
import { createOrderItem } from '../services/orderItem.service';
import prisma from '../prisma';
import { createAddress, updateAddress } from '../services/address.service';

// Util: normalizar números
function toNumber(val: unknown) {
  if (val === null || val === undefined || val === '') return undefined as unknown as number;
  const n = Number(val);
  return Number.isNaN(n) ? undefined as unknown as number : n;
}

// GET /orders
export async function listOrdersHandler(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;
    const orderByField = (req.query.orderBy as string) || 'createdAt';
    const orderDir = ((req.query.orderDir as string) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    const buyerId = req.query.buyerId as string | undefined;
    const email = req.query.email as string | undefined;
    const paymentStatus = req.query.paymentStatus as string | undefined;
    const q = req.query.q as string | undefined;
    const minDate = req.query.minDate ? new Date(String(req.query.minDate)) : undefined;
    const maxDate = req.query.maxDate ? new Date(String(req.query.maxDate)) : undefined;

    const includeParam = req.query.include as string | undefined;
    let include: Prisma.PurchaseOrderInclude | undefined;
    if (includeParam) {
      const allowed = new Set(['items', 'billingAddress', 'shippingAddress']);
      include = {};
      includeParam.split(',').map((s) => s.trim()).forEach((key) => {
        if (allowed.has(key)) (include as any)[key] = true;
      });
    }

    const where: Prisma.PurchaseOrderWhereInput = {};
    if (buyerId) where.buyerId = buyerId;
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (paymentStatus) (where as any).paymentStatus = paymentStatus;
    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (minDate || maxDate) {
      where.createdAt = {
        ...(minDate ? { gte: minDate } : {}),
        ...(maxDate ? { lte: maxDate } : {}),
      } as any;
    }

    const orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = {
      [orderByField]: orderDir,
    } as any;

    const orders = await listPurchaseOrders({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include,
    });
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to list orders', error: err?.message || String(err) });
  }
}

// GET /orders/:id
export async function getOrderByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const includeParam = req.query.include as string | undefined;
    let include: Prisma.PurchaseOrderInclude | undefined;
    if (includeParam) {
      const allowed = new Set(['items', 'billingAddress', 'shippingAddress']);
      include = {};
      includeParam.split(',').map((s) => s.trim()).forEach((key) => {
        if (allowed.has(key)) (include as any)[key] = true;
      });
    }

    const order = await getPurchaseOrder({ id }, { include });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get order', error: err?.message || String(err) });
  }
}

// POST /orders
export async function createOrderHandler(req: Request, res: Response) {
  try {
    const {
      order,
      items,
      billingAddress,
      shippingAddress,
    } = req.body as {
      order: Prisma.PurchaseOrderCreateInput & { id: string };
      items?: Array<
        Prisma.OrderItemCreateInput & {
          itemId: string;
          discountId?: number | null;
          discountAmount?: number | null;
        }
      >;
      billingAddress?: Prisma.AddressCreateInput | { id: string } | null;
      shippingAddress?: Prisma.AddressCreateInput | { id: string } | null;
    };

    if (!order) {
      return res.status(400).json({ message: 'Missing order payload' });
    }

    // Validaciones mínimas según esquema
    const requiredFields: Array<keyof typeof order> = [
      'id',
      'orderNumber',
      'email',
      'firstName',
      'lastName',
      'paymentMethod',
      'phone',
      'shippingAmount',
      'subtotalAmount',
    ];
    const missing = requiredFields.filter((f) => !(order as any)[f]);
    if (missing.length) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
    }

    // Manejo de direcciones (opcionales): crear o conectar
    let billingAddressId: string | undefined;
    let shippingAddressId: string | undefined;

    if (billingAddress) {
      if ('id' in billingAddress && billingAddress.id) {
        billingAddressId = billingAddress.id;
      } else {
        const created = await createAddress(billingAddress as Prisma.AddressCreateInput);
        billingAddressId = (created as any).id;
      }
    }

    if (shippingAddress) {
      if ('id' in shippingAddress && shippingAddress.id) {
        shippingAddressId = shippingAddress.id;
      } else {
        const created = await createAddress(shippingAddress as Prisma.AddressCreateInput);
        shippingAddressId = (created as any).id;
      }
    }

    const orderData: Prisma.PurchaseOrderCreateInput = {
      ...order,
      billingAddress: billingAddressId
        ? { connect: { id: billingAddressId } }
        : undefined,
      shippingAddress: shippingAddressId
        ? { connect: { id: shippingAddressId } }
        : undefined,
    };

    const createdOrder = await createPurchaseOrder(orderData);

    if (items && items.length) {
      for (const item of items) {
        const discountAmount = toNumber(item.discountAmount);
        const orderItemData: Prisma.OrderItemCreateInput = {
          order: { connect: { id: order.id } },
          item: { connect: { id: item.itemId } },
          quantity: toNumber((item as any).quantity) || 1,
          unitPrice: toNumber((item as any).unitPrice) || 0,
          totalPrice:
            (toNumber((item as any).quantity) || 1) * (toNumber((item as any).unitPrice) || 0) - (discountAmount || 0),
          discount: item.discountId ? { connect: { id: item.discountId } } : undefined,
          discountAmount: discountAmount ?? null,
        } as any;
        await createOrderItem(orderItemData);
      }
    }

    const fullOrder = await getPurchaseOrder({ id: order.id }, {
      include: { items: true, billingAddress: true, shippingAddress: true },
    });

    return res.status(201).json(fullOrder || createdOrder);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate key', meta: err?.meta });
    }
    return res.status(500).json({ message: 'Failed to create order', error: err?.message || String(err) });
  }
}

// PUT /orders/:id
export async function updateOrderHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      order,
      items,
      billingAddress,
      shippingAddress,
    } = req.body as {
      order?: Prisma.PurchaseOrderUpdateInput;
      items?: Array<
        Prisma.OrderItemCreateInput & {
          itemId: string;
          discountId?: number | null;
          discountAmount?: number | null;
        }
      >;
      billingAddress?: (Prisma.AddressUpdateInput & { id: string }) | Prisma.AddressCreateInput | null;
      shippingAddress?: (Prisma.AddressUpdateInput & { id: string }) | Prisma.AddressCreateInput | null;
    };

    const existing = await getPurchaseOrder({ id });
    if (!existing) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Actualizar/crear direcciones cuando se proveen
    let billingAddressConnect: Prisma.PurchaseOrderUpdateInput['billingAddress'] | undefined;
    if (billingAddress) {
      if ('id' in billingAddress && billingAddress.id) {
        // si vienen datos para actualizar
        const { id: addrId, ...addrData } = billingAddress as any;
        if (Object.keys(addrData).length) {
          await updateAddress({ id: addrId }, addrData as Prisma.AddressUpdateInput);
        }
        billingAddressConnect = { connect: { id: addrId } } as any;
      } else {
        const created = await createAddress(billingAddress as Prisma.AddressCreateInput);
        billingAddressConnect = { connect: { id: (created as any).id } } as any;
      }
    }

    let shippingAddressConnect: Prisma.PurchaseOrderUpdateInput['shippingAddress'] | undefined;
    if (shippingAddress) {
      if ('id' in shippingAddress && shippingAddress.id) {
        const { id: addrId, ...addrData } = shippingAddress as any;
        if (Object.keys(addrData).length) {
          await updateAddress({ id: addrId }, addrData as Prisma.AddressUpdateInput);
        }
        shippingAddressConnect = { connect: { id: addrId } } as any;
      } else {
        const created = await createAddress(shippingAddress as Prisma.AddressCreateInput);
        shippingAddressConnect = { connect: { id: (created as any).id } } as any;
      }
    }

    const updateData: Prisma.PurchaseOrderUpdateInput = {
      ...(order || {}),
      billingAddress: billingAddressConnect,
      shippingAddress: shippingAddressConnect,
    };

    const updatedOrder = await updatePurchaseOrder({ id }, updateData);

    // Si se proveen items, reemplazar todos los items del pedido
    if (items) {
      await prisma.orderItem.deleteMany({ where: { orderId: id } });
      for (const item of items) {
        const discountAmount = toNumber(item.discountAmount);
        const orderItemData: Prisma.OrderItemCreateInput = {
          order: { connect: { id } },
          item: { connect: { id: item.itemId } },
          quantity: toNumber((item as any).quantity) || 1,
          unitPrice: toNumber((item as any).unitPrice) || 0,
          totalPrice:
            (toNumber((item as any).quantity) || 1) * (toNumber((item as any).unitPrice) || 0) - (discountAmount || 0),
          discount: item.discountId ? { connect: { id: item.discountId } } : undefined,
          discountAmount: discountAmount ?? null,
        } as any;
        await createOrderItem(orderItemData);
      }
    }

    const fullOrder = await getPurchaseOrder({ id }, {
      include: { items: true, billingAddress: true, shippingAddress: true },
    });

    return res.status(200).json(fullOrder || updatedOrder);
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Order not found', meta: err?.meta });
    }
    return res.status(500).json({ message: 'Failed to update order', error: err?.message || String(err) });
  }
}

// DELETE /orders/:id
export async function deleteOrderHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await getPurchaseOrder({ id });
    if (!existing) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    const deleted = await deletePurchaseOrder({ id });
    return res.status(200).json({ message: 'Order deleted', order: deleted });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete order', error: err?.message || String(err) });
  }
}