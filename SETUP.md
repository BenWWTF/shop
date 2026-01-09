# Phase 1: Setup Complete! 🎉

Your project structure is ready. Here's what's been created:

```
shop-zurlegende/
├── backend/              # Ready for Medusa setup
│   └── Dockerfile.dev    # Development container
├── frontend/             # Ready for Next.js setup
│   └── Dockerfile.dev    # Development container
├── docker/               # Docker utilities folder
├── docker-compose.yml    # Local dev environment (PostgreSQL + Medusa + Frontend)
├── .env.example          # Copy to .env and fill in your values
├── .gitignore            # Git ignore rules
├── README.md             # Full documentation
└── SETUP.md              # This file
```

---

## Next Steps

### Step 1: Create GitHub Repository (Manual)

1. Go to https://github.com/new
2. Create repository: `shop-zurlegende`
3. Choose: **Public** (for open-source showcase) or **Private** (for confidentiality)
4. **Do NOT initialize** with README, .gitignore, or license (we have them locally)
5. Click **Create repository**

After creating:
```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende

# Add remote and push
git remote add origin https://github.com/[YOUR-USERNAME]/shop-zurlegende.git
git add .
git commit -m "Initial commit: Phase 1 project structure"
git branch -M main
git push -u origin main
```

---

### Step 2: Create Environment File

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende

# Copy the example
cp .env.example .env

# Edit .env and fill in values
nano .env  # or use your editor
```

**Key values to set:**
```env
# Database (these can stay default for local dev)
DB_PASSWORD=medusa_dev_password

# Stripe (REQUIRED - get from https://dashboard.stripe.com)
STRIPE_API_KEY=sk_test_...         # Your secret key
STRIPE_WEBHOOK_SECRET=whsec_...    # Your webhook secret

# Medusa (can use any random strings for local dev)
JWT_SECRET=super_secret_jwt_key_min_32_chars_here
COOKIE_SECRET=super_secret_cookie_key_min_32_chars

# Frontend
NEXT_PUBLIC_STRIPE_KEY=pk_test_... # Your publishable key
```

**Getting Stripe Keys:**
1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy `Secret key` → STRIPE_API_KEY
4. Copy `Publishable key` → NEXT_PUBLIC_STRIPE_KEY
5. Create a webhook endpoint (add later, or skip for now)

---

### Step 3: Initialize Medusa Backend

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende/backend

# Create a new Medusa project
npx create-medusa-app@latest . --skip-db --no-seed
```

This will:
- Create `medusa.config.js`
- Create `src/` directory with API structure
- Create `package.json`
- Install all dependencies

**Expected output:**
```
✔ Creating project
✔ Installing dependencies
✔ Project created at /Users/Missbach/Desktop/claude/shop-zurlegende/backend
```

---

### Step 4: Initialize Next.js Frontend

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende/frontend

# Create a new Next.js project
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --eslint
```

When prompted:
```
✔ TypeScript? ... Yes
✔ Tailwind CSS? ... Yes
✔ ESLint? ... Yes
✔ src/ directory? ... No
```

This will:
- Create Next.js app structure with App Router
- Set up TypeScript
- Set up Tailwind CSS
- Create `package.json`
- Install all dependencies

---

### Step 5: Install Additional Frontend Dependencies

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende/frontend

npm install @stripe/react-stripe-js stripe axios zustand
```

- **@stripe/react-stripe-js** - Stripe React components
- **stripe** - Stripe SDK
- **axios** - HTTP client (alternative to fetch)
- **zustand** - Lightweight state management for cart

---

### Step 6: Verify Project Structure

After Medusa and Next.js initialization, verify:

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende

# Check backend
ls backend/
# Should show: medusa.config.js, src/, package.json, etc.

# Check frontend
ls frontend/
# Should show: app/, components/, styles/, package.json, etc.

# View full tree
tree -L 2 -a
```

---

### Step 7: Test Docker Setup

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende

# Start services (takes 2-3 minutes on first run)
docker-compose up --build

# Wait for output like:
# medusa   | ready - started server on 0.0.0.0:9000
# frontend | ready - started server on 0.0.0.0:3000
```

If successful, visit:
- http://localhost:3000 (Next.js frontend)
- http://localhost:9000 (Medusa API)
- http://localhost:9000/admin (Medusa admin panel)

**Stop services:**
```bash
# Ctrl+C in the terminal, or in another terminal:
docker-compose down
```

---

### Step 8: Commit Phase 1

```bash
cd /Users/Missbach/Desktop/claude/shop-zurlegende

git add .
git commit -m "Phase 1 complete: Medusa backend and Next.js frontend initialized"
git push origin main
```

---

## Troubleshooting Phase 1

### "npx: command not found"
- Ensure Node.js is installed: `node --version` (should be 18+)
- Try: `npm install -g npx`

### Docker won't start
- Ensure Docker Desktop is running
- Check logs: `docker-compose logs postgres`
- Try rebuilding: `docker-compose down && docker-compose up --build`

### Port already in use
- **3000 (frontend):** `lsof -ti:3000 | xargs kill -9`
- **9000 (medusa):** `lsof -ti:9000 | xargs kill -9`
- **5432 (postgres):** `lsof -ti:5432 | xargs kill -9`

### npm install fails
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Clear npm cache: `npm cache clean --force`
- Reinstall: `npm install`

### Medusa admin won't load
- Wait 20-30 seconds after medusa service starts (it compiles admin)
- Check medusa logs: `docker-compose logs medusa`
- Try clearing browser cache

---

## What's Next?

Once Phase 1 is complete and verified:

### Phase 2: Configure Medusa Backend
- Set up Stripe plugin
- Create database migrations
- Define product models
- Create initial products

### Phase 3: Build Next.js Frontend
- Copy zur-legende styles and effects
- Build product catalog UI
- Create shopping cart
- Implement Stripe checkout

See `SHOP_IMPLEMENTATION_PLAN.md` for detailed Phase 2-7 instructions.

---

## Quick Command Reference

```bash
# Navigate to project
cd /Users/Missbach/Desktop/claude/shop-zurlegende

# Local development (without Docker)
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Docker development
docker-compose up --build    # One terminal for all services
docker-compose down          # Stop all services

# View logs
docker-compose logs -f medusa
docker-compose logs -f frontend
docker-compose logs -f postgres

# Database access
docker-compose exec postgres psql -U medusa_user -d medusa_shop

# View all containers
docker-compose ps
```

---

## Important Notes

⚠️ **Do NOT commit `.env` file to Git!**
- Add it to `.gitignore` (already done)
- Use `.env.example` as template
- Each person/server gets their own `.env`

✅ **Commit these files:**
- `backend/` - Source code
- `frontend/` - Source code
- `docker-compose.yml` - Configuration
- `.env.example` - Template (no secrets)
- `README.md`, `SETUP.md` - Documentation

---

## You're Ready! 🚀

Phase 1 is complete. You have:
- ✅ Project structure created
- ✅ Git initialized
- ✅ Docker environment ready
- ✅ Environment template configured
- ✅ Documentation in place

**Next:** Follow Step 3-8 above to initialize Medusa and Next.js, then move to Phase 2.

Need help? Refer to README.md or SHOP_IMPLEMENTATION_PLAN.md.
