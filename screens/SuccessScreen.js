import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
  const navigation = useNavigation();

  // Screen to show order success confirmation and navigate back to shopping
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Successful!</Text>
      <Text>Your plants will arrive soon 🌱</Text>

      {/* Button to continue shopping, navigates to 'Plants' tab of MainApp */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainApp', { screen: 'Plants' })}
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3A7F4C',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});
