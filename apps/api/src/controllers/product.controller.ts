import {
  listCatalogItems,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from '../services/catalogItem.service';
import { createImage } from '../services/image.service';
import { createItemCategory } from '../services/itemCategory.service';
import prisma from '../prisma';
import { Prisma } from '../../generated/prisma';

function isDiscountActive(discount: any) {
  if (!discount) return false;
  if (!discount.isActive) return false;
  const now = new Date();
  const startsOk = discount.startDate ? new Date(discount.startDate) <= now : true;
  const endsOk = discount.endDate ? new Date(discount.endDate) >= now : true;
  return startsOk && endsOk;
}

export async function listProducts(req: any, res: any) {
  try {
    const { includeImages, includeCategories, limit, offset, familyId, sku, variantAvailable, productAvailable, minPrice, maxPrice, productName, orderBy, orderDir } = req.query as Record<string, string>;
    const userId: string | undefined = (req.query?.userId as string) || (req.user?.id as string) || undefined;
    const include: any = {};
    if (includeImages === 'true') include.images = true;
    // Siempre incluimos categorías con sus descuentos para calcular descuentos por categoría.
    include.categories = {
      include: {
        category: {
          include: {
            DiscountCategory: {
              include: { discount: true },
            },
          },
        },
      },
    };
    // // Incluir datos de stock por producto junto con el almacén
     include.stocks = { include: { warehouse: true } };
    // // Incluir descuentos asignados directamente al producto
    include.discountProducts = { include: { discount: true } };

    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;
    const where: any = {};
    // if (familyId) where.familyId = String(familyId);
    // if (sku) where.sku = String(sku);
    // if (variantAvailable === 'true') where.variantAvailable = true;
    // if (variantAvailable === 'false') where.variantAvailable = false;
    // if (productAvailable === 'true') where.productAvailable = true;
    // if (productAvailable === 'false') where.productAvailable = false;
    // if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
    //   where.price = { ...(where.price || {}), gte: Number(minPrice) };
    // }
    // if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
    //   where.price = { ...(where.price || {}), lte: Number(maxPrice) };
    // }
    // if (productName) {
    //   const text = String(productName);
    //   where.OR = [
    //     { productName: { contains: text, mode: 'insensitive' } },
    //     { title: { contains: text, mode: 'insensitive' } },
    //     { brand: { contains: text, mode: 'insensitive' } },
    //   ];
    // }

     let orderByClause: any = undefined;
     if (orderBy && ['price', 'createdAt'].includes(orderBy)) {
       const direction = orderDir === 'asc' ? 'asc' : orderDir === 'desc' ? 'desc' : 'desc';
      orderByClause = [{ [orderBy]: direction }];
      // Ordenación secundaria para desempate
      if (orderBy !== 'createdAt') {
         orderByClause.push({ createdAt: 'desc' });
       } else {
         // Si ya ordenamos por createdAt, usa id desc como desempate estable
         orderByClause.push({ id: 'desc' });
       }
     }

    // const items = await listCatalogItems({ where, include: Object.keys(include).length ? include : undefined, take, skip, orderBy: orderByClause });
    const items = await listCatalogItems({ where, include: Object.keys(include).length ? include : undefined, take, skip, orderBy: orderByClause });
    const discountFamily = await prisma.discountFamily.findMany({
      where: { familyId: { in: items.map((it: any) => it.familyId).filter(Boolean) } },
      include: { discount: true },
    });

    const discountUser = await prisma.discountUser.findMany({
      where: { userId: userId },
      include: { discount: true },
    });
    // // Recopilar descuentos por familia para todos los ítems recuperados
    // const familyIds = Array.from(new Set(items.map((it: any) => it.familyId).filter(Boolean)));
    // let familyDiscountsMap: Record<string, any[]> = {};
    // if (familyIds.length) {
    //   const familyDiscounts = await prisma.discountFamily.findMany({
    //     where: { familyId: { in: familyIds } },
    //     include: { discount: true },
    //   });
    //   for (const fd of familyDiscounts) {
    //     const key = String(fd.familyId);
    //     if (!familyDiscountsMap[key]) familyDiscountsMap[key] = [];
    //     familyDiscountsMap[key].push(fd.discount);
    //   }
    // }

    // // Mapa auxiliar: familyId -> [discountId] de descuentos por familia
    // const familyToDiscountIdsMap: Record<string, number[]> = {};
    // for (const [famId, discounts] of Object.entries(familyDiscountsMap)) {
    //   familyToDiscountIdsMap[famId] = discounts.map((d: any) => d.id);
    // }

    // // Recolectar ids de categorías por item y conjuntos globales
    // const itemToCategoryIds: Record<number, number[]> = {};
    // const allCategoryIdsSet = new Set<number>();
    // for (const it of items as any[]) {
    //   const catIds = (it.categories || []).map((ic: any) => ic.categoryId).filter((id: any) => id !== undefined);
    //   itemToCategoryIds[it.id] = catIds;
    //   for (const cid of catIds) allCategoryIdsSet.add(cid);
    // }
    // const allCategoryIds = Array.from(allCategoryIdsSet);

    // // Conjunto de todos los discountId provenientes de familia
    // const allFamilyDiscountIds = Array.from(
    //   new Set(
    //     Object.values(familyToDiscountIdsMap)
    //       .flat()
    //       .filter((id) => id !== undefined)
    //   )
    // );

    // // Candidatos de descuentos por categoría que además están vinculados a familia (familyId -> discountId)
    // let dcCandidates: any[] = [];
    // if (allFamilyDiscountIds.length && allCategoryIds.length) {
    //   dcCandidates = await prisma.discountCategory.findMany({
    //     where: {
    //       discountId: { in: allFamilyDiscountIds },
    //       categoryId: { in: allCategoryIds },
    //     },
    //     include: { discount: true },
    //   });
    // }

    // // Descuentos globales activos (aplican a todos los productos)
    // const globalDiscounts = await prisma.discount.findMany({ where: { isGlobal: true } });
    // const activeGlobalDiscounts = globalDiscounts.filter(isDiscountActive);

    // // Descuentos por usuario (si se proporciona userId)
    // let activeUserDiscounts: any[] = [];
    // if (userId) {
    //   const userDiscounts = await prisma.discountUser.findMany({
    //     where: { userId: String(userId) },
    //     include: { discount: true },
    //   });
    //   activeUserDiscounts = userDiscounts.map((ud: any) => ud.discount).filter(isDiscountActive);
    // }

    // let enriched = items.map((item: any) => {
    //   const direct = (item.discountProducts || [])
    //     .map((dp: any) => dp.discount)
    //     .filter(isDiscountActive);
    //   // Descuentos por categoría: primero familia -> discountId, luego cruce por categoryId e ids del item
    //   const itemCatIds = itemToCategoryIds[item.id] || [];
    //   const famDiscountIds = familyToDiscountIdsMap[String(item.familyId)] || [];
    //   const byCategory = dcCandidates
    //     .filter((dc: any) => famDiscountIds.includes(dc.discountId) && itemCatIds.includes(dc.categoryId))
    //     .map((dc: any) => dc.discount)
    //     .filter(isDiscountActive);
    //   const byFamily = (familyDiscountsMap[item.familyId] || [])
    //     .filter(isDiscountActive);
    //   const byUser = activeUserDiscounts;
    //   const byGlobal = activeGlobalDiscounts;
    //   return {
    //     ...item,
    //     discounts: {
    //       direct,
    //       byCategory,
    //       byFamily,
    //       byUser,
    //       byGlobal,
    //     },
    //   };
    // });

    // // Si el cliente no pidió categorías explícitas, las ocultamos del resultado
    // if (includeCategories !== 'true') {
    //   enriched = enriched.map(({ categories, ...rest }: any) => rest);
    // }

    // Unir cada DiscountFamily al item correspondiente por familyId
    const discountFamilyMap: Record<string, any[]> = {};
    for (const df of discountFamily as any[]) {
      const key = String(df.familyId);
      if (!discountFamilyMap[key]) discountFamilyMap[key] = [];
      discountFamilyMap[key].push(df);
    }

    // Construir mapa de items por familyId para "relatedItems"
    const familyIds = Array.from(new Set((items as any[]).map((it: any) => it.familyId).filter(Boolean)));
    let familyItemsMap: Record<string, any[]> = {};
    if (familyIds.length) {
      const familyItems = await listCatalogItems({
        where: { familyId: { in: familyIds } },
        // Traer imágenes para tarjetas, mantener otras relaciones ligeras
        include: { images: true },
      });
      for (const fi of familyItems as any[]) {
        const key = String(fi.familyId);
        if (!familyItemsMap[key]) familyItemsMap[key] = [];
        familyItemsMap[key].push(fi);
      }
    }

    const enriched = (items as any[]).map((it: any) => {
      const discountCategories = ((it.categories || [])
        .flatMap((ic: any) => (ic?.category?.DiscountCategory || []))
        .map((dc: any) => dc.discount)
        .filter((d: any) => !!d)) as any[];

      return {
        ...it,
        discountFamily: discountFamilyMap[String(it.familyId)] || [],
        discountCategories,
        relatedItems: (familyItemsMap[String(it.familyId)] || []).filter((ri: any) => ri.id !== it.id),
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar productos' });
  }
}

export async function listFamilies(req: any, res: any) {
  try {
    const { limit, offset } = req.query as Record<string, string>;
    const take = limit ? Math.max(0, Number(limit)) : undefined;
    const skip = offset ? Math.max(0, Number(offset)) : undefined;

    const families = await prisma.catalogItem.findMany({
      select: { familyId: true, familySlug: true },
      distinct: ['familyId'] as Prisma.CatalogItemScalarFieldEnum[],
      orderBy: { familySlug: 'asc' },
      take,
      skip,
    });

    res.json(families);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar familias de productos' });
  }
}

export async function getProduct(req: any, res: any) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const userId: string | undefined = (req.query?.userId as string) || (req.user?.id as string) || undefined;

    const item = await getCatalogItem(
      { id },
      {
        include: {
          images: true,
          categories: {
            include: {
              category: {
                include: {
                  DiscountCategory: { include: { discount: true } },
                },
              },
            },
          },
          stocks: { include: { warehouse: true } },
          discountProducts: { include: { discount: true } },
        },
      }
    );
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });

    // Igualar estructura de listProducts, pero para un solo id
    const discountFamily = await prisma.discountFamily.findMany({
      where: { familyId: String(item.familyId) },
      include: { discount: true },
    });

    const discountCategories = ((item.categories || [])
      .flatMap((ic: any) => (ic?.category?.DiscountCategory || []))
      .map((dc: any) => dc.discount)
      .filter((d: any) => !!d)) as any[];

    // Items relacionados por familia (excluye el mismo item)
    let relatedItems: any[] = [];
    if (item.familyId) {
      const siblings = await listCatalogItems({
        where: { familyId: String(item.familyId) },
        include: { images: true },
      });
      relatedItems = (siblings as any[]).filter((s: any) => s.id !== item.id);
    }

    res.json({
      ...item,
      discountFamily,
      discountCategories,
      relatedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
}

export async function createProduct(req: any, res: any) {
  try {
    const { item, images, categories } = req.body || {};
    if (!item) return res.status(400).json({ error: 'Faltan datos del producto (item)' });

    const errors: string[] = [];
    if (!item.familyId) errors.push('familyId es requerido');
    if (!item.productName) errors.push('productName es requerido');
    if (!item.sku) errors.push('sku es requerido');
    if (item.price === undefined || Number.isNaN(Number(item.price))) errors.push('price debe ser numérico');
    if (item.attributes !== undefined) {
      if (!Array.isArray(item.attributes)) {
        errors.push('attributes debe ser un arreglo de objetos');
      } else {
        const invalidIndex = item.attributes.findIndex((a: any) => a === null || typeof a !== 'object' || Array.isArray(a));
        if (invalidIndex !== -1) {
          errors.push('attributes debe contener únicamente objetos');
        }
      }
    }
    if (errors.length) return res.status(400).json({ error: 'Validación', details: errors });

    const payload: any = {
      familyId: String(item.familyId),
      productName: String(item.productName),
      productDescription: item.productDescription,
      brand: item.brand,
      productDetails: item.productDetails,
      productAvailable: item.productAvailable === undefined ? true : !!item.productAvailable,
      sku: String(item.sku),
      barcode: item.barcode,
      title: item.title,
      attributes: item.attributes,
      price: Number(item.price),
      compareAtPrice: item.compareAtPrice !== undefined ? Number(item.compareAtPrice) : undefined,
      currency: item.currency,
      variantAvailable: item.variantAvailable === undefined ? true : !!item.variantAvailable,
    };

    if (item.familySlug !== undefined && item.familySlug !== null) {
      payload.familySlug = String(item.familySlug);
    }

    const created = await createCatalogItem(payload);

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        await createImage({
          url: img.url,
          alt: img.alt,
          isPrimary: !!img.isPrimary,
          state: img.state === undefined ? true : !!img.state,
          item: { connect: { id: created.id } },
        });
      }
    }

    if (Array.isArray(categories) && categories.length > 0) {
      for (const categoryId of categories) {
        await createItemCategory({
          item: { connect: { id: created.id } },
          category: { connect: { id: Number(categoryId) } },
          assignedAt: new Date(),
        });
      }
    }

    const result = await getCatalogItem(
      { id: created.id },
      {
        include: {
          images: true,
          categories: {
            include: {
              category: {
                include: { DiscountCategory: { include: { discount: true } } },
              },
            },
          },
          discountProducts: { include: { discount: true } },
        },
      }
    );

    const familyDiscounts = await prisma.discountFamily.findMany({
      where: { familyId: String(result?.familyId) },
      include: { discount: true },
    });
    const familyDiscountIds = familyDiscounts.map((fd: any) => fd.discountId);

    // Por categoría: primero familia -> discountId, luego cruce por categoryId del item
    const itemCategoryIds = ((result as any)?.categories || []).map((ic: any) => ic.categoryId);
    const dcCandidates = await prisma.discountCategory.findMany({
      where: {
        discountId: { in: familyDiscountIds },
        categoryId: { in: itemCategoryIds },
      },
      include: { discount: true },
    });

    // Globales y usuario (si viene en query)
    const userId: string | undefined = (req.query?.userId as string) || (req.user?.id as string) || undefined;
    const globalDiscounts = await prisma.discount.findMany({ where: { isGlobal: true } });
    const activeGlobalDiscounts = globalDiscounts.filter(isDiscountActive);
    let activeUserDiscounts: any[] = [];
    if (userId) {
      const userDiscounts = await prisma.discountUser.findMany({
        where: { userId: String(userId) },
        include: { discount: true },
      });
      activeUserDiscounts = userDiscounts.map((ud: any) => ud.discount).filter(isDiscountActive);
    }

    const direct = ((result as any)?.discountProducts || [])
      .map((dp: any) => dp.discount)
      .filter(isDiscountActive);
    const byCategory = (dcCandidates || [])
      .map((dc: any) => dc.discount)
      .filter(isDiscountActive);
    const byFamily = (familyDiscounts || [])
      .map((fd: any) => fd.discount)
      .filter(isDiscountActive);
    const byUser = activeUserDiscounts;
    const byGlobal = activeGlobalDiscounts;

    res.status(201).json({
      ...result,
      discounts: {
        direct,
        byCategory,
        byFamily,
        byUser,
        byGlobal,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
}

export async function updateProduct(req: any, res: any) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { item, images, categories } = req.body || {};
    if (!item) return res.status(400).json({ error: 'Faltan datos del producto (item)' });

    const payload: any = {};
    if (item.familyId !== undefined) payload.familyId = String(item.familyId);
    if (item.familySlug !== undefined) payload.familySlug = String(item.familySlug);
    if (item.productName !== undefined) payload.productName = String(item.productName);
    if (item.productDescription !== undefined) payload.productDescription = item.productDescription;
    if (item.brand !== undefined) payload.brand = item.brand;
    if (item.productDetails !== undefined) payload.productDetails = item.productDetails;
    if (item.productAvailable !== undefined) payload.productAvailable = !!item.productAvailable;
    if (item.sku !== undefined) payload.sku = String(item.sku);
    if (item.barcode !== undefined) payload.barcode = item.barcode;
    if (item.title !== undefined) payload.title = item.title;
    if (item.attributes !== undefined) {
      if (!Array.isArray(item.attributes)) {
        return res.status(400).json({ error: 'attributes debe ser un arreglo de objetos' });
      }
      const invalidIndex = item.attributes.findIndex((a: any) => a === null || typeof a !== 'object' || Array.isArray(a));
      if (invalidIndex !== -1) {
        return res.status(400).json({ error: 'attributes debe contener únicamente objetos' });
      }
      payload.attributes = item.attributes;
    }
    if (item.price !== undefined) {
      if (Number.isNaN(Number(item.price))) return res.status(400).json({ error: 'price debe ser numérico' });
      payload.price = Number(item.price);
    }
    if (item.compareAtPrice !== undefined) {
      if (Number.isNaN(Number(item.compareAtPrice))) return res.status(400).json({ error: 'compareAtPrice debe ser numérico' });
      payload.compareAtPrice = Number(item.compareAtPrice);
    }
    if (item.currency !== undefined) payload.currency = item.currency;
    if (item.variantAvailable !== undefined) payload.variantAvailable = !!item.variantAvailable;

    await updateCatalogItem({ id }, payload);

    if (Array.isArray(images)) {
      await prisma.image.deleteMany({ where: { itemId: id } });
      if (images.length > 0) {
        for (const img of images) {
          await createImage({
            url: img.url,
            alt: img.alt,
            isPrimary: !!img.isPrimary,
            state: img.state === undefined ? true : !!img.state,
            item: { connect: { id } },
          });
        }
      }
    }

    if (Array.isArray(categories)) {
      await prisma.itemCategory.deleteMany({ where: { itemId: id } });
      if (categories.length > 0) {
        for (const categoryId of categories) {
          await createItemCategory({
            item: { connect: { id } },
            category: { connect: { id: Number(categoryId) } },
            assignedAt: new Date(),
          });
        }
      }
    }

    const result = await getCatalogItem(
      { id },
      {
        include: {
          images: true,
          categories: {
            include: {
              category: {
                include: { DiscountCategory: { include: { discount: true } } },
              },
            },
          },
          discountProducts: { include: { discount: true } },
        },
      }
    );

    const familyDiscounts = await prisma.discountFamily.findMany({
      where: { familyId: String(result?.familyId) },
      include: { discount: true },
    });

    // Globales y usuario (si viene en query)
    const userId: string | undefined = (req.query?.userId as string) || (req.user?.id as string) || undefined;
    const globalDiscounts = await prisma.discount.findMany({ where: { isGlobal: true } });
    const activeGlobalDiscounts = globalDiscounts.filter(isDiscountActive);
    let activeUserDiscounts: any[] = [];
    if (userId) {
      const userDiscounts = await prisma.discountUser.findMany({
        where: { userId: String(userId) },
        include: { discount: true },
      });
      activeUserDiscounts = userDiscounts.map((ud: any) => ud.discount).filter(isDiscountActive);
    }

    const direct = ((result as any)?.discountProducts || [])
      .map((dp: any) => dp.discount)
      .filter(isDiscountActive);
    const byCategory = (dcCandidates || [])
      .map((dc: any) => dc.discount)
      .filter(isDiscountActive);
    const byFamily = (familyDiscounts || [])
      .map((fd: any) => fd.discount)
      .filter(isDiscountActive);
    const byUser = activeUserDiscounts;
    const byGlobal = activeGlobalDiscounts;

    res.json({
      ...result,
      discounts: {
        direct,
        byCategory,
        byFamily,
        byUser,
        byGlobal,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
}

export async function deleteProduct(req: any, res: any) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    await prisma.image.deleteMany({ where: { itemId: id } });
    await prisma.itemCategory.deleteMany({ where: { itemId: id } });
    const deleted = await deleteCatalogItem({ id });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}