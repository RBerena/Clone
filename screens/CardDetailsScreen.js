// Import Stripe components and React hooks
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Main component for handling card payments
export default function CardDetailsScreen() {
  // useConfirmPayment provides the function to confirm the payment with Stripe
  const { confirmPayment, loading } = useConfirmPayment();

  // State to store the user's card input
  const [cardDetails, setCardDetails] = useState(null);

  // Fetch the client secret from your backend server
  const fetchPaymentIntentClientSecret = async () => {
    try {
      // Send POST request to backend to create a PaymentIntent
      const response = await fetch('http://10.65.20.13:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // Amount in cents ($10.00)
        }),
      });

      // If backend returns error, handle it
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch client secret');
      }

      // Extract and return the client secret from response
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (err) {
      console.error('Unable to fetch client secret:', err);
      Alert.alert('Error', 'Unable to fetch payment intent. Please try again later.');
      return null;
    }
  };

  // Handle the payment confirmation process
  const handlePayPress = async () => {
    // Check if the card details are fully entered
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    // Fetch client secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret();
    if (!clientSecret) return;

    // Confirm the payment with Stripe using the card details and client secret
    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {
        name: 'Your User Name', // You can replace this dynamically with the real user name
      },
    });

    // Show appropriate message based on the result
    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      Alert.alert('Success', 'Payment successful!');
      // You can redirect to another screen or clear cart here
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.title}>Enter Card Details</Text>

      {/* Stripe CardField component for entering card info */}
      <CardField
        postalCodeEnabled={true} // Enable postal code field
        placeholder={{ number: '4242 4242 4242 4242' }} // Placeholder for card input
        cardStyle={styles.card} // Style for inside of card field
        style={styles.cardContainer} // Style for container box
        onCardChange={(card) => setCardDetails(card)} // Save the card data in state
      />

      {/* Payment button */}
      <TouchableOpacity
        style={[styles.payButton, loading && { backgroundColor: 'gray' }]} // Gray out if loading
        onPress={handlePayPress}
        disabled={loading}
      >
        {/* Button text changes based on loading state */}
        <Text style={styles.payButtonText}>
          {loading ? 'Processing...' : 'Pay'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the screen and components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center the form vertically
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  payButton: {
    backgroundColor: '#3A7F4C', // Green color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
