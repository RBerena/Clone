import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '@/config/apiConfig';;

// LoginScreen component
const LoginScreen = () => {
  const navigation = useNavigation();

  // State for email, password, and remember me checkbox
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);

  // Handler for sign-in button
  const handleLogin = async () => {
    console.log("Login request:", email, password)

    // Validate email and password inputs
    if (!email) {
      Alert.alert('Error', 'Please enter an email.');
      return;
    }
    if( !password){
      Alert.alert('Error', 'Please enter a password.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    try {
      console.log("Sending axios login request");
      const response = await axios.post(`${BASE_URL}/users/login`,{email, password});
      
      if(response.data.success){
        console.log("Attempting to set token");
        await AsyncStorage.setItem("token", response.data.sessionToken);
        await AsyncStorage.setItem("user_id",response.data.user.user_id.toString());
        // await AsyncStorage.setItem("currentUser", JSON.stringify(response.data));
        console.log(response.data.user.username);
        // Show success alert and navigate to TwoFactorAuth screen
        console.log(`Login Success! Welcome ${response.data.user.username}`);
        Alert.alert("Login success!", `Welcome ${response.data.user.username}`);
        navigation.navigate('TwoFactorAuth');
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Login unsuccessful.", error.response.data.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button to go back in navigation */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* App logo and slogan */}
      <Text style={styles.logo}>CasaPlanta</Text>
      <Text style={styles.slogan}>Plants that pay</Text>

      {/* Screen heading */}
      <Text style={styles.heading}>Sign In</Text>

      {/* Form inputs */}
      <View style={styles.form}>
        {/* Email input */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email.toLowerCase()}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.helperText}>
          We will send a verification link to this email.
        </Text>

        {/* Password input with forgot password link */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity onPress={() => Alert.alert('Reset password flow')}>
            <Text style={styles.labelRight}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.helperText}>
          Your password must be at least 8 characters.
        </Text>

        {/* Remember me checkbox */}
        {/* <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={styles.checkbox}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </TouchableOpacity> */}

        {/* Sign in button */}
        <TouchableOpacity style={styles.signinButton} onPress={handleLogin}>
          <Text style={styles.signinText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Redirect to Signup screen */}
      <Text style={styles.signupLink}>
        Don’t have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Signup')}
        >
          Sign up
        </Text>
      </Text>

      {/* Divider with "or" */}
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Social login icons */}
      <View style={styles.socialIcons}>
        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://accounts.google.com')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://instagram.com')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for LoginScreen components
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  slogan: {
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRight: {
    fontSize: 12,
    color: '#333',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: '#000',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  signinButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  signinText: {
    color: '#fff',
    fontSize: 16,
  },
  signupLink: {
    fontSize: 14,
    marginTop: 20,
  },
  link: {
    color: '#000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#666',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
