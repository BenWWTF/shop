'use client';

import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-neon-blue bg-dark-card bg-opacity-50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="glitch text-2xl font-bold" data-text="SHOP.ZURLEGENDE">
              SHOP.ZURLEGENDE
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="glitch text-4xl font-bold mb-8" data-text="CHECKOUT">
          CHECKOUT
        </h1>

        <div className="neon-card">
          <p className="terminal-text text-lg text-neon-green mb-6">
            » STRIPE INTEGRATION COMING SOON
          </p>

          <p className="text-neon-blue mb-8">
            The checkout page is being configured with Stripe payment processing.
            This will be completed in Phase 4.
          </p>

          <p className="text-neon-purple mb-8 text-sm">
            Features that will be available:
          </p>

          <ul className="text-neon-blue text-sm space-y-2 mb-8 ml-4">
            <li>✓ Shipping address entry</li>
            <li>✓ Billing address entry</li>
            <li>✓ Stripe payment element</li>
            <li>✓ Order confirmation</li>
            <li>✓ Email notifications</li>
          </ul>

          <div className="flex gap-4">
            <Link href="/cart" className="neon-btn">
              BACK TO CART
            </Link>
            <Link href="/products" className="neon-btn border-neon-blue border text-neon-blue">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
