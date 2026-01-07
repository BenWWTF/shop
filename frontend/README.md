# Shop.ZurLegende - Next.js Frontend

Premium synthwave e-commerce storefront built with Next.js 15, React 19, and TypeScript. Connected to Medusa.js backend with Stripe payment processing.

## Features

✨ **Synthwave Aesthetic**
- WebGL-inspired neon effects
- Glitch animations and CRT scanlines
- Responsive design for all devices
- Dark mode (always on, by design)

🛍️ **E-Commerce Functionality**
- Product catalog with search
- Shopping cart with persistent storage
- Stripe payment integration (in progress)
- Order tracking

⚡ **Performance**
- Server-side rendering (SSR)
- Static generation for products
- Image optimization
- Fast page loads

## Quick Start

### Prerequisites
- Node.js 18+
- Medusa backend running on http://localhost:9000

### Development

#### Option 1: Docker (Recommended)
```bash
# From project root
docker-compose up --build

# Frontend runs on http://localhost:3000
```

#### Option 2: Local
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout wrapper
│   ├── page.tsx            # Home page
│   ├── (shop)/             # Shop routes
│   │   ├── products/
│   │   │   ├── page.tsx    # Product catalog
│   │   │   └── [id]/       # Product detail (coming soon)
│   │   ├── cart/page.tsx   # Shopping cart
│   │   └── checkout/page.tsx # Stripe checkout
│   └── api/                # API routes (for webhooks)
│
├── components/             # React components
│   └── .gitkeep           # Placeholder (add components here)
│
├── lib/                    # Utilities & hooks
│   ├── medusa-client.ts   # Medusa API client
│   └── cart-store.ts      # Zustand cart state management
│
├── styles/                # CSS
│   └── globals.css        # Synthwave styling
│
├── public/                # Static assets
│
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS theme
├── tsconfig.json          # TypeScript config
├── postcss.config.js      # PostCSS plugins
├── package.json
└── README.md
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Building
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # TypeScript type checking

# Code Quality
npm run lint             # Run ESLint
```

## Configuration

### Environment Variables

Create `.env.local` (or add to `.env`):

```env
# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000

# Stripe Public Key (for checkout)
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

### Tailwind CSS

Synthwave color palette defined in `tailwind.config.ts`:

```typescript
colors: {
  neon: {
    pink: '#FF00FF',
    blue: '#00FFFF',
    purple: '#9D00FF',
    green: '#39FF14',
  },
  dark: {
    bg: '#0a0e27',
    card: '#1a1f3a',
  },
}
```

All colors available as utility classes:
- `text-neon-pink`, `text-neon-blue`, etc.
- `bg-neon-pink`, `bg-dark-bg`, etc.
- `border-neon-pink`, etc.

## Pages & Routes

### Home Page (`/`)
- Hero section with featured products
- Product showcase
- Call-to-action to browse catalog

### Products (`/products`)
- Grid of all products
- Product cards with images and prices
- Links to detailed product views
- Responsive grid (1, 2, 3 columns)

### Cart (`/cart`)
- View all cart items
- Adjust quantities
- Remove items
- Order summary
- Proceeds to checkout

### Checkout (`/checkout`)
- Shipping address entry (coming soon)
- Stripe payment form (coming soon)
- Order confirmation (coming soon)

## Medusa API Integration

The frontend connects to Medusa backend via REST API:

**API Client** (`lib/medusa-client.ts`):
- Product fetching
- Cart creation & management
- Payment sessions
- Shipping options

### Key Methods

```typescript
// Products
medusaClient.getProducts(limit?, offset?)
medusaClient.getProduct(id)
medusaClient.searchProducts(query)

// Cart
medusaClient.createCart()
medusaClient.getCart(cartId)
medusaClient.addToCart(cartId, variantId, quantity)
medusaClient.removeLineItem(cartId, lineId)
medusaClient.updateLineItem(cartId, lineId, quantity)

// Checkout
medusaClient.initializePaymentSession(cartId, email, shipping, billing)
medusaClient.completeCart(cartId)
```

## Cart State Management

