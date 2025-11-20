// server.js
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
// Initialize Stripe with your secret key (replace with your actual key)
const stripe = Stripe('sk_test_51Ro4iyQ2evdTCnfs9UJRE1N8ZSWwoo1RdjKnQwtg48lMfIrxPyjNVKWO00m6S6vrpuwJLzF5bvGXyc5i6G448SbT00CQOuOeTm');

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Endpoint to create a payment intent with Stripe
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount should be in the smallest currency unit (e.g. cents)

  try {
    // Create a new payment intent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // e.g. 1000 for $10.00
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Send client secret back to client to complete payment on frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Handle errors and send a 500 status with error message
    res.status(500).json({ error: error.message });
  }
});

// Start server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));
