// server.js — Example Node.js/Express backend for Stripe payments
// Install dependencies: npm install express stripe cors dotenv

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();

// Allow your frontend domain in production
app.use(cors({ origin: ['http://localhost:3000', 'https://yourdomain.com'] }));
app.use(express.json());

/**
 * 1. CREATE PAYMENT INTENT
 * The frontend calls this when the user clicks "Pay".
 * Stripe returns a client_secret that the frontend uses to confirm the payment securely.
 */
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd', orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses smallest currency unit (cents)
      currency,
      automatic_payment_methods: { enabled: true }, // Enables Cards, Apple Pay, Google Pay, etc.
      metadata: { order_id: orderId, store: 'myrackets' }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2. WEBHOOK ENDPOINT
 * Stripe sends events here (payment succeeded, failed, etc.).
 * Use the raw body to verify the signature.
 * This is where you fulfill the order (update DB, send email, mark as paid).
 */
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent ${paymentIntent.id}: success`);
      // TODO: 
      // 1. Update your database: mark order as paid
      // 2. Reduce inventory
      // 3. Send confirmation email to customer
      // 4. Trigger shipping workflow
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
      // TODO: Notify customer, allow retry
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Health check
app.get('/', (_req, res) => res.send('MY rackets Payment API'));

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Payment server running on port ${PORT}`));