Using **Zustand** for lightweight state management:

```typescript
// In any component:
import { useCart } from '@/lib/cart-store';

const { items, total, addItem, removeItem } = useCart();

// Add to cart
await useCart.getState().addItem(
  productId,
  variantId,
  title,
  price,
  quantity
);

// Remove from cart
await useCart.getState().removeItem(lineId);
```

Cart persists in `localStorage` with key `shop-cart`.

## Styling System

### Global Styles (`styles/globals.css`)

Pre-built CSS classes for synthwave aesthetic:

```html
<!-- Neon glow text with glitch effect -->
<h1 class="glitch" data-text="TEXT">TEXT</h1>

<!-- Neon button -->
<button class="neon-btn">Click Me</button>

<!-- Neon input field -->
<input class="neon-input" type="text" />

<!-- Neon card -->
<div class="neon-card">Content</div>

<!-- Terminal-like text -->
<p class="terminal-text">» System message</p>

<!-- Pulsing glow animation -->
<div class="pulse-glow">Glowing element</div>
```

### Tailwind Classes

Combine with Tailwind for custom styling:

```tsx
<div className="neon-card p-6 mb-4">
  <h2 className="text-neon-pink text-2xl font-bold mb-4">
    Title
  </h2>
  <button className="neon-btn w-full">
    Action
  </button>
</div>
```

## Stripe Integration (Phase 4)

Currently in progress. Will include:

1. **Payment Form** - Stripe Payment Element
2. **Address Entry** - Shipping & billing address forms
3. **Order Processing** - Cart completion via Medusa
4. **Confirmation** - Order summary & confirmation page
5. **Webhooks** - Handle Stripe payment events

### Setup Steps (When Ready)
```bash
npm install @stripe/stripe-js

# Add to app/checkout/page.tsx:
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
```

## Troubleshooting

### "Cannot connect to Medusa"
- Ensure Medusa is running: `http://localhost:9000`
- Check NEXT_PUBLIC_MEDUSA_URL in environment
- Check console for CORS errors

### Products not loading
- Verify Medusa backend is running
- Check browser console for API errors
- Ensure products exist in Medusa admin

### Cart not persisting
- Check browser localStorage (DevTools → Application → Local Storage)
- Ensure cookie/storage isn't disabled
- Check browser console for errors

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Restart dev server
- Check Tailwind config is loaded

## Performance Tips

### Image Optimization
Images are automatically optimized by Next.js. For best results:
1. Use square images (500x500px minimum)
2. JPG format for photos, PNG for graphics
3. Keep file size < 200KB

### Code Splitting
Next.js automatically code-splits per route. Large components can be lazy-loaded:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <p>Loading...</p>,
});
```

### Database Queries
Cache product fetches to reduce API calls:

```typescript
const products = await medusaClient.getProducts();
// Cached in browser memory during session
```

## Development Workflow

### Adding a New Page
```bash
# Create route in app/(shop)/new-page/
# File: app/(shop)/new-page/page.tsx

'use client';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Your content */}
    </div>
  );
}
```

### Adding a New Component
```bash
# Create in components/
# File: components/ProductCard.tsx

export default function ProductCard({ product }) {
  return (
    <div className="neon-card">
      {/* Component JSX */}
    </div>
  );
}

// Use in pages:
import ProductCard from '@/components/ProductCard';
```

### Updating Styles
1. Global styles: Edit `styles/globals.css`
2. Component styles: Use Tailwind classes
3. Theme colors: Update `tailwind.config.ts`

## Browser Support

- Chrome 90+
- Firefox 87+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Resources

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Zustand:** https://github.com/pmndrs/zustand
- **Stripe:** https://stripe.com/docs
- **Medusa API:** https://medusajs.com/api/store

## Related Documentation

- Backend README: `../backend/README.md`
- Implementation Plan: `../SHOP_IMPLEMENTATION_PLAN.md`
- Setup Instructions: `../SETUP.md`

## License

MIT

---

**Phase 3 Status:** Frontend structure complete with Medusa API integration
**Next Phase:** Phase 4 - Stripe Checkout Integration
