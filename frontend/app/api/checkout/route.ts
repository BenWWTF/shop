import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, email, shippingAddress, billingAddress } = body;

    if (!cartId || !email || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

    // Initialize payment session in Medusa
    const response = await fetch(
      `${medusaUrl}/store/carts/${cartId}/payment-sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: 'stripe',
          region_id: undefined, // Will be determined by Medusa
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Medusa payment session error:', error);
      return NextResponse.json(
        { error: 'Failed to initialize payment session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const cart = data.cart;

    // Get the payment session details
    const paymentSession = cart.payment_sessions?.[0];
    if (!paymentSession) {
      return NextResponse.json(
        { error: 'No payment session found' },
        { status: 400 }
      );
    }

    // Extract client secret from Stripe session data
    const clientSecret = paymentSession.data?.client_secret;
    if (!clientSecret) {
      return NextResponse.json(
        { error: 'Failed to get payment client secret' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        clientSecret,
        cartId: cart.id,
        total: cart.total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
