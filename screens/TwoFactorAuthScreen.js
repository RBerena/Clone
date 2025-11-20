import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TwoFactorAuthScreen({ navigation }) {
  const [code, setCode] = useState('');

  // Function to verify the entered 2FA code
  const handleVerify = () => {
    if (code === '1234') {
      Alert.alert('Success', '2FA Verified!');
      // Reset navigation stack and go to MainApp > Home screen after success
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainApp',
              state: {
                routes: [{ name: 'Home' }],
              },
            },
          ],
        })
      );
    } else {
      Alert.alert('Error', 'Invalid OTP. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* App logo and tagline */}
      <Text style={styles.logoText}>CasaPlanta</Text>
      <Text style={styles.tagline}>Plants that pay</Text>

      {/* Header row with back button, title, and lock icon */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
        <Ionicons name="lock-closed-outline" size={20} color="gray" />
      </View>

      {/* Input for 2FA code */}
      <Text style={styles.inputLabel}>Authentication Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the code sent to your device"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={4}
      />
      <Text style={styles.subtext}>Check your SMS or Email Address.</Text>

      {/* Button to resend code */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => Alert.alert('Code resent')}
      >
        <Text style={styles.secondaryButtonText}>Resend Code</Text>
      </TouchableOpacity>

      {/* Cancel button to go back */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </TouchableOpacity>

      {/* Primary verify button */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
        <Text style={styles.primaryButtonText}>Verify</Text>
      </TouchableOpacity>

      {/* Skip for now link, resets navigation to main app */}
      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'MainApp',
                  state: {
                    routes: [{ name: 'Home' }],
                  },
                },
              ],
            })
          )
        }
        style={styles.skipContainer}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginTop: 60,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  subtext: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    marginBottom: 20,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#000',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  skipContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
});
