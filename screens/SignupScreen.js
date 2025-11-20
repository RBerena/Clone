import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import InternationalPhoneNumberInput from 'react-native-international-phone-number';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../config/apiConfig';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [username, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const handleSignup = async () => {
    if (!username || !firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    console.log('Sending signup request...', { username, firstName, lastName, email, phoneNumber, password, countryCode });

    try {
      console.log("Entering Signup Process");
      const response = await axios.post(`${BASE_URL}/users/signup`, {
        username,             
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        countryCode,
      });

      console.log('Signup response:', response.data);
      console.log(`Your account '${username}' has been created!`)
      Alert.alert(
        'Success',
        'Account created: ' + username,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'), 
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log('Signup error: ', error.response.data);
      console.error('Signup error: ', error.message);

      if (
        error.response.data.error.includes('duplicate key value') ||
        (error.response.status === 400 &&
          error.response.data.error === 'Email already registered')
      ) {
        Alert.alert(
          'Error',
          'Email is already registered. Please use a different email.'
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* App Logo */}
        <Text style={styles.logo}>CasaPlanta</Text>
        <Text style={styles.slogan}>Plants that pay</Text>
        <Text style={styles.heading}>Sign up</Text>

        {/* Signup Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setName}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email.toLowerCase()}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <InternationalPhoneNumberInput
          value={phoneNumber}
          onChangeText={(phoneInputValue) => setPhone(phoneInputValue)}
          onChangeSelectedCountry={(country) => setCountryCode(country.cca2)}
          placeholder='Enter your phone number'
          defaultCountry='CA'
          maxLength={12}
          />

          <Text style={styles.label}>Country Code</Text>
          <TextInput
            style={styles.input}
            autoCapitalize='all'
            value={countryCode}
            onChangeText={setCountryCode}
            editable={false}
          />

          <Text style={styles.label}>Password</Text>
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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Text style={styles.helperText}>Please confirm your password.</Text>

          {/* Signup button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Link to Sign in */}
        <Text style={styles.signinLink}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Sign in
          </Text>
        </Text>

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Icons */}
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={() => Linking.openURL('https://google.com')}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    marginTop:50
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    textAlign: 'center',
  },
  slogan: {
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
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
    marginBottom: 5,
    marginTop: 10,
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
  signupButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
  },
  signinLink: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: '#000',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
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
    gap: 20,
    justifyContent: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom:50
  },
});
