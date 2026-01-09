'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, total, subtotal, removeItem, updateQuantity, getItemCount } =
    useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="terminal-text">» LOADING CART...</p>
      </div>
    );
  }

  const itemCount = getItemCount();

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
          <nav className="flex gap-4">
            <Link href="/products" className="text-neon-blue hover:text-neon-pink transition">
              PRODUCTS
            </Link>
            <Link href="/cart" className="text-neon-pink font-bold">
              CART ({itemCount})
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="border-b border-neon-blue bg-dark-card bg-opacity-30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="glitch text-3xl font-bold" data-text="SHOPPING CART">
            SHOPPING CART
          </h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="terminal-text text-xl text-neon-blue mb-8">
              » YOUR CART IS EMPTY
            </p>
            <Link href="/products" className="neon-btn inline-block">
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="neon-card flex items-center justify-between hover:border-neon-pink transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neon-pink mb-1">
                        {item.title}
                      </h3>
                      <p className="text-neon-blue text-sm mb-3">
                        Price: ${(item.price / 100).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-neon-purple rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="px-3 py-1 hover:bg-neon-purple hover:bg-opacity-20 transition"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-neon-purple hover:bg-opacity-20 transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neon-pink hover:text-neon-blue transition text-sm font-bold ml-auto"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <p className="text-neon-green font-bold text-lg">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="neon-card sticky top-24">
                <h2 className="text-xl font-bold text-neon-pink mb-6 pb-4 border-b border-neon-blue">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neon-blue">
                    <span>Subtotal:</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neon-blue">
                    <span>Items:</span>
                    <span>{itemCount}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-neon-purple">
                  <div className="flex justify-between mb-6 text-xl">
                    <span className="text-neon-green font-bold">Total:</span>
                    <span className="text-neon-green font-bold">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>

                  <Link href="/checkout" className="neon-btn w-full block text-center py-3 mb-4">
                    PROCEED TO CHECKOUT
                  </Link>

                  <Link
                    href="/products"
                    className="w-full block text-center py-3 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:bg-opacity-10 transition"
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-neon-blue">
                  <p className="text-xs text-neon-blue text-center">
                    » Shipping & taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
