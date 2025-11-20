// Import necessary modules and hooks
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// MyInformationScreen component
export default function MyInformationScreen({ navigation }) {
  // State variables for user info
  const [email, setEmail] = useState('jennysharma2@gmail.com');
  const [firstName, setFirstName] = useState('jenny');
  const [lastName, setLastName] = useState('sharma');
  const [dob, setDob] = useState('1999-05-03');
  const [phone, setPhone] = useState('43164572389');
  const [countryCode] = useState('+1');

  // Save button handler (navigate back, data saving could be added here)
  const handleSave = () => {
    // Here you could store data to context or backend
    navigation.goBack();
  };

  // Render UI for user info form
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MY INFORMATION</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>First name *</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last name *</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Date of birth *</Text>
      <TextInput style={styles.input} value={dob} onChangeText={setDob} />

      <Text style={styles.label}>Phone number</Text>
      <View style={styles.phoneRow}>
        <View style={styles.codeBox}>
          <Text>{countryCode}</Text>
        </View>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>

      <Text style={styles.secureNote}>🔒 All data is kept secure</Text>
    </ScrollView>
  );
}

// Styles for MyInformationScreen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 10, fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    padding: 10,
    marginTop: 5,
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  codeBox: {
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: { color: 'white', fontWeight: 'bold' },
  secureNote: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    color: '#444',
  },
});
