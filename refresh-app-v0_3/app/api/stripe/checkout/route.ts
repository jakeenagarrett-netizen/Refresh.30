
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: { userId }
  });
  return NextResponse.json({ url: session.url });
}
