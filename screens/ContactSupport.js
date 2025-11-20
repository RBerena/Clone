import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

// Component to handle support contact form and communication options
export default function ContactSupport() {
  // Animated values for transitions and effects
  const containerBorderAnim = useRef(new Animated.Value(0)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;
  const phoneAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // State to track form input values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // List of support contact numbers
  const supportPhoneNumbers = ['4354926912', '497168949', '4346249369'];

  // On mount, trigger animations for UI elements
  useEffect(() => {
    // Border pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(containerBorderAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(containerBorderAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Sequential field animations
    Animated.stagger(400, [
      Animated.timing(nameAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(phoneAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(messageAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
    ]).start();
  }, []);

  // Interpolated animation styles for dynamic color effects
  const containerBorderColor = containerBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#22c55e'], // from gray to green
  });

  const nameBg = nameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'], // light to greenish
  });
  const phoneBg = phoneAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });
  const messageBg = messageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });
  const buttonBg = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#22c55e', '#16a34a'], // light green to dark green
  });

  // Validate and submit form
  const handleSend = () => {
    // Check for empty fields
    if (!name.trim() || !phone.trim() || !message.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }

    // Validate phone format (10 digits only)
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneDigits)) {
      Alert.alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Success message and form reset
    Alert.alert('Message sent', 'Thank you for contacting support!');
    setName('');
    setPhone('');
    setMessage('');
    Keyboard.dismiss();
  };

  // Call support using device dialer
  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      'Choose a number to call:',
      [
        {
          text: supportPhoneNumbers[0],
          onPress: () => Linking.openURL(`tel:${supportPhoneNumbers[0]}`),
        },
        {
          text: supportPhoneNumbers[1],
          onPress: () => Linking.openURL(`tel:${supportPhoneNumbers[1]}`),
        },
        {
          text: supportPhoneNumbers[2],
          onPress: () => Linking.openURL(`tel:${supportPhoneNumbers[2]}`),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Open WhatsApp with prefilled message
  const handleWhatsAppSupport = () => {
    Alert.alert(
      'WhatsApp Support',
      'Choose a number to message:',
      [
        {
          text: supportPhoneNumbers[0],
          onPress: () => Linking.openURL(`https://wa.me/1${supportPhoneNumbers[0]}?text=Hi%20Support`),
        },
        {
          text: supportPhoneNumbers[1],
          onPress: () => Linking.openURL(`https://wa.me/1${supportPhoneNumbers[1]}?text=Hi%20Support`),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Main UI
  return (
    // Dismiss keyboard on tapping outside
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* Animated outer container */}
      <Animated.View style={[styles.container, { borderColor: containerBorderColor }]}>
        <Text style={styles.title}>Contact Support</Text>

        {/* Name input field with animation */}
        <Animated.View style={[styles.subBox, { backgroundColor: nameBg }]}>
          <Text style={styles.subBoxTitle}>Name</Text>
          <TextInput
            style={styles.subBoxInput}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />
        </Animated.View>

        {/* Phone input field */}
        <Animated.View style={[styles.subBox, { backgroundColor: phoneBg }]}>
          <Text style={styles.subBoxTitle}>Phone Number</Text>
          <TextInput
            style={styles.subBoxInput}
            placeholder="e.g. 4354926912"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </Animated.View>

        {/* Message textarea */}
        <Animated.View style={[styles.subBox, { backgroundColor: messageBg }]}>
          <Text style={styles.subBoxTitle}>Message</Text>
          <TextInput
            style={[styles.subBoxInput, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Write your message here"
            multiline
            value={message}
            onChangeText={setMessage}
          />
        </Animated.View>

        {/* Animated Send button */}
        <Animated.View style={{ backgroundColor: buttonBg, borderRadius: 8, marginHorizontal: 20 }}>
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Call support button */}
        <TouchableOpacity onPress={handleCallSupport} style={styles.altButton}>
          <Text style={styles.altButtonText}>📞 Call Support</Text>
        </TouchableOpacity>

        {/* WhatsApp support button */}
        <TouchableOpacity onPress={handleWhatsAppSupport} style={styles.altButton}>
          <Text style={styles.altButtonText}>💬 Message on WhatsApp</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// Stylesheet for layout and design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 4,
    borderRadius: 16,
    margin: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  subBox: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20,
  },
  subBoxTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  subBoxInput: {
    fontSize: 16,
    color: '#222',
  },
  sendButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  altButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  altButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
