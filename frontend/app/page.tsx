'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { medusaClient } from '@/lib/medusa-client';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await medusaClient.getProducts(6);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-neon-blue bg-dark-card bg-opacity-50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="glitch text-3xl font-bold" data-text="SHOP.ZURLEGENDE">
              SHOP.ZURLEGENDE
            </h1>
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/products" className="text-neon-blue hover:text-neon-pink transition">
              PRODUCTS
            </Link>
            <Link href="/cart" className="neon-btn text-sm py-2 px-3">
              CART
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center z-10">
          <h1 className="glitch text-5xl md:text-7xl font-bold mb-4" data-text="LEGEND APPAREL">
            LEGEND APPAREL
          </h1>
          <p className="text-neon-blue text-xl md:text-2xl mb-8 terminal-text">
            » SYNTHWAVE AESTHETIC PULLOVERS & SWEATSHIRTS
          </p>
          <p className="text-neon-green text-lg mb-12 max-w-2xl mx-auto">
            Retro-futuristic fashion inspired by the legendary ZUR LEGENDE aesthetic
          </p>
          <Link href="/products" className="neon-btn text-lg">
            BROWSE COLLECTION
          </Link>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="glitch text-4xl font-bold mb-12 text-center" data-text="FEATURED ITEMS">
          FEATURED ITEMS
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <p className="terminal-text text-lg">» INITIALIZING CATALOG...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="neon-card cursor-pointer h-full hover:bg-opacity-80 transition">
                  {product.images?.[0]?.url ? (
                    <div className="mb-4 h-48 bg-dark-bg rounded overflow-hidden">
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 h-48 bg-gradient-to-br from-neon-pink to-neon-blue rounded flex items-center justify-center">
                      <span className="text-neon-green">NO IMAGE</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-neon-pink mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-neon-blue mb-4 line-clamp-2">
                    {product.description || 'Premium synthwave apparel'}
                  </p>
                  <p className="text-neon-green font-bold">
                    ${product.variants?.[0]?.prices?.[0]?.amount
                      ? (product.variants[0].prices[0].amount / 100).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="terminal-text text-lg">» NO PRODUCTS AVAILABLE YET</p>
            <p className="text-neon-blue mt-4">Check back soon for legendary items</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="glitch text-3xl font-bold mb-6" data-text="JOIN THE LEGEND">
          JOIN THE LEGEND
        </h2>
        <p className="text-neon-blue text-lg mb-8">
          Exclusive synthwave fashion for those who live in the eternal 80s
        </p>
        <Link href="/products" className="neon-btn text-lg">
          VIEW ALL PRODUCTS
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-pink bg-dark-card bg-opacity-30 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="terminal-text text-sm">
            » SHOP.ZURLEGENDE © 2026 | LEGEND STATUS: ACTIVE
          </p>
          <p className="text-neon-blue text-xs mt-2">
            Powered by Medusa Commerce
          </p>
        </div>
      </footer>
    </div>
  );
}
