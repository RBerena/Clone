NotificationScreen.js
import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNotifications } from '../context/NotificationContext';
 
export default function NotificationScreen({ navigation }) {
  const { notifications, clearNotification } = useNotifications();
 
  // Filter and modal states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
 
  // Sample admin notifications - replace with real data from your backend
  const adminNotifications = [
    {
      id: '1',
      type: 'subscription',
      userName: 'John Doe',
      message: 'John Doe has subscribed to Premium Plan',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      avatar: require('../assets/images/avatar1.png')
    },
    {
      id: '2',
      type: 'login',
      userName: 'Alice Johnson',
      message: 'Alice Johnson logged in from New York, USA',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      avatar: require('../assets/images/avatar2.png')
    },
    {
      id: '3',
      type: 'credit',
      userName: 'Mike Chen',
      message: 'Mike Chen purchased 500 credits',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      avatar: require('../assets/images/avatarBoy.jpg')
    },
    {
      id: '4',
      type: 'usage',
      userName: 'Sarah Wilson',
      message: 'Sarah Wilson has used 45 hours this month',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      avatar: require('../assets/images/avatarGirl.jpg')
    },
    {
      id: '5',
      type: 'photos',
      userName: 'Bob Lee',
      message: 'Bob Lee has taken 127 pictures today',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      avatar: require('../assets/images/avatarBoy.jpg')
    },
    {
      id: '6',
      type: 'activity',
      userName: 'Jane Smith',
      message: 'Jane Smith completed 15 activities this week',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      avatar: require('../assets/images/avatarGirl.jpg')
    }
  ];
 
  // Combine admin notifications with regular notifications
  const allNotifications = [...adminNotifications, ...notifications];
 
  // Filter notifications based on selected filter
  const filteredNotifications = allNotifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    return notification.type === selectedFilter;
  });
 
  // Filter options for the filter modal
  const filterOptions = [
    { key: 'all', label: 'All Notifications', icon: 'list' },
    { key: 'subscription', label: 'Subscriptions', icon: 'star' },
    { key: 'login', label: 'Login Activities', icon: 'log-in' },
    { key: 'credit', label: 'Credit Transactions', icon: 'credit-card' },
    { key: 'usage', label: 'App Usage', icon: 'clock' },
    { key: 'photos', label: 'Photo Activities', icon: 'camera' },
    { key: 'activity', label: 'User Activities', icon: 'activity' }
  ];
 
  // Handle filter selection
  const handleFilterSelect = (filterKey) => {
    setSelectedFilter(filterKey);
    setFilterModalVisible(false);
  };
 
  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select notifications to delete.');
      return;
    }
   
    Alert.alert(
      'Delete Notifications',
      `Are you sure you want to delete ${selectedItems.length} notification(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            selectedItems.forEach(id => clearNotification(id));
            setSelectedItems([]);
            setBulkDeleteMode(false);
            Alert.alert('Success', `${selectedItems.length} notifications deleted.`);
          }
        }
      ]
    );
  };
 
  // Toggle item selection for bulk delete
  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
 
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'subscription':
        return <AntDesign name="star" size={18} color="#FFD700" />;
      case 'login':
        return <Feather name="log-in" size={18} color="#4CAF50" />;
      case 'credit':
        return <AntDesign name="creditcard" size={18} color="#2196F3" />;
      case 'usage':
        return <Feather name="clock" size={18} color="#FF9800" />;
      case 'photos':
        return <Feather name="camera" size={18} color="#9C27B0" />;
      case 'activity':
        return <Feather name="activity" size={18} color="#F44336" />;
      default:
        return <Feather name="bell" size={18} color="#666" />;
    }
  };
 
  const renderItem = ({ item }) => {
    const icon = getNotificationIcon(item.type);
    const isSelected = selectedItems.includes(item.id);
 
    const timestamp = new Date(item.timestamp);
    const dateStr = isNaN(timestamp)
      ? 'Invalid date'
      : timestamp.toLocaleString();
 
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => bulkDeleteMode ? toggleItemSelection(item.id) : null}
        activeOpacity={bulkDeleteMode ? 0.7 : 1}
      >
        {bulkDeleteMode && (
          <View style={styles.selectionIndicator}>
            <Feather
              name={isSelected ? "check-circle" : "circle"}
              size={20}
              color={isSelected ? "#4CAF50" : "#ccc"}
            />
          </View>
        )}
        <Image
          source={item.avatar || require('../assets/images/avatarGirl.jpg')}
          style={styles.avatar}
        />
        <View style={styles.textBlock}>
          <View style={styles.messageRow}>
            {icon}
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
          <Text style={styles.dateText}>{dateStr}</Text>
          {item.type && (
            <Text style={styles.typeTag}>{item.type.toUpperCase()}</Text>
          )}
        </View>
        {!bulkDeleteMode && (
          <TouchableOpacity onPress={() => clearNotification(item.id)}>
            <Feather name="trash" size={18} color="gray" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>
          {bulkDeleteMode ? `${selectedItems.length} Selected` : 'Admin Notifications'}
        </Text>
        <View style={styles.headerActions}>
          {bulkDeleteMode ? (
            <>
              <TouchableOpacity onPress={handleBulkDelete} style={styles.headerButton}>
                <Feather name="trash-2" size={24} color="#F44336" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setBulkDeleteMode(false);
                  setSelectedItems([]);
                }}
                style={styles.headerButton}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.headerButton}>
                <Feather name="filter" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBulkDeleteMode(true)} style={styles.headerButton}>
                <Feather name="more-vertical" size={24} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
 
      {/* Statistics Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {filteredNotifications.length} notifications
          {selectedFilter !== 'all' && ` (filtered by ${selectedFilter})`}
          {bulkDeleteMode && selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
        </Text>
      </View>
 
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
 
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Notifications</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
           
            <ScrollView style={styles.filterOptions}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    selectedFilter === option.key && styles.selectedFilterOption
                  ]}
                  onPress={() => handleFilterSelect(option.key)}
                >
                  <Feather
                    name={option.icon}
                    size={20}
                    color={selectedFilter === option.key ? "#4CAF50" : "#666"}
                  />
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilter === option.key && styles.selectedFilterOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedFilter === option.key && (
                    <Feather name="check" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // paddingTop: 40
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  summaryContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  textBlock: {
    flex: 1
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4
  },
  typeTag: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerButton: {
    marginLeft: 16
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f8fff8'
  },
  selectionIndicator: {
    marginRight: 12,
    alignSelf: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  filterOptions: {
    paddingHorizontal: 20
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa'
  },
  selectedFilterOption: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1
  },
  selectedFilterOptionText: {
    color: '#4CAF50',
    fontWeight: '600'
  }
});