import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CartContext } from '../context/CartContext';
 
export default function ShoppingScreen() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
 
  const navigation = useNavigation();
 
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
 
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtext}>{item.botanicalName || ''}</Text>
        <Text style={styles.subtext}>Light: {item.light || 'Medium'}</Text>
        <Text style={styles.subtext}>Water: {item.water || 'Moderate'}</Text>
        <Text style={styles.price}>
          ${(item.price * item.quantity).toFixed(2)} (
          {item.quantity} × ${item.price.toFixed(2)})
        </Text>
        <Text style={styles.subtext}>Available for free shipping</Text>
 
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#e57373' }]}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#81c784' }]}
          >
            <Text style={styles.buttonText}>Save for later</Text>
          </TouchableOpacity>
        </View>
      </View>
 
      <View style={styles.quantityBox}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
          <Text style={styles.quantityBtn}>-</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 4 }}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
          <Text style={styles.quantityBtn}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
 
  return (
    <View style={styles.container}>
      {/* Spacer to push search bar down */}
      <View style={{ height: 30 }} />
 
      <TextInput placeholder="Search" style={styles.search} />
 
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      />
 
      {/* Fixed Bottom Section */}
      <View style={styles.fixedFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        </View>
 
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>Continue to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 10 },
  search: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtext: {
    color: '#555',
    fontSize: 12,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    padding: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  quantityBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 6,
  },
  totalContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    backgroundColor: '#f2f2f2',
    paddingBottom: 10,
  },
});
 