import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CartContext } from '../context/CartContext';
 
export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { cartItems, clearCart } = useContext(CartContext);
 
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
 
  const handleCheckout = () => {
    clearCart(); // Clear cart items
    navigation.navigate('Success'); // Navigate to success screen
  };
 
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {item.quantity} × ${item.price.toFixed(2)} = $
          {(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHECKOUT</Text>
 
      {/* ✅ My Info */}
      <View style={styles.section}>
        <Text style={styles.label}>MY INFORMATION</Text>
        <Text>jenny</Text>
        <Text>jennysharma2@gmail.com</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyInformation')}>
          <Text style={styles.edit}>EDIT</Text>
        </TouchableOpacity>
      </View>
 
      {/* ✅ Billing */}
      <View style={styles.section}>
        <Text style={styles.label}>BILLING ADDRESS</Text>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => navigation.navigate('BillingAddress')}
        >
          <Text style={styles.selectText}>SELECT</Text>
        </TouchableOpacity>
      </View>
 
      {/* ✅ Payment */}
      <View style={styles.section}>
        <Text style={styles.label}>PAYMENT</Text>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.selectText}>SELECT</Text>
        </TouchableOpacity>
      </View>
 
      {/* ✅ Cart Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Your cart is empty.
          </Text>
        }
        style={{ marginBottom: 20 }}
      />
 
      {/* ✅ Order Summary */}
      <View style={styles.summary}>
        <Text>Order value</Text>
        <Text>${total.toFixed(2)}</Text>
      </View>
      <View style={styles.summary}>
        <Text>Delivery fee</Text>
        <Text>Free</Text>
      </View>
      <View style={styles.summary}>
        <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
        <Text style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Text>
      </View>
 
      {/* ✅ Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { color: '#888', fontSize: 12 },
  edit: { color: '#007bff', marginTop: 5 },
  selectBtn: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 5,
  },
  selectText: { color: '#fff' },
  itemRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  itemImage: { width: 50, height: 50, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontWeight: '500' },
  itemPrice: { color: '#333' },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#789a51',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
});
 
 