import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Balaji Cotton ERP API is running' });
});

// --- CUSTOMERS ---
app.get('/api/customers', async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req: Request, res: Response) => {
  try {
    const { name, type, phone, gstin } = req.body;
    const newCustomer = await prisma.customer.create({
      data: { name, type, phone, gstin }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// --- PURCHASES ---
app.get('/api/purchases', async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { supplier: true },
      orderBy: { date: 'desc' }
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

app.post('/api/purchases', async (req: Request, res: Response) => {
  try {
    const { supplierId, type, netWeight, rate, vehicleNo } = req.body;
    const amount = Number(netWeight) * Number(rate);
    const date = req.body.date ? new Date(req.body.date) : new Date();

    const purchase = await prisma.purchase.create({
      data: {
        date,
        supplierId: Number(supplierId),
        type,
        netWeight: Number(netWeight),
        rate: Number(rate),
        amount,
        vehicleNo
      },
      include: { supplier: true }
    });
    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// --- SALES ---
app.get('/api/sales', async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({ include: { buyer: true }, orderBy: { date: 'desc' } });
    res.json(sales);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch sales' }); }
});

app.post('/api/sales', async (req: Request, res: Response) => {
  try {
    const { buyerId, type, quantity, totalWeight, rate } = req.body;
    const amount = Number(totalWeight) * Number(rate);
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const sale = await prisma.sale.create({
      data: { date, buyerId: Number(buyerId), type, quantity: Number(quantity), totalWeight: Number(totalWeight), rate: Number(rate), amount },
    });
    res.status(201).json(sale);
  } catch (error) { res.status(500).json({ error: 'Failed to create sale' }); }
});

// --- PRODUCTION ---
app.get('/api/production', async (req: Request, res: Response) => {
  try {
    const production = await prisma.production.findMany({ orderBy: { date: 'desc' } });
    res.json(production);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch production' }); }
});

app.post('/api/production', async (req: Request, res: Response) => {
  try {
    const { inputBatches, inputWeight, lintProduced, seedProduced, waste } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const production = await prisma.production.create({
      data: { date, inputBatches, inputWeight: Number(inputWeight), lintProduced: Number(lintProduced), seedProduced: Number(seedProduced), waste: Number(waste) },
    });
    res.status(201).json(production);
  } catch (error) { res.status(500).json({ error: 'Failed to create production' }); }
});

// --- EXPENSES ---
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });
    res.json(expenses);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch expenses' }); }
});

app.post('/api/expenses', async (req: Request, res: Response) => {
  try {
    const { category, amount, description } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const expense = await prisma.expense.create({
      data: { date, category, amount: Number(amount), description },
    });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ error: 'Failed to create expense' }); }
});

// Seed default customers if they don't exist
const seedDatabase = async () => {
  try {
    const existingFarmer = await prisma.customer.findFirst({ where: { type: 'FARMER' } });
    if (!existingFarmer) {
      await prisma.customer.create({ data: { id: 1, name: 'Default Farmer', type: 'FARMER' } });
    }
    const existingBuyer = await prisma.customer.findFirst({ where: { type: 'BUYER' } });
    if (!existingBuyer) {
      await prisma.customer.create({ data: { id: 2, name: 'Default Buyer', type: 'BUYER' } });
    }
  } catch (e) {
    console.error("Failed to seed default customers", e);
  }
};

// Start the server
app.listen(port, async () => {
  await seedDatabase();
  console.log(`Server is running on port ${port}`);
});
