'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { medusaClient } from '@/lib/medusa-client';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await medusaClient.getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
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
            <h1 className="glitch text-2xl font-bold" data-text="SHOP.ZURLEGENDE">
              SHOP.ZURLEGENDE
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link href="/products" className="text-neon-pink font-bold">
              PRODUCTS
            </Link>
            <Link href="/cart" className="neon-btn text-sm py-2 px-3">
              CART
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="border-b border-neon-blue bg-dark-card bg-opacity-30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="glitch text-4xl font-bold mb-2" data-text="PRODUCT CATALOG">
            PRODUCT CATALOG
          </h1>
          <p className="terminal-text text-neon-green">
            » {products.length} ITEMS IN STOCK
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="terminal-text text-lg animate-pulse">
              » LOADING CATALOG...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-neon-pink text-lg">{error}</p>
            <Link href="/" className="neon-btn mt-4 inline-block">
              RETURN HOME
            </Link>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="neon-card cursor-pointer h-full hover:scale-105 transition-transform">
                  {product.images?.[0]?.url ? (
                    <div className="mb-4 h-64 bg-dark-bg rounded overflow-hidden relative">
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent opacity-0 hover:opacity-60 transition" />
                    </div>
                  ) : (
                    <div className="mb-4 h-64 bg-gradient-to-br from-neon-pink to-neon-blue rounded flex items-center justify-center">
                      <span className="text-2xl text-neon-green font-bold">
                        IMAGE
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-neon-pink mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="text-sm text-neon-blue mb-4 line-clamp-3">
                    {product.description || 'Premium synthwave apparel'}
                  </p>

                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-neon-green font-bold mb-2">
                        VARIANTS AVAILABLE: {product.variants.length}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.slice(0, 3).map((variant: any) => (
                          <span
                            key={variant.id}
                            className="text-xs bg-dark-bg border border-neon-purple px-2 py-1 rounded"
                          >
                            {variant.title}
                          </span>
                        ))}
                        {product.variants.length > 3 && (
                          <span className="text-xs bg-dark-bg border border-neon-purple px-2 py-1 rounded">
                            +{product.variants.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-neon-green font-bold text-lg">
                    $
                    {product.variants?.[0]?.prices?.[0]?.amount
                      ? (product.variants[0].prices[0].amount / 100).toFixed(2)
                      : '0.00'}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neon-blue">
                    <button className="w-full neon-btn py-2 text-sm">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="terminal-text text-xl text-neon-pink">
              » NO PRODUCTS FOUND
            </p>
            <p className="text-neon-blue mt-4 mb-8">
              Create some products in the admin panel to get started
            </p>
            <Link href="/" className="neon-btn inline-block">
              RETURN HOME
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
