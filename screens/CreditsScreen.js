import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';

// Static values for credits
const availableCredits = 1500;
const redeemedCredits = 300;
const totalCredits = 2000;

export default function CreditsScreen({
  themeColors = {
    background: '#fff',
    textPrimary: '#222',
    textSecondary: '#555',
    progressBarBg: '#eee',
    progressFillPrimary: '#4CAF50',
    progressFillSecondary: '#FF9800',
  },
}) {
  // Animated values for progress bars
  const availableAnim = useRef(new Animated.Value(0)).current;
  const redeemedAnim = useRef(new Animated.Value(0)).current;

  // Trigger animation on mount
  useEffect(() => {
    Animated.timing(availableAnim, {
      toValue: (availableCredits / totalCredits) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    Animated.timing(redeemedAnim, {
      toValue: (redeemedCredits / totalCredits) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Main heading */}
      <Text style={[styles.header, { color: themeColors.textPrimary }]}>Credit Overview</Text>

      {/* Available Credits Section */}
      <View style={styles.creditBox}>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Available Credits</Text>
        <Text style={[styles.amount, { color: themeColors.textPrimary }]}>{availableCredits}</Text>

        {/* Progress bar for available credits */}
        <View style={[styles.progressBar, { backgroundColor: themeColors.progressBarBg }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: themeColors.progressFillPrimary,
                width: availableAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Redeemed Credits Section */}
      <View style={styles.creditBox}>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Redeemed Credits</Text>
        <Text style={[styles.amount, { color: themeColors.textPrimary }]}>{redeemedCredits}</Text>

        {/* Progress bar for redeemed credits */}
        <View style={[styles.progressBar, { backgroundColor: themeColors.progressBarBg }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: themeColors.progressFillSecondary,
                width: redeemedAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Total Credits Section */}
      <View style={styles.creditBox}>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Total Credits</Text>
        <Text style={[styles.amount, { fontWeight: 'bold', color: themeColors.textPrimary }]}>{totalCredits}</Text>
      </View>
    </ScrollView>
  );
}

// Styles for the component layout and colors
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  creditBox: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: 12,
  },
});
