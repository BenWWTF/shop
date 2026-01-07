const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = 9000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for this demo
let carts = {};
let cartPaymentSessions = {};

// Mock products database
const PRODUCTS = [
  {
    id: 'prod_1',
    title: 'Classic Zurlegende Pullover',
    handle: 'classic-pullover',
    description: 'Comfortable retro-styled pullover with zur-legende branding',
    price: 4999,
    images: [{ url: '/images/pullover1.jpg' }],
  },
  {
    id: 'prod_2',
    title: 'Neon Synthwave Sweatshirt',
    handle: 'neon-sweatshirt',
    description: 'Vibrant synthwave-inspired sweatshirt with glitch design',
    price: 5499,
    images: [{ url: '/images/sweatshirt1.jpg' }],
  },
  {
    id: 'prod_3',
    title: 'Retro Tech Hoodie',
    handle: 'retro-hoodie',
    description: 'Vintage-inspired hoodie with 80s aesthetic',
    price: 6999,
    images: [{ url: '/images/hoodie1.jpg' }],
  },
  {
    id: 'prod_4',
    title: 'Dark Mode Crewneck',
    handle: 'dark-crewneck',
    description: 'Minimalist dark crewneck perfect for the synthwave vibe',
    price: 4499,
    images: [{ url: '/images/crewneck1.jpg' }],
  },
  {
    id: 'prod_5',
    title: 'Neon Pink Oversized Tee',
    handle: 'neon-tee',
    description: 'Bold neon pink oversized t-shirt',
    price: 2999,
    images: [{ url: '/images/tee1.jpg' }],
  },
];

// ============================================
// PRODUCTS ENDPOINTS
// ============================================

app.get('/store/products', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  const sliced = PRODUCTS.slice(offsetNum, offsetNum + limitNum);

  res.json({
    products: sliced,
    count: PRODUCTS.length,
    offset: offsetNum,
  });
});

app.get('/store/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id || p.handle === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// ============================================
// CARTS ENDPOINTS
// ============================================

app.post('/store/carts', (req, res) => {
  const cartId = uuidv4();
  carts[cartId] = {
    id: cartId,
    items: [],
    total: 0,
    subtotal: 0,
    email: null,
    shipping_address: null,
    billing_address: null,
    payment_sessions: [],
  };

  res.status(201).json({ cart: carts[cartId] });
});

app.get('/store/carts/:id', (req, res) => {
  const cart = carts[req.params.id];
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  res.json({ cart });
});

app.post('/store/carts/:id/line-items', (req, res) => {
  const { variant_id, quantity } = req.body;
  const cart = carts[req.params.id];

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const product = PRODUCTS.find(p => p.id === variant_id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check if item already in cart
  const existingItem = cart.items.find(item => item.variant_id === variant_id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: uuidv4(),
      variant_id,
      product_id: product.id,
      title: product.title,
      price: product.price,
      quantity,
    });
  }

  // Recalculate total
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.total = cart.subtotal;

  res.json({ cart });
});

app.delete('/store/carts/:id/line-items/:line_id', (req, res) => {
  const cart = carts[req.params.id];

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item.id !== req.params.line_id);

  // Recalculate total
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.total = cart.subtotal;

  res.json({ cart });
});

// ============================================
// PAYMENT SESSIONS
// ============================================

app.post('/store/carts/:id/payment-sessions', async (req, res) => {
  const { email, shipping_address, billing_address } = req.body;
  const cart = carts[req.params.id];

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.email = email;
  cart.shipping_address = shipping_address;
  cart.billing_address = billing_address;

  // Simulate Stripe client secret (in real app, this would call Stripe API)
  const clientSecret = `pi_test_${uuidv4().substring(0, 8)}`;
  cart.payment_sessions = [
    {
      id: uuidv4(),
      provider_id: 'stripe',
      data: { client_secret: clientSecret },
    },
  ];

  cartPaymentSessions[req.params.id] = clientSecret;

  res.json({
    success: true,
    clientSecret,
    cartId: req.params.id,
    total: cart.total,
  });
});

// ============================================
// ORDER COMPLETION
// ============================================

app.post('/store/carts/:id/complete', (req, res) => {
  const cart = carts[req.params.id];

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  if (!cart.email || !cart.shipping_address) {
    return res.status(400).json({ error: 'Missing required cart data' });
  }

  // Create order from cart
  const orderId = `ord_${uuidv4().substring(0, 12)}`;
  const order = {
    id: orderId,
    display_id: Math.floor(Math.random() * 100000),
    email: cart.email,
    total: cart.total,
    subtotal: cart.subtotal,
    items: cart.items,
    shipping_address: cart.shipping_address,
    billing_address: cart.billing_address,
    status: 'pending',
    created_at: new Date(),
  };

  // Clean up cart
  delete carts[req.params.id];

  res.json({
    success: true,
    order,
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'medusa-mock' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Zurlegende Shop Backend (Mock) - Ready to process orders!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Mock Medusa Backend listening on http://localhost:${PORT}`);
  console.log(`✓ Ready to serve: /store/products, /store/carts, /store/payments`);
  console.log(`✓ Frontend connected: http://localhost:3000`);
});
