// Import necessary React and React Native components and hooks
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the GiftCardScreen component
export default function GiftCardScreen() {
  // State hooks for gift card number and pin code inputs
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');

  // Handler for the Add button press
  const handleAdd = () => {
    // Check if both card number and pin are entered
    if (cardNumber && pin) {
      alert('Gift card added');
    } else {
      alert('Please enter both fields');
    }
  };

  // Render UI
  return (
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>GIFT CARDS</Text>
      {/* Informational text about gift cards */}
      <Text style={styles.info}>
        Gift cards can be used as payment in combination with other payment methods.
      </Text>
      {/* Input for gift card number */}
      <TextInput
        style={styles.input}
        placeholder="Gift card number"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      {/* Input for PIN code with secure text entry */}
      <TextInput
        style={styles.input}
        placeholder="PIN code"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
      />
      {/* Button to add the gift card */}
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the GiftCardScreen component
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold' },
});
