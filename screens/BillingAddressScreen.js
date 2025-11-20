// Import navigation hook and required components
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// Main screen component for billing address
export default function BillingAddressScreen() {
  const navigation = useNavigation(); // Allows navigating between screens

  // State variables to hold form input values
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [province, setProvince] = useState('');

  // Function to validate and handle saving the billing address
  const handleSave = () => {
    // Basic validation for required fields
    if (!address || !city || !postal || !province) {
      Alert.alert('Error', 'Please fill all required fields marked with *');
      return;
    }

    // Construct the full address string
    const fullAddress = `${address}, ${address2 ? address2 + ', ' : ''}${city}, ${province}, ${postal}`;

    // Navigate to Profile screen, passing the address data
    navigation.navigate('Profile', { updatedAddress: fullAddress });
  };

  return (
    // Scrollable view to support longer form on small screens
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>BILLING ADDRESS</Text>

      {/* Input for Name (optional) */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      {/* Input for Street Address (required) */}
      <Text style={styles.label}>Address*</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Street, Number"
      />

      {/* Optional second address line */}
      <Text style={styles.label}>Address line 2</Text>
      <TextInput
        style={styles.input}
        value={address2}
        onChangeText={setAddress2}
        placeholder="Apartment, etc."
      />

      {/* City field (required) */}
      <Text style={styles.label}>Town/City*</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
      />

      {/* Postal code (required) */}
      <Text style={styles.label}>Postal Code*</Text>
      <TextInput
        style={styles.input}
        value={postal}
        onChangeText={setPostal}
        placeholder="E.g. H9B 1Y7"
      />

      {/* Province field (required) */}
      <Text style={styles.label}>Province*</Text>
      <TextInput
        style={styles.input}
        value={province}
        onChangeText={setProvince}
        placeholder="Province"
      />

      {/* Static market info (Canada) */}
      <Text style={styles.market}>MARKET</Text>
      <Text>CANADA</Text>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>ALMOST DONE</Text>
      </TouchableOpacity>

      {/* Informational note */}
      <Text style={styles.note}>🔒 All data is kept secure</Text>
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  market: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
