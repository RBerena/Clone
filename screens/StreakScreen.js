import { Feather } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
 
export default function StreakScreen({ visible, onClose }) {
  const navigation = useNavigation();
 
  const handleClose = () => {
    if (onClose) onClose();
    navigation.goBack();
  };
 
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with close button */}
          <View style={styles.header}>
            <View style={styles.topIndicator} />
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
         
          {/* Flame icon */}
          <View style={styles.flameIconContainer}>
            <View >
              <FontAwesome6 name="fire-flame-curved" size={24} color="#FF6B35" />
            </View>
          </View>
         
          {/* Streak count */}
          <Text style={styles.streakCount}>7 day streak!</Text>
         
          {/* Weekly calendar */}
          <View style={styles.weeklyCalendar}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View style={styles.dayCircle}>
                  <Feather
                    name="check"
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            ))}
          </View>
         
          {/* Bottom indicator */}
          <View style={styles.bottomIndicator} />
        </View>
      </View>
    </Modal>
  );
}
 
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2B2B2B',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -12,
    padding: 8,
  },
  topIndicator: {
    width: 50,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    marginBottom: 24,
  },
  flameIconContainer: {
    marginBottom: 16,
  },
  flameBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  streakSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  weeklyCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
    fontWeight: '500',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIndicator: {
    width: 50,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
  },
});