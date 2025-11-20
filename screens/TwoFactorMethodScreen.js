import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function TwoFactorMethodScreen({ navigation }) {
  const [isSmsEnabled, setIsSmsEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);

  // Load saved 2FA method on mount
  useEffect(() => {
    async function loadMethod() {
      const method = await AsyncStorage.getItem('2faMethod');
      if (method === 'sms') {
        setIsSmsEnabled(true);
        setIsEmailEnabled(false);
      } else if (method === 'email') {
        setIsEmailEnabled(true);
        setIsSmsEnabled(false);
      }
    }
    loadMethod();
  }, []);

  const toggleSms = async () => {
    const newValue = !isSmsEnabled;
    setIsSmsEnabled(newValue);
    if (newValue) {
      setIsEmailEnabled(false);
      await AsyncStorage.setItem('2faMethod', 'sms');
      navigation.navigate('TwoFactorAuth', { method: 'sms' });
    } else {
      await AsyncStorage.removeItem('2faMethod');
    }
  };

  const toggleEmail = async () => {
    const newValue = !isEmailEnabled;
    setIsEmailEnabled(newValue);
    if (newValue) {
      setIsSmsEnabled(false);
      await AsyncStorage.setItem('2faMethod', 'email');
      navigation.navigate('TwoFactorAuth', { method: 'email' });
    } else {
      await AsyncStorage.removeItem('2faMethod');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two Factor Authentication</Text>
      <Text style={styles.instruction}>
        Please choose how you want to receive your verification code.
      </Text>

      <View style={styles.option}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.optionTitle}>Text verification</Text>
            <Text style={styles.optionSubtitle}>A code will be sent to +1 xxx xxxx xxx</Text>
          </View>
          <Switch
            onValueChange={toggleSms}
            value={isSmsEnabled}
          />
        </View>
      </View>

      <View style={styles.option}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.optionTitle}>Email Verification</Text>
            <Text style={styles.optionSubtitle}>A code will be sent to jenny@example.com</Text>
          </View>
          <Switch
            onValueChange={toggleEmail}
            value={isEmailEnabled}
          />
        </View>
      </View>

      <Text style={styles.description}>
        2FA is an extra layer of protection that requires a second form of ID before logging into an account.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#fff',
  },
  title: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 10,
  },
  instruction: {
    fontSize: 14, marginBottom: 20,
  },
  option: {
    borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 6, marginBottom: 12,
  },
  optionTitle: {
    fontSize: 14, fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12, color: 'gray',
  },
  description: {
    fontSize: 13, marginTop: 24, color: 'gray',
  },
});
