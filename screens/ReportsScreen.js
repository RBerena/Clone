// ReportsScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Chart configuration for the bar chart colors and styles
const chartConfig = {
  backgroundGradientFrom: '#e8f5e9', // light green background
  backgroundGradientTo: '#e8f5e9',   // light green background
  fillShadowGradient: '#4caf50',     // green bars fill gradient
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // bar color
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // labels color
  barPercentage: 0.6, // width of bars relative to available space
};

// Data for the bar chart with labels and dataset values
const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [120, 180, 240, 200, 300, 280, 150],
      colors: [
        () => '#1f0202ff',
        () => '#218026ff',
        () => '#197684ff',
        () => '#94548aff',
        () => '#846dceff',
        () => '#a3506bff',
        () => '#9265daff',
      ],
    },
  ],
};

const ReportsScreen = () => {
  // States to toggle detail boxes for bought and sold plants
  const [boughtOpen, setBoughtOpen] = useState(false);
  const [soldOpen, setSoldOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Screen Header */}
      <Text style={styles.header}>My Report</Text>

      {/* Metrics overview box */}
      <View style={styles.metricsBox}>
        <Text style={styles.metricsTitle}>Usage Metrics</Text>
        <Text style={styles.metricsSubtitle}>Daily & Monthly Overview</Text>

        {/* Row for Plants Bought and Plants Sold cards */}
        <View style={styles.metricRow}>
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => setBoughtOpen(!boughtOpen)}
          >
            <Text style={styles.metricLabel}>Plants Bought</Text>
            <Text style={styles.metricValue}>15</Text>
            <Text style={styles.metricChange}>+3</Text>
            <Ionicons
              name={boughtOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => setSoldOpen(!soldOpen)}
          >
            <Text style={styles.metricLabel}>Plants Sold</Text>
            <Text style={styles.metricValue}>10</Text>
            <Text style={styles.metricChange}>-1</Text>
            <Ionicons
              name={soldOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Detail box for Plants Bought data */}
        {boughtOpen && (
          <View style={styles.detailBox}>
            <Text style={styles.detailHeading}>Plants Bought</Text>
            <Text style={styles.detailText}>• Mon: 60</Text>
            <Text style={styles.detailText}>• Tue: 70</Text>
            <Text style={styles.detailText}>• Wed: 120</Text>
            <Text style={styles.detailText}>• Thu: 90</Text>
            <Text style={styles.detailText}>• Fri: 160</Text>
            <Text style={styles.detailText}>• Sat: 130</Text>
            <Text style={styles.detailText}>• Sun: 140</Text>
          </View>
        )}

        {/* Detail box for Plants Sold data */}
        {soldOpen && (
          <View style={styles.detailBox}>
            <Text style={styles.detailHeading}>Plants Sold</Text>
            <Text style={styles.detailText}>• Mon: 30</Text>
            <Text style={styles.detailText}>• Tue: 110</Text>
            <Text style={styles.detailText}>• Wed: 100</Text>
            <Text style={styles.detailText}>• Thu: 110</Text>
            <Text style={styles.detailText}>• Fri: 140</Text>
            <Text style={styles.detailText}>• Sat: 75</Text>
            <Text style={styles.detailText}>• Sun: 155</Text>
          </View>
        )}
      </View>

      {/* Bar chart container */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Plants Buy/Sell Trend</Text>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={250}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          withCustomBarColorFromData={true}
          flatColor={true}
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Recent transactions section */}
      <Text style={styles.transactionsTitle}>Recent Transactions</Text>

      <View style={styles.transactionRow}>
        {/* Bought transaction card */}
        <View style={styles.transactionCard}>
          <Text style={styles.transactionType}>Bought</Text>
          <Image
            source={require('../assets/images/spiderplant.jpg')}
            style={styles.transactionImage}
          />
          <Text style={styles.transactionName}>Spider Plant</Text>
          <Text style={styles.transactionPrice}>$15</Text>
        </View>

        {/* Sold transaction card */}
        <View style={styles.transactionCard}>
          <Text style={styles.transactionType}>Sold</Text>
          <Image
            source={require('../assets/images/Kalanchoe.webp')}
            style={styles.transactionImage}
          />
          <Text style={styles.transactionName}>Kalanchoe</Text>
          <Text style={styles.transactionPrice}>$20</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f8f2', // Light greenish background
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32', // Dark green
    marginBottom: 20,
  },
  detailHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#154017ff', // Dark green
    marginBottom: 8,
  },
  metricsBox: {
    backgroundColor: '#fff', // White background for metrics box
    borderRadius: 8,
    borderColor: '#2e7d32', // Dark green border
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  metricsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 0.48, // Roughly half width
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    position: 'relative', // For icon positioning
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#888',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  metricChange: {
    fontSize: 14,
    color: '#2e7d32', // Dark green positive change color
    marginTop: 4,
  },
  detailBox: {
    backgroundColor: '#f3f9f4', // Light greenish box for details
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#2e7d32', // Dark green text
    marginBottom: 4,
  },
  chartContainer: {
    backgroundColor: '#e8f5e9', // Very light green background for chart
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transactionCard: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  transactionImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionType: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  transactionPrice: {
    fontSize: 14,
    color: '#666',
  },
});

export default ReportsScreen;
