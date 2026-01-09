# Shop.ZurLegende - E-Commerce Platform

Synthwave-aesthetic e-commerce platform for selling pullovers and sweatshirts. Built with Medusa.js (open-source commerce backend), Next.js 15 (custom storefront), PostgreSQL, and Stripe integration.

**Live:** `shop.zurlegende.hinterbuchinger.com`

## Stack

- **Backend:** Medusa.js (Node.js e-commerce engine)
- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Database:** PostgreSQL 15
- **Payments:** Stripe
- **Deployment:** Docker + Docker Compose
- **Style:** Synthwave/Retro-futuristic aesthetic (inspired by zur-legende)

## Project Structure

```
shop-zurlegende/
├── backend/                 # Medusa API (commerce logic)
│   ├── src/
│   │   ├── api/            # REST endpoints
│   │   ├── models/         # Database models
│   │   └── admin/          # Admin panel (optional)
│   ├── medusa.config.js
│   ├── package.json
│   └── Dockerfile.dev      # Development container
│
├── frontend/                # Next.js storefront
│   ├── app/                # Next.js App Router
│   │   ├── (shop)/         # Shop routes
│   │   ├── page.tsx        # Home
│   │   └── layout.tsx      # Global layout
│   ├── components/         # React components
│   ├── lib/                # Utilities (API client, hooks)
│   ├── styles/             # Global CSS + synthwave theme
│   ├── public/             # Static assets
│   ├── package.json
│   └── Dockerfile.dev      # Development container
│
├── docker/                  # Docker configuration (if needed)
├── docker-compose.yml       # Local dev environment
├── .env.example            # Environment variables template
├── .gitignore
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ (or Docker)
- PostgreSQL 15+ (or use Docker)
- Stripe account (for payment testing)
- Git

### Option 1: Local Development (without Docker)

#### 1. Clone Repository
```bash
git clone https://github.com/[username]/shop-zurlegende.git
cd shop-zurlegende
```

#### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your values:
# - Database credentials
# - Stripe keys
# - Medusa secrets (JWT, COOKIE)
```

#### 3. Setup PostgreSQL
```bash
# Create database and user
createdb medusa_shop
createuser medusa_user
psql medusa_shop -c "ALTER USER medusa_user WITH PASSWORD 'your_password';"
```

#### 4. Install Backend
```bash
cd backend
npm install
npm run migrate
npm run seed        # Optional: create sample products
npm run dev         # Runs on http://localhost:9000
```

#### 5. Install Frontend
```bash
cd frontend
npm install
npm run dev         # Runs on http://localhost:3000
```

#### 6. Access the Application
- **Storefront:** http://localhost:3000
- **Medusa API:** http://localhost:9000
- **Medusa Admin:** http://localhost:9000/admin

---

### Option 2: Docker Development (Recommended)

#### 1. Clone Repository
```bash
git clone https://github.com/[username]/shop-zurlegende.git
cd shop-zurlegende
```

#### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your values (or use defaults for local dev)
```

#### 3. Start Services
```bash
docker-compose up --build
```

This will:
- Create PostgreSQL database
- Start Medusa backend on http://localhost:9000
- Start Next.js frontend on http://localhost:3000
- Create docker network for service communication

#### 4. Access the Application
- **Storefront:** http://localhost:3000
- **Medusa API:** http://localhost:9000
- **Medusa Admin:** http://localhost:9000/admin

#### 5. Stop Services
```bash
docker-compose down
```

---

## Useful Commands

### Backend (Medusa)

```bash
cd backend

# Development
npm run dev              # Start development server

# Database
npm run migrate          # Run migrations
npm run seed            # Seed sample data
npm run revert-migration # Rollback last migration

# Building
npm run build           # Build for production
npm start               # Start production server

# Admin Panel
# Access at http://localhost:9000/admin
# Create first admin user during onboarding
```

### Frontend (Next.js)

```bash
cd frontend

