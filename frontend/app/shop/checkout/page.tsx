'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-store';
import CheckoutForm from '@/components/CheckoutForm';
import { CheckoutFormData, formatAddressForMedusa } from '@/lib/stripe-utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

type CheckoutStep = 'address' | 'payment' | 'loading';

export default function CheckoutPage() {
  const { id: cartId, items, total, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('address');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="terminal-text">» LOADING CHECKOUT...</p>
      </div>
    );
  }

  if (!cartId || items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <header className="border-b border-neon-blue bg-dark-card bg-opacity-50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="glitch text-2xl font-bold" data-text="SHOP.ZURLEGENDE">
                SHOP.ZURLEGENDE
              </h1>
            </Link>
          </div>
        </header>

        <section className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="glitch text-4xl font-bold mb-8" data-text="CHECKOUT">
            CHECKOUT
          </h1>

          <div className="neon-card">
            <p className="terminal-text text-lg text-neon-pink mb-6">
              » CART IS EMPTY
            </p>
            <p className="text-neon-blue mb-8">
              Please add items to your cart before checking out.
            </p>
            <Link href="/products" className="neon-btn inline-block">
              BACK TO SHOPPING
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleAddressSubmit = async (formData: CheckoutFormData) => {
    if (!cartId) return;

    setStep('loading');
    setError(null);

    try {
      const shippingAddress = formatAddressForMedusa(formData);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          email: formData.email,
          shippingAddress,
          billingAddress: shippingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(errorMsg);
      setStep('address');
    }
  };

  const handlePaymentSuccess = async () => {
    if (!cartId) return;

    try {
      const response = await fetch('/api/complete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete order');
      }

      const data = await response.json();
      clearCart();

      setTimeout(() => {
        window.location.href = `/order-confirmation?orderId=${data.orderId}`;
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Order completion failed';
      setError(errorMsg);
      setStep('payment');
    }
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="border-b border-neon-blue bg-dark-card bg-opacity-50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="glitch text-2xl font-bold" data-text="SHOP.ZURLEGENDE">
              SHOP.ZURLEGENDE
            </h1>
          </Link>
          <Link href="/cart" className="text-neon-blue hover:text-neon-pink transition">
            ← BACK TO CART
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="glitch text-4xl font-bold mb-12" data-text="SECURE CHECKOUT">
          SECURE CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div>
                <h2 className="text-2xl font-bold text-neon-pink mb-6">
                  SHIPPING ADDRESS
                </h2>
                <CheckoutForm onSubmit={handleAddressSubmit} isLoading={step === 'loading'} />
              </div>
            )}

            {step === 'payment' && clientSecret && (
              <div>
                <h2 className="text-2xl font-bold text-neon-pink mb-6">
                  PAYMENT METHOD
                </h2>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#FF00FF',
                        colorBackground: '#1a1f3a',
                        colorText: '#ffffff',
                        colorDanger: '#ff0000',
                      },
                    },
                  }}
                >
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            )}

            {step === 'loading' && (
              <div className="neon-card text-center py-12">
                <p className="terminal-text text-2xl animate-pulse">
                  » PROCESSING...
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="neon-card sticky top-24">
              <h2 className="text-xl font-bold text-neon-pink mb-6 pb-4 border-b border-neon-blue">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-neon-blue text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-neon-purple">
                <div className="flex justify-between mb-6 text-lg">
                  <span className="text-neon-green font-bold">Total:</span>
                  <span className="text-neon-green font-bold">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-neon-blue text-center mb-4">
                  ✓ Secure SSL encryption
                </p>
                <p className="text-xs text-neon-blue text-center">
                  ✓ Powered by Stripe
                </p>
              </div>

              {error && (
                <div className="mt-6 pt-6 border-t border-neon-pink">
                  <p className="text-neon-pink text-sm">⚠ {error}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-neon-blue">
                <button
                  onClick={() => window.history.back()}
                  className="w-full text-center py-2 text-neon-blue hover:text-neon-pink transition text-sm"
                >
                  CHANGE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
