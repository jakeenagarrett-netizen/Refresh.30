
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature')!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
  // Extend: mark user subscription in DB
  console.log('Stripe event:', event.type);
  return NextResponse.json({ received: true });
}
export const config = { api: { bodyParser: false } } as any;
