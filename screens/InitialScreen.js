// import necessary modules and hooks
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';

// InitialScreen component
const InitialScreen = () => {
  const navigation = useNavigation();

  // animated value for spinning logo
  const spinAnim = useRef(new Animated.Value(0)).current;

  // start spinning animation loop on mount
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // interpolate spin value to degrees
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // render UI
  return (
    <View style={styles.container}>
      {/* Status bar styling */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.title}>CasaPlanta</Text>
      <Text style={styles.slogan}>Plants that pay</Text>

      {/* Animated spinning logo */}
      <Animated.Image
        source={require('../assets/images/leaflogo.png')}
        style={[styles.logo, { transform: [{ rotate: spin }] }]}
      />

      {/* Button to create new account */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Create New Account</Text>
      </TouchableOpacity>

      {/* Button to sign in */}
      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.signinText}>Sign In</Text>
      </TouchableOpacity>

      {/* Help link */}
      <TouchableOpacity onPress={() => Linking.openURL('https://your-support-url.com')}>
        <Text style={styles.helpText}>Need help Signing in?</Text>
      </TouchableOpacity>
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // White background
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 4,
    color: '#000',
    borderBottomColor: '#000',
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    marginBottom: 30,
    color: '#444',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signinButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  signinText: {
    color: '#fff',
    fontSize: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#3366ff',
    textDecorationLine: 'underline',
  },
});

export default InitialScreen;
