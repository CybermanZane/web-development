import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { pool } from './db.js';
import { deliveryFees, menuById } from './menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT ?? 3001);

const reservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1).max(10),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(180),
  phone: z.string().trim().min(7).max(40),
  notes: z.string().trim().max(1200).optional(),
});

const orderSchema = z.object({
  fulfillmentType: z.enum(['pickup', 'delivery']),
  deliveryZone: z.enum(['central', 'outer', 'extended']).optional(),
  customer: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(100),
    email: z.email().max(180),
    phone: z.string().trim().min(7).max(40),
    pickupTime: z.string().trim().max(40).optional(),
    note: z.string().trim().max(1200).optional(),
    address: z.string().trim().max(180).optional(),
    city: z.string().trim().max(100).optional(),
    postalCode: z.string().trim().max(20).optional(),
    apartment: z.string().trim().max(80).optional(),
    deliveryNote: z.string().trim().max(500).optional(),
  }),
  items: z.array(z.object({ productId: z.string().min(1).max(80), quantity: z.coerce.number().int().min(1).max(20) })).min(1).max(30),
  paymentMethod: z.enum(['cash', 'card']),
  cardBrand: z.enum(['visa', 'mastercard', 'amex', 'discover', 'unknown']).optional(),
  cardLast4: z.string().regex(/^\d{4}$/).optional(),
  idempotencyKey: z.string().uuid(),
}).superRefine((value, context) => {
  if (value.fulfillmentType === 'delivery') {
    if (!value.deliveryZone) context.addIssue({ code: 'custom', path: ['deliveryZone'], message: 'Delivery zone is required.' });
    if (!value.customer.address) context.addIssue({ code: 'custom', path: ['customer', 'address'], message: 'Address is required.' });
    if (!value.customer.city) context.addIssue({ code: 'custom', path: ['customer', 'city'], message: 'City is required.' });
    if (!value.customer.postalCode) context.addIssue({ code: 'custom', path: ['customer', 'postalCode'], message: 'Postal code is required.' });
  }
  if (value.paymentMethod === 'card' && (!value.cardBrand || !value.cardLast4)) {
    context.addIssue({ code: 'custom', path: ['cardLast4'], message: 'Only the detected card brand and last four digits may be submitted.' });
  }
});

app.use(express.json({ limit: '32kb' }));

