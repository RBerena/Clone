// RecentUsersScreen.js

import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Sample users data with id, name, subscription info, activity info, and avatar image
const users = [
  {
    id: '1',
    name: 'John Doe',
    sub: 'Subscribed for 6 months',
    info: 'Last Active: 2 days ago',
    avatar: require('../assets/images/Avtar.png'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    sub: 'New Member',
    info: 'Joined: 1 week ago',
    avatar: require('../assets/images/Floral.png'),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    sub: 'Subscribed for 3 months',
    info: 'Last Active: 5 days ago',
    avatar: require('../assets/images/Avtar.png'),
  },
  {
    id: '4',
    name: 'Bob Lee',
    sub: 'New Member',
    info: 'Joined: 3 days ago',
    avatar: require('../assets/images/Floral.png'),
  },
  // Add more users as needed
];

// Functional component to render the Recent Users screen
export default function RecentUsersScreen() {
  return (
    <View style={styles.container}>
      {/* Header title */}
      <Text style={styles.header}>All Recent Users</Text>
      
      {/* FlatList to render each user */}
      <FlatList
        data={users}  // Data source
        keyExtractor={(item) => item.id} // Unique key extractor
        contentContainerStyle={{ paddingBottom: 40 }} // Padding at bottom for spacing
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            {/* User avatar */}
            <Image source={item.avatar} style={styles.avatar} />
            {/* Name and subscription info container */}
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userSub}>{item.sub}</Text>
            </View>
            {/* Last active or joined info */}
            <Text style={styles.userInfo}>{item.info}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Styles for RecentUsersScreen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    paddingHorizontal: 20, // Horizontal padding
    paddingTop: 20, // Top padding
  },
  header: {
    fontSize: 22,
    fontWeight: '700', // Bold font
    color: '#14532d', // Dark green text color
    marginBottom: 20,
  },
  userCard: {
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Vertically center items
    padding: 14,
    borderWidth: 1,
    borderColor: '#AED9B5', // Light green border color
    borderRadius: 10,
    backgroundColor: '#F0FBF4', // Light green background
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22, // Circular avatar
    marginRight: 12,
  },
  userName: {
    fontWeight: '600', // Semi-bold text
    color: '#000',
  },
  userSub: {
    fontSize: 13,
    color: '#555', // Medium gray text
  },
  userInfo: {
    fontSize: 12,
    color: '#666', // Light gray text
  },
});
