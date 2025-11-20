// NotificationPreferencesScreen.js
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function NotificationPreferencesScreen({ navigation }) {
  const [receiveNotif, setReceiveNotif] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);
  const [reminders, setReminders] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Receive Notifications</Text>
        <Switch value={receiveNotif} onValueChange={setReceiveNotif} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>App Updates</Text>
        <Switch value={appUpdates} onValueChange={setAppUpdates} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Reminders</Text>
        <Switch value={reminders} onValueChange={setReminders} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