app.use((request, response, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN;
  const requestOrigin = request.header('origin');

  if (allowedOrigin && requestOrigin === allowedOrigin) {
    response.header('Access-Control-Allow-Origin', requestOrigin);
    response.header('Vary', 'Origin');
    response.header('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', async (_request, response) => {
  const result = await pool.query('select now() as now');
  response.json({ ok: true, databaseTime: result.rows[0].now });
});

app.post('/api/reservations', async (request, response) => {
  const parsed = reservationSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      message: 'Please check the reservation details.',
      issues: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const reservation = parsed.data;

  const result = await pool.query(
    `insert into reservations (
      reservation_date,
      reservation_time,
      guests,
      name,
      email,
      phone,
      notes
    ) values ($1, $2, $3, $4, $5, $6, $7)
    returning id, status, created_at`,
    [
      reservation.date,
      reservation.time,
      reservation.guests,
      reservation.name,
      reservation.email,
      reservation.phone,
      reservation.notes || null,
    ],
  );

  response.status(201).json({
    reservation: result.rows[0],
    message: 'Reservation request received.',
  });
});

app.get('/api/reservations', async (request, response) => {
  const expectedToken = process.env.RESERVATIONS_ADMIN_TOKEN;
  const receivedToken = request.header('x-admin-token');

  if (!expectedToken || receivedToken !== expectedToken) {
    response.status(401).json({ message: 'Admin token is required.' });
    return;
  }

  const result = await pool.query(
    `select
      id,
      reservation_date,
      reservation_time,
      guests,
      name,
      email,
      phone,
      status,
      source,
      notes,
      created_at
    from reservations
    order by reservation_date asc, reservation_time asc
    limit 100`,
  );

  response.json({ reservations: result.rows });
});

app.post('/api/orders', async (request, response) => {
  const parsed = orderSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ message: 'Provjerite podatke narudžbe.', issues: parsed.error.flatten().fieldErrors });
    return;
  }

  const order = parsed.data;
  const uniqueItems = new Map<string, number>();
  for (const item of order.items) uniqueItems.set(item.productId, (uniqueItems.get(item.productId) ?? 0) + item.quantity);

  const lineItems = Array.from(uniqueItems, ([productId, quantity]) => {
    const product = menuById.get(productId);
    if (!product) return null;
    return { ...product, quantity, lineTotal: Number((product.price * quantity).toFixed(2)) };
  });

  if (lineItems.some((item) => !item)) {
    response.status(400).json({ message: 'Jedno od izabranih jela više nije dostupno.' });
    return;
  }

  const resolvedItems = lineItems as NonNullable<(typeof lineItems)[number]>[];
  const subtotal = Number(resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const deliveryFee = order.fulfillmentType === 'delivery' ? deliveryFees[order.deliveryZone!] : 0;
  const total = Number((subtotal + deliveryFee).toFixed(2));
  const paymentStatus = 'pending';
  const client = await pool.connect();

  try {
    await client.query('begin');
    const existing = await client.query(
      `select id, order_number, subtotal, delivery_fee, discount, total, payment_status, payment_method, created_at
       from orders where idempotency_key = $1`,
      [order.idempotencyKey],
    );

    if (existing.rowCount) {
      await client.query('commit');
      const current = existing.rows[0];
      response.status(200).json({ order: {
        id: current.id, orderNumber: current.order_number, subtotal: Number(current.subtotal), deliveryFee: Number(current.delivery_fee),
        discount: Number(current.discount), total: Number(current.total), paymentStatus: current.payment_status, paymentMethod: current.payment_method, createdAt: current.created_at,
      } });
      return;
    }

    const orderNumber = `SVR-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const inserted = await client.query(
      `insert into orders (
        order_number, idempotency_key, customer_first_name, customer_last_name, email, phone, fulfillment_type, pickup_time,
        address, city, postal_code, apartment, customer_note, delivery_note, delivery_zone, subtotal, delivery_fee, discount,
        total, payment_status, payment_method
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 0, $18, $19, $20)
      returning id, order_number, subtotal, delivery_fee, discount, total, payment_status, payment_method, created_at`,
      [orderNumber, order.idempotencyKey, order.customer.firstName, order.customer.lastName, order.customer.email, order.customer.phone,
        order.fulfillmentType, order.customer.pickupTime || null, order.customer.address || null, order.customer.city || null,
        order.customer.postalCode || null, order.customer.apartment || null, order.customer.note || null, order.customer.deliveryNote || null,
        order.deliveryZone || null, subtotal, deliveryFee, total, paymentStatus, order.paymentMethod],
    );
    const savedOrder = inserted.rows[0];

    for (const item of resolvedItems) {
      await client.query(
        `insert into order_items (order_id, product_id, product_name_snapshot, quantity, unit_price, line_total)
         values ($1, $2, $3, $4, $5, $6)`,
        [savedOrder.id, item.id, item.name, item.quantity, item.price, item.lineTotal],
      );
    }

    await client.query(
      `insert into payments (order_id, provider, amount, status, payment_method, card_brand, card_last4, transaction_reference)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [savedOrder.id, order.paymentMethod === 'cash' ? 'cash' : 'demo', total, paymentStatus, order.paymentMethod,
        order.paymentMethod === 'card' ? order.cardBrand : null, order.paymentMethod === 'card' ? order.cardLast4 : null,
        order.paymentMethod === 'card' ? `DEMO-${savedOrder.order_number}` : null],
    );

    await client.query('commit');
    response.status(201).json({ order: {
      id: savedOrder.id, orderNumber: savedOrder.order_number, subtotal: Number(savedOrder.subtotal), deliveryFee: Number(savedOrder.delivery_fee),
      discount: Number(savedOrder.discount), total: Number(savedOrder.total), paymentStatus: savedOrder.payment_status,
      paymentMethod: savedOrder.payment_method, createdAt: savedOrder.created_at,
    } });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
});

const staticDir = path.resolve(process.cwd(), 'dist');
app.use(express.static(staticDir));

app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(staticDir, 'index.html'));
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Something went wrong while processing the request.' });
});

app.listen(port, () => {
  console.log(`Savorelle server listening on http://localhost:${port}`);
});
