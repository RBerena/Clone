import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// UserRewardScreen component displays reward-related stats in styled boxes
export default function UserRewardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Screen header */}
      <Text style={styles.header}>User Rewards Details</Text>

      {/* Total Rewards Available box */}
      <View style={styles.box}>
        <Text style={styles.title}>Total Rewards Available</Text>
        <Text style={styles.value}>500</Text>
        <Text style={styles.description}>Total reward points in the system.</Text>
      </View>

      {/* Rewards Used box */}
      <View style={styles.box}>
        <Text style={styles.title}>Rewards Used</Text>
        <Text style={styles.value}>45</Text>
        <Text style={styles.description}>Rewards redeemed by users recently.</Text>
      </View>

      {/* Users Redeemed Rewards box */}
      <View style={styles.box}>
        <Text style={styles.title}>Users Redeemed Rewards</Text>
        <Text style={styles.value}>300</Text>
        <Text style={styles.description}>Number of users who redeemed rewards.</Text>
      </View>
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // White background
    padding: 20, // Padding around content
  },
  header: {
    fontSize: 22, // Large font size for header
    fontWeight: '700', // Bold font weight
    marginBottom: 20, // Spacing below header
    color: '#14532d', // Dark green text color
  },
  box: {
    backgroundColor: '#F0FBF4', // Light green background for boxes
    padding: 16, // Padding inside boxes
    borderRadius: 12, // Rounded corners
    marginBottom: 16, // Spacing between boxes
    borderColor: '#BEE3C5', // Light green border color
    borderWidth: 1, // Border width of 1
  },
  title: {
    fontSize: 16, // Title font size
    fontWeight: '600', // Semi-bold font weight
    color: '#2E7D32', // Green text color for titles
    marginBottom: 8, // Spacing below title
  },
  value: {
    fontSize: 20, // Larger font for values
    fontWeight: '700', // Bold font weight
    color: '#14532d', // Dark green text color for values
    marginBottom: 6, // Spacing below value
  },
  description: {
    fontSize: 14, // Smaller font for descriptions
    color: '#4B5563', // Gray text color
  },
});
