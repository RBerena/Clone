import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// This screen displays the CO2 environmental report with stats
export default function CO2ReportScreen() {
  return (
    // Scrollable container for vertical scroll if content overflows
    <ScrollView style={styles.container}>
      {/* Header text */}
      <Text style={styles.header}>CO2 Report Details</Text>

      {/* First stat box: Total CO2 Reduced */}
      <View style={styles.box}>
        <Text style={styles.title}>Total CO2 Reduced</Text>
        <Text style={styles.value}>2,500 kg</Text>
        <Text style={styles.description}>An increase of 300 kg since last month.</Text>
      </View>

      {/* Second stat box: Average CO2 per User */}
      <View style={styles.box}>
        <Text style={styles.title}>Average CO2 Per User</Text>
        <Text style={styles.value}>2 kg</Text>
        <Text style={styles.description}>Reduced by 0.5 kg per user on average.</Text>
      </View>

      {/* Third stat box: Reports Generated */}
      <View style={styles.box}>
        <Text style={styles.title}>Reports Generated</Text>
        <Text style={styles.value}>150</Text>
        <Text style={styles.description}>5 more reports generated compared to last month.</Text>
      </View>
    </ScrollView>
  );
}

// Styles for CO2 report screen elements
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',      // White background for overall page
    padding: 20,                  // Padding around content
  },
  header: {
    fontSize: 22,                 // Large title text
    fontWeight: '700',           // Bold font
    marginBottom: 20,            // Space below header
    color: '#14532d',            // Dark green for eco-friendly theme
  },
  box: {
    backgroundColor: '#F0FBF4',  // Light green background for report box
    padding: 16,                 // Padding inside the box
    borderRadius: 12,            // Rounded corners
    marginBottom: 16,           // Space between boxes
    borderColor: '#BEE3C5',      // Light green border
    borderWidth: 1,
  },
  title: {
    fontSize: 16,                // Section title font size
    fontWeight: '600',
    color: '#2E7D32',            // Green color for title
    marginBottom: 8,
  },
  value: {
    fontSize: 20,                // Stat value text
    fontWeight: '700',
    color: '#14532d',            // Dark green for emphasis
    marginBottom: 6,
  },
  description: {
    fontSize: 14,                // Supporting description
    color: '#4B5563',            // Muted gray for secondary info
  },
});
