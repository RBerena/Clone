import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Sample subscription growth data for the bar chart
const subscriptionGrowthData = [
  { month: 'Jan', users: 200, color: '#FF6B6B' },
  { month: 'Feb', users: 350, color: '#FFA726' },
  { month: 'Mar', users: 400, color: '#FFEB3B' },
  { month: 'Apr', users: 300, color: '#4FC3F7' },
  { month: 'May', users: 450, color: '#BA68C8' },
  { month: 'Jun', users: 500, color: '#A1887F' },
];

// Main screen component showing user subscription report
export default function UserSubscriptionReportScreen({ navigation }) {
  // State to track if dropdown with detailed report is open
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Find maximum user count to scale bars proportionally
  const maxUsers = Math.max(...subscriptionGrowthData.map(d => d.users));

  return (
    <ScrollView style={styles.container}>
      {/* Dropdown toggle button to show/hide detailed report */}
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={styles.dropdownText}>
          View Detailed Report {dropdownOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Show bar chart only if dropdown is open */}
      {dropdownOpen && (
        <View style={styles.barChartContainer}>
          {/* Title for the chart */}
          <Text style={styles.chartTitle}>Subscription Growth</Text>

          {/* Bar chart container */}
          <View style={styles.barChart}>
            {subscriptionGrowthData.map(({ month, users, color }) => {
              // Calculate height of each bar relative to max users
              const barHeight = (users / maxUsers) * 150; // max height 150

              return (
                <View key={month} style={styles.barWrapper}>
                  {/* Bar with dynamic height and color */}
                  <View
                    style={[
                      styles.bar,
                      { height: barHeight, backgroundColor: color },
                    ]}
                  />
                  {/* Label below bar for month */}
                  <Text style={styles.barLabel}>{month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Stats cards showing key subscription numbers */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Subscribers</Text>
          <Text style={styles.statValue}>1,245</Text>
          <Text style={styles.statChangePositive}>+50</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Users</Text>
          <Text style={styles.statValue}>1,000</Text>
          <Text style={styles.statChangePositive}>+20</Text>
        </View>
      </View>

      {/* Section with notes on subscription trends */}
      <View style={styles.boxSection}>
        <Text style={styles.sectionHeading}>Subscription Trends</Text>
        <Text style={styles.notesText}>
          Our user base continues to grow with strong retention. Keep offering seasonal discounts and reward programs to further boost engagement.
        </Text>
      </View>

      {/* Customer reviews section with sample reviews */}
      <View style={styles.boxSection}>
        <Text style={styles.sectionHeading}>Customer Reviews</Text>
        <View style={styles.reviewsRow}>
          {/* Review from Alice */}
          <View style={styles.reviewCard}>
            <Text style={styles.reviewer}>Alice ★★★★★</Text>
            <Text>Love my new plants! They are thriving.</Text>
          </View>
          {/* Review from Bob */}
          <View style={styles.reviewCard}>
            <Text style={styles.reviewer}>Bob ★★★★☆</Text>
            <Text>Fast shipping and healthy plants. Impressed!</Text>
          </View>
        </View>
      </View>

      {/* Bottom navigation with icons and labels */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="trophy-outline" size={22} color="#2E7D32" />
          <Text style={styles.navText}>User Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart-outline" size={22} color="#2E7D32" />
          <Text style={styles.navText}>CO2 Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={22} color="#2E7D32" />
          <Text style={styles.navText}>Subscription Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Extra spacer at bottom for scroll padding */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// Stylesheet for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // White background for screen
    padding: 20, // Padding around content
    flex: 1,
  },
  dropdownContainer: {
    paddingVertical: 10, // Vertical padding inside dropdown toggle
    borderWidth: 1,
    borderColor: '#A5D6A7', // Light green border
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#F0FBF4', // Light green pastel background
  },
  dropdownText: {
    fontSize: 16,
    color: '#2E7D32', // Dark green text
    fontWeight: '600',
  },
  barChartContainer: {
    marginBottom: 30,
    backgroundColor: '#F0FBF4', // Light green pastel background (fix missing #)
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#81C784', // Medium green border
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2E7D32', // Dark green text
  },
  barChart: {
    flexDirection: 'row', // Horizontal bars layout
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Bars aligned bottom
  },
  barWrapper: {
    alignItems: 'center',
    width: 30, // Width per bar container
  },
  bar: {
    width: 20, // Bar width
    borderRadius: 6, // Rounded corners
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 12,
    color: '#2E7D32', // Dark green label text
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#F0FBF4', // Light green pastel background
    borderRadius: 12,
    padding: 16,
    width: '48%', // Two cards side by side
    borderColor: '#81C784',
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#2E7D32', // Dark green text
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20', // Darker green for emphasis
    marginBottom: 4,
  },
  statChangePositive: {
    fontSize: 14,
    color: '#388E3C', // Medium green positive change
  },
  boxSection: {
    backgroundColor: '#F0FBF4', // Light green pastel background
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#81C784',
    marginBottom: 25,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20', // Dark green heading
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#2E7D32', // Dark green notes text
    lineHeight: 20,
  },
  reviewsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewCard: {
    backgroundColor: 'white', // White card background
    borderRadius: 10,
    padding: 12,
    width: '48%', // Two review cards side by side
    borderWidth: 1,
    borderColor: '#A5D6A7', // Light green border
  },
  reviewer: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#1B5E20', // Dark green reviewer name
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: {
    alignItems: 'center',
    width: '30%', // Three nav items spaced evenly
  },
  navText: {
    fontSize: 13,
    color: '#2E7D32', // Dark green nav text
    marginTop: 4,
    fontWeight: '600',
  },
});
