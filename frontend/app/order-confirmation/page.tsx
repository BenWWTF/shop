'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <p className="terminal-text">» LOADING ORDER DETAILS...</p>
      </div>
    );
  }

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

      {/* Success Message */}
      <section className="max-w-2xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6 animate-bounce">✓</div>
          <h1 className="glitch text-5xl font-bold mb-4" data-text="ORDER CONFIRMED">
            ORDER CONFIRMED
          </h1>
          <p className="terminal-text text-neon-green text-xl mb-2">
            » PAYMENT SUCCESSFUL
          </p>
          <p className="text-neon-blue text-lg">
            Thank you for your purchase!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="neon-card mb-8">
          <div className="border-b border-neon-purple pb-6 mb-6">
            <p className="text-neon-blue text-sm mb-2">Order Number</p>
            <p className="text-neon-pink font-bold text-2xl">{orderId || 'Loading...'}</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-neon-blue text-sm mb-1">Status</p>
              <p className="text-neon-green font-bold">✓ PAID</p>
            </div>

            <div>
              <p className="text-neon-blue text-sm mb-1">Next Steps</p>
              <ul className="text-neon-purple space-y-1 text-sm">
                <li>» Order processing started</li>
                <li>» You will receive a confirmation email shortly</li>
                <li>» Tracking information will be sent when item ships</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email Notification */}
        <div className="neon-card bg-dark-bg bg-opacity-50 border-neon-blue mb-8">
          <p className="terminal-text text-neon-blue text-sm mb-2">
            » Email Confirmation
          </p>
          <p className="text-neon-green">
            A detailed receipt and shipping information will be sent to your email
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/products" className="neon-btn block text-center py-3">
            CONTINUE SHOPPING
          </Link>
          <Link href="/" className="neon-btn block text-center py-3 border border-neon-blue text-neon-blue">
            BACK HOME
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 pt-12 border-t border-neon-purple">
          <h2 className="text-2xl font-bold text-neon-pink mb-6">FAQ</h2>

          <div className="space-y-4">
            <div className="neon-card">
              <h3 className="text-neon-blue font-bold mb-2">When will my item ship?</h3>
              <p className="text-neon-purple text-sm">
                Orders typically ship within 2-3 business days. You'll receive a tracking number via email.
              </p>
            </div>

            <div className="neon-card">
              <h3 className="text-neon-blue font-bold mb-2">Can I change my order?</h3>
              <p className="text-neon-purple text-sm">
                Contact us immediately if you need to make changes. We may be able to help if your order hasn't shipped yet.
              </p>
            </div>

            <div className="neon-card">
              <h3 className="text-neon-blue font-bold mb-2">What's your return policy?</h3>
              <p className="text-neon-purple text-sm">
                We offer 30-day returns on most items. Check your order confirmation email for complete details.
              </p>
            </div>

            <div className="neon-card">
              <h3 className="text-neon-blue font-bold mb-2">Need help?</h3>
              <p className="text-neon-purple text-sm">
                Contact our support team at support@zurlegende.com for any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-pink bg-dark-card bg-opacity-30 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="terminal-text text-sm">
            » SHOP.ZURLEGENDE | ORDER CONFIRMED
          </p>
        </div>
      </footer>
    </div>
  );
}