# Development
npm run dev             # Start dev server with hot reload
npm run build           # Build for production
npm run start           # Start production server

# Linting & Formatting
npm run lint            # ESLint check
npm run format          # Prettier formatting
```

### Docker

```bash
# Build and start
docker-compose up --build

# Start (if already built)
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f medusa      # Medusa logs
docker-compose logs -f frontend    # Frontend logs
docker-compose logs -f postgres    # Database logs

# Access container shell
docker-compose exec medusa bash
docker-compose exec frontend bash
docker-compose exec postgres psql -U medusa_user -d medusa_shop
```

---

## Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

```env
# Database
DATABASE_URL=postgres://user:password@host:5432/medusa_shop

# Medusa
MEDUSA_BACKEND_URL=http://localhost:9000
JWT_SECRET=your-secret-here

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

### Stripe Configuration

1. Create Stripe account: https://stripe.com
2. Get API keys from dashboard
3. Add keys to `.env`
4. Test payments using Stripe test cards:
   - `4242 4242 4242 4242` (success)
   - `4000 0000 0000 0002` (decline)

### Database

PostgreSQL automatically initializes in Docker. For local development:

```bash
# Connect to database
psql -U medusa_user -d medusa_shop

# Common queries
\dt              # List tables
\d products      # Describe table structure
SELECT * FROM products LIMIT 5;  # View products
```

---

## Development Workflow

1. **Feature Branches:** Create feature branch from `main`
   ```bash
   git checkout -b feature/add-wishlist
   ```

2. **Development:** Make changes in backend/frontend as needed

3. **Testing:**
   - Backend: Test API endpoints
   - Frontend: Test in browser (http://localhost:3000)
   - Test Stripe payments in test mode

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add wishlist feature"
   git push origin feature/add-wishlist
   ```

5. **Pull Request:** Create PR, review, merge to main

6. **Deployment:** Deploy main branch to production

---

## Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Wait for postgres service to be healthy (docker-compose)

### "Stripe key not found"
- Ensure `.env` file exists (copy from `.env.example`)
- Add STRIPE_API_KEY and STRIPE_WEBHOOK_SECRET
- Restart services: `docker-compose restart medusa frontend`

### "Cannot connect to Medusa from frontend"
- Check NEXT_PUBLIC_MEDUSA_URL matches running Medusa URL
- Ensure Medusa is fully started (check logs)
- Check network connectivity: `curl http://localhost:9000`

### "Port already in use"
- Change port in docker-compose.yml or environment
- Or kill process: `lsof -ti:3000 | xargs kill -9`

---

## Deployment

See `SHOP_IMPLEMENTATION_PLAN.md` Phase 6 for detailed deployment instructions to production server.

Quick summary:
1. Push to GitHub
2. SSH into server
3. Clone repository
4. Create `.env` from `.env.example`
5. Configure Stripe for production
6. Run: `docker-compose -f docker-compose.prod.yml up -d`
7. Configure nginx reverse proxy
8. Set up SSL with Let's Encrypt

---

## API Documentation

### Medusa Store API

See Medusa documentation: https://medusajs.com/api/store

Key endpoints:
- `GET /store/products` - List all products
- `GET /store/products/:id` - Get product details
- `POST /store/carts` - Create cart
- `GET /store/carts/:id` - Get cart
- `POST /store/carts/:id/line-items` - Add to cart
- `POST /store/carts/:id/payment-sessions` - Initiate payment

### Custom Frontend API Routes

Next.js API routes at `/app/api/`:
- `POST /api/orders/webhook` - Stripe webhook handler
- More to be added...

---

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## License

MIT - Feel free to modify for your needs.

---

## Support

For issues:
1. Check troubleshooting section
2. Review environment variables
3. Check Docker logs: `docker-compose logs`
4. Review GitHub issues

---

## Resources

- **Medusa Docs:** https://medusajs.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Docs:** https://stripe.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Last Updated:** January 2026
**Version:** 1.0.0
