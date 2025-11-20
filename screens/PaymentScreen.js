// PaymentScreen.js

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Payment options screen allowing navigation to various payment methods
export default function PaymentScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PAYMENT</Text>

      {/* Navigate to Card payment details */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('CardDetails')}
      >
        <Text>💳 Card</Text>
      </TouchableOpacity>

      {/* Navigate to PayPal payment */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('Paypal')}
      >
        <Text>💲 PayPal</Text>
      </TouchableOpacity>

      {/* Navigate to add Gift Card */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('GiftCard')}
      >
        <Text>🎁 Add Gift Card</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for PaymentScreen components
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
