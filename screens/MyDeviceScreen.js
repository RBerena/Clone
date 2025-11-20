import NetInfo from '@react-native-community/netinfo';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// MyDeviceScreen component displays device info, battery, and network status with animations
export default function MyDeviceScreen() {
  // Animated values for container border and each info box
  const containerBorderAnim = useRef(new Animated.Value(0)).current;
  const deviceInfoAnim = useRef(new Animated.Value(0)).current;
  const batteryAnim = useRef(new Animated.Value(0)).current;
  const networkAnim = useRef(new Animated.Value(0)).current;
  const internetAnim = useRef(new Animated.Value(0)).current;

  // States to hold device info, battery level/status, and network info
  const [deviceName, setDeviceName] = useState(Device.modelName || 'Unknown');
  const [brand, setBrand] = useState(Device.brand || 'Unknown');
  const [osVersion, setOsVersion] = useState(Device.osVersion || 'Unknown');
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [networkType, setNetworkType] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Animate container border color in a continuous loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(containerBorderAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(containerBorderAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Animate each info box with staggered timing, fading in and out repeatedly
    Animated.stagger(400, [
      Animated.sequence([
        Animated.timing(deviceInfoAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(deviceInfoAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(batteryAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(batteryAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(networkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(networkAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.timing(internetAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(internetAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Fetch battery level and charging status asynchronously using expo-battery
    async function getBatteryInfo() {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(Math.round(level * 100));
      const charging = await Battery.getBatteryStateAsync();
      setIsCharging(charging === Battery.BatteryState.CHARGING);
    }
    getBatteryInfo();

    // Subscribe to network status updates using react-native-community/netinfo
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setNetworkType(state.type);
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  // Interpolate border color animation between light gray and green
  const containerBorderColor = containerBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#22c55e'],
  });

  // Interpolate background color animations for info boxes (light to green)
  const deviceInfoBg = deviceInfoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });
  const batteryBg = batteryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });
  const networkBg = networkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });
  const internetBg = internetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fafafa', '#bbf7d0'],
  });

  // Battery bar color depends on charging status
  const batteryLineColor = isCharging ? '#4CAF50' : '#FFC107';

  return (
    <Animated.View style={[styles.container, { borderColor: containerBorderColor }]}>
      {/* Device Info box */}
      <Animated.View style={[styles.subBox, { backgroundColor: deviceInfoBg }]}>
        <Text style={styles.subBoxTitle}>Device Info</Text>
        <Text style={styles.subBoxText}>Phone Name: {deviceName}</Text>
        <Text style={styles.subBoxText}>Brand: {brand}</Text>
        <Text style={styles.subBoxText}>Updated Like: OS {osVersion}</Text>
      </Animated.View>

      {/* Battery Level box */}
      <Animated.View style={[styles.subBox, { backgroundColor: batteryBg }]}>
        <Text style={styles.subBoxTitle}>Battery Level</Text>
        <Text style={styles.subBoxText}>{batteryLevel}%</Text>
        <View style={styles.batteryBarBackground}>
          <View
            style={[
              styles.batteryBarFill,
              { width: `${batteryLevel}%`, backgroundColor: batteryLineColor },
            ]}
          />
        </View>
        <Text style={styles.batteryStatusText}>
          {isCharging ? 'Charging (Green)' : 'Not Charging (Yellow)'}
        </Text>
      </Animated.View>

      {/* Network Type box */}
      <Animated.View style={[styles.subBox, { backgroundColor: networkBg }]}>
        <Text style={styles.subBoxTitle}>Network Type</Text>
        <Text style={styles.subBoxText}>{networkType}</Text>
      </Animated.View>

      {/* Internet Connection box */}
      <Animated.View style={[styles.subBox, { backgroundColor: internetBg }]}>
        <Text style={styles.subBoxTitle}>Internet Connected</Text>
        <Text style={styles.subBoxText}>{isConnected ? 'Yes' : 'No'}</Text>
      </Animated.View>
    </Animated.View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 3,
    borderRadius: 16,
    margin: 20,
  },
  subBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 20,
  },
  subBoxTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  subBoxText: {
    fontSize: 16,
    marginBottom: 6,
  },
  batteryBarBackground: {
    height: 12,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  batteryBarFill: {
    height: 12,
    borderRadius: 6,
  },
  batteryStatusText: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#666',
  },
});
