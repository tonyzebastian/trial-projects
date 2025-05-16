import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Create a PaymentIntent with the amount, currency, and specific payment method types
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents (i.e., $10.00)
      currency: 'usd',
      payment_method_types: ['card'],
      setup_future_usage: 'off_session', // Only allow card payments
    });

    // Return the client secret
    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}
