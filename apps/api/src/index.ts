import express from 'express';
import cors from 'cors';
import prisma from './prisma';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import materialRoutes from './routes/material.routes';
import colorRoutes from './routes/color.routes';
import closureTypeRoutes from './routes/closureType.routes';
import warehouseRoutes from './routes/warehouse.routes';
import warehouseStockRoutes from './routes/warehouseStock.routes';
import stockMovementRoutes from './routes/stockMovement.routes';
import discountRoutes from './routes/discount.routes';
import discountCategoryRoutes from './routes/discountCategory.routes';
import discountFamilyRoutes from './routes/discountFamily.routes';
import discountProductRoutes from './routes/discountProduct.routes';
import discountUserRoutes from './routes/discountUser.routes';
import orderRoutes from './routes/order.routes';
import documentRoutes from './routes/document.routes';
import userRoutes from './routes/user.routes';
import oauthAccountRoutes from './routes/oauthAccount.routes';
import expenseRoutes from './routes/expense.routes';
import sizeRoutes from './routes/size.routes';
import stoneRoutes from './routes/stone.routes';
import bannerRoutes from './routes/banner.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/materials', materialRoutes);
app.use('/colors', colorRoutes);
app.use('/closure-types', closureTypeRoutes);
app.use('/warehouses', warehouseRoutes);
app.use('/warehouse-stocks', warehouseStockRoutes);
app.use('/stock-movements', stockMovementRoutes);
app.use('/discounts', discountRoutes);
app.use('/discount-categories', discountCategoryRoutes);
app.use('/discount-families', discountFamilyRoutes);
app.use('/discount-products', discountProductRoutes);
  app.use('/discount-users', discountUserRoutes);
  app.use('/orders', orderRoutes);
  app.use('/documents', documentRoutes);
app.use('/users', userRoutes);
app.use('/oauth-accounts', oauthAccountRoutes);
app.use('/expenses', expenseRoutes);
app.use('/sizes', sizeRoutes);
app.use('/stones', stoneRoutes);
app.use('/banners', bannerRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Ejemplo: listar usuarios desde Prisma
app.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});