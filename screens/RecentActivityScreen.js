import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const dummyStats = [
  {
    id: '1',
    statLabel: 'Plants Watered',
    value: 42,
    delta: '+8',
  },
  {
    id: '2',
    statLabel: 'Active Gardens',
    value: 5,
    delta: '+1',
  },
  {
    id: '3',
    statLabel: 'New Plants Added',
    value: 11,
    delta: '+4',
  },
];

export default function RecentActivityScreen() {
  const renderStatItem = ({ item }) => {
    if (!item || !item.statLabel) return null; // Safety check

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.statLabel}</Text>
        <Text style={styles.value}>{item.value}</Text>
        <Text style={styles.delta}>{item.delta}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Garden Activity</Text>
      <FlatList
        data={dummyStats}
        keyExtractor={(item) => item.id}
        renderItem={renderStatItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4CAF50',
  },
  card: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#d4f5dc',
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  delta: {
    fontSize: 14,
    color: '#388e3c',
    marginTop: 2,
  },
});
