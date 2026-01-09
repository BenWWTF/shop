# Shop.ZurLegende - Medusa Backend

Medusa.js e-commerce engine configured for selling pullovers and sweatshirts with Stripe payment processing.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- Stripe account

### Development Setup

#### Option 1: Docker (Recommended)
```bash
cd ..  # Go to project root
docker-compose up --build
# Medusa runs on http://localhost:9000
```

#### Option 2: Local Setup
```bash
# Install dependencies
npm install

# Create .env file
cp ../.env.example .env
# Edit .env with your PostgreSQL and Stripe credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
# Medusa runs on http://localhost:9000
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── api/                  # Custom API endpoints
│   ├── models/               # Custom data models
│   ├── migrations/           # Database migrations
│   ├── services/             # Business logic
│   └── subscribers/          # Event handlers
├── scripts/
│   └── seed.ts              # Database seeding script
├── medusa.config.js         # Medusa configuration
├── tsconfig.json            # TypeScript config
├── package.json
└── Dockerfile.dev           # Development container
```

## Available Commands

```bash
# Development
npm run dev                  # Start development server

# Building
npm run build               # Compile TypeScript

# Database
npm run migrate             # Run migrations
npm run seed                # Seed sample products

# Testing
npm test                    # Run tests
```

## Configuration

### Environment Variables

Required in `.env`:
```env
DATABASE_URL=postgres://medusa_user:password@localhost:5432/medusa_shop
STRIPE_API_KEY=sk_test_...
JWT_SECRET=your_secret_here
COOKIE_SECRET=your_secret_here
```

Optional:
```env
MEDUSA_BACKEND_URL=http://localhost:9000
NODE_ENV=development
LOG_LEVEL=debug
```

## Stripe Integration

Medusa automatically handles Stripe integration when configured:

1. Get API keys from https://dashboard.stripe.com
2. Add `STRIPE_API_KEY` to `.env`
3. Payment processing happens automatically at checkout

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Database

### PostgreSQL Connection
Medusa connects to PostgreSQL using `DATABASE_URL`.

**Connection string format:**
```
postgres://[user]:[password]@[host]:[port]/[database]
```

### Running Migrations
```bash
npm run migrate
```

This creates all necessary tables. Medusa uses TypeORM for ORM.

### Database Access
```bash
# Local PostgreSQL
psql -U medusa_user -d medusa_shop

# Docker PostgreSQL
docker-compose exec postgres psql -U medusa_user -d medusa_shop
```

## Adding Products

### Via Admin Dashboard
1. Navigate to http://localhost:9000/admin (or :9000/admin in Docker)
2. Create admin account on first login
3. Go to Products → Create Product
4. Fill in details: title, description, images, price
5. Add variants: sizes (XS-XXL), colors (Black, Cyan, Pink, etc.)
6. Save

### Example Products

**Product 1: Classic Pullover**
- Title: Classic Black Pullover
- Description: Timeless black pullover with embroidered logo
- Price: 49.99
- Variants:
  - Size: XS, S, M, L, XL, XXL
  - Color: Black, Navy, Maroon

**Product 2: Retro Grid Sweatshirt**
- Title: Retro Grid Sweatshirt
- Description: 80s inspired grid pattern sweatshirt
- Price: 54.99
- Variants:
  - Size: S, M, L, XL, XXL
  - Color: Black, Cyan, Purple, Pink

## API Endpoints

Medusa provides REST and GraphQL APIs. Common store endpoints:

**Store API (for frontend):**
- `GET /store/products` - List products
- `GET /store/products/:id` - Get product details
- `POST /store/carts` - Create cart
- `GET /store/carts/:id` - Get cart
- `POST /store/carts/:id/line-items` - Add to cart
- `DELETE /store/carts/:id/line-items/:line_id` - Remove from cart
- `POST /store/carts/:id/payment-sessions` - Initiate payment

**Admin API (requires authentication):**
- `GET /admin/products` - List all products
- `POST /admin/products` - Create product
- `GET /admin/orders` - List orders
- `GET /admin/orders/:id` - Get order details

Full API docs: https://medusajs.com/api/store

## Troubleshooting

### "Cannot connect to database"
```bash
# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -U medusa_user -d medusa_shop
```

### "Admin won't load"
- Wait 30 seconds after starting (it compiles admin UI)
- Clear browser cache
- Check: http://localhost:9000/admin

### "Stripe key not found"
- Ensure `.env` has `STRIPE_API_KEY`
- Restart server: `npm run dev`

### Port already in use
```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
npm run dev
```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/add-collections
```

### 2. Make Changes
- Add migrations in `src/migrations/`
- Add API routes in `src/api/`
- Add services in `src/services/`

### 3. Test Changes
```bash
npm run dev
# Test in Admin: http://localhost:9000/admin
# Test via API: curl http://localhost:9000/store/products
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: add product collections"
git push origin feature/add-collections
```

## Docker Commands

```bash
# From project root:
docker-compose up --build          # Start services
docker-compose logs -f medusa      # View logs
docker-compose exec medusa bash    # Access container shell
docker-compose down                # Stop services
```

## Next Steps

1. ✅ Medusa backend initialized
2. Configure `.env` with Stripe keys
3. Run `npm run migrate` to set up database
4. Start `npm run dev` and create first products
5. Test API endpoints
6. Move to Phase 3: Next.js Frontend

## Resources

- Medusa Docs: https://medusajs.com/docs
- Medusa Store API: https://medusajs.com/api/store
- Stripe Docs: https://stripe.com/docs
- TypeORM Docs: https://typeorm.io

## License

MIT
