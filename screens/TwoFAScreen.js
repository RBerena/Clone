import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TwoFactorIntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Two Factor Authentication</Text>

      <Text style={styles.paragraph}>
        Login Verification helps keep your account more secure.
      </Text>

      <Text style={styles.paragraph}>
        With login verification enabled, you will need both your password and a
        verification code sent to your phone to log in on new devices.
      </Text>

      <Image
        source={require('../assets/images/2fa-lock.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TwoFactorMethod')}
      >
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 16 },
  paragraph: { fontSize: 14, color: '#333', marginBottom: 16 },
  image: { width: 140, height: 140, marginVertical: 20 },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
