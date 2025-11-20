// Import necessary hooks and components from React and React Native
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Define the Feedback component
export default function Feedback() {
  // State hooks for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Handler for submit button
  const handleSubmit = () => {
    // Validate if all fields are filled
    if (!name || !email || !message) {
      Alert.alert('Please fill out all fields');
      return;
    }

    // Submission logic placeholder (API call, email, etc.)
    Alert.alert('Thank you for your feedback!');

    // Clear the form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  // Render the UI
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Feedback screen title */}
      <Text style={styles.title}>Feedback</Text>

      {/* Name input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      {/* Email input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Feedback message input */}
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Your feedback"
        multiline
        value={message}
        onChangeText={setMessage}
      />

      {/* Submit button */}
      <View style={styles.buttonContainer}>
        <Button title="Submit Feedback" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
