'use client';

import { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    // Handle payment result
    const handlePaymentResult = async () => {
      if (!stripe) return;

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      switch (paymentIntent?.status) {
        case 'succeeded':
          onSuccess();
          break;
        case 'processing':
          setErrorMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setErrorMessage('Your payment was not successful, please try again.');
          break;
        default:
          setErrorMessage('Something went wrong.');
          break;
      }
    };

    handlePaymentResult();
  }, [stripe, clientSecret, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Payment system not initialized');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="neon-card border-neon-pink bg-red-900 bg-opacity-20">
          <p className="text-neon-pink font-bold">✗ {errorMessage}</p>
        </div>
      )}

      <PaymentElement
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              name: '',
              email: '',
            },
          },
        }}
      />

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`neon-btn w-full py-3 text-lg font-bold transition ${
          isProcessing || !stripe || !elements
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-neon-pink'
        }`}
      >
        {isProcessing ? (
          <>
            <span className="inline-block animate-spin mr-2">⟳</span>
            PROCESSING PAYMENT...
          </>
        ) : (
          'COMPLETE PURCHASE'
        )}
      </button>

      <p className="text-neon-blue text-xs text-center">
        » Your payment is secure and encrypted
      </p>
    </form>
  );
}
