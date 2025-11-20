// PaypalScreen.js

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Screen explaining PayPal payment process with a select button
export default function PaypalScreen() {
  const handleSelect = () => {
    // Logic to select PayPal payment option (can be extended)
    alert('PayPal selected');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PAYPAL</Text>
      <Text style={styles.info}>
        After clicking Complete Purchase, a pop-up will appear asking you to
        sign in to your PayPal account. Review your payment and shipping
        details to complete your purchase. You will be redirected to the order
        confirmation page afterwards.
      </Text>
      {/* Button to confirm selection of PayPal */}
      <TouchableOpacity style={styles.button} onPress={handleSelect}>
        <Text style={styles.buttonText}>SELECT</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for PaypalScreen components
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { marginBottom: 30 },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
