import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

    // Complete the cart/order in Medusa
    const response = await fetch(
      `${medusaUrl}/store/carts/${cartId}/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Medusa complete order error:', error);
      return NextResponse.json(
        { error: 'Failed to complete order' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const order = data.order;

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.display_id,
        email: order.email,
        total: order.total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Complete order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
