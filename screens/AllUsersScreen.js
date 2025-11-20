import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import InternationalPhoneInput from 'react-native-international-phone-number';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {BASE_URL} from '../config/apiConfig';

export default function AllUsersScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../assets/images/userImage.png'));
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhoneNumber, setNewUserPhoneNumber] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCountryCode, setNewUserCountryCode] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // 
  const [sortOrder, setSortOrder] = useState('asc');
  const [streakModalVisible, setStreakModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterCountry, setFilterCountry] = useState('');

  countries.registerLocale(enLocale);

  useEffect(() => {
    getUsers();
  },[]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const dbUsers = response.data.data;

      const users = dbUsers.map(u => ({
        id: u.user_id || u.id,
        username: u.username,
        name: `${u.first_name} ${u.last_name}`,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phoneNumber: u.phone_number,
        countryCode: u.country_code,
        dateCreated: new Date(u.date_created).toLocaleDateString(),
      }));

      setAllUsers(users)
    } catch (error) {
      console.error("There was a problem getting the users.", error);
      Alert.alert("Error", "There was a problem getting the users.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`);
      Alert.alert("Done!", `The user has been deleted.`);
      setDeleteUserModalVisible(false);
      getUsers();
    } catch (error) {
      console.error("There was an issue deleting the user.", error);
      Alert.alert("Error", "There was an issue trying to delete the user.");
    }
  };

  const getFilteredAndSortedUsers = () => {
    let filteredUsers = [...allUsers];

    const lowerCaseSearchText = searchText.toLowerCase();

    if (searchText.trim()) {
      filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(lowerCaseSearchText)) ||
      (user.dateCreated && user.dateCreated.toLowerCase().includes(lowerCaseSearchText)) ||
      (user.username && user.username.toLowerCase().includes(lowerCaseSearchText)) ||
      (countries.getName(user.countryCode, "en").toLowerCase().includes(lowerCaseSearchText))
      );
    }
    if (filterCountry.trim()) {
      filteredUsers = filteredUsers.filter(user =>
        countries.getName(user.countryCode, "en")
          ?.toLowerCase()
          .includes(filterCountry.toLowerCase())
      );
    }

    filteredUsers.sort((a, b) => {
      let aValue, bValue;
     
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;

        case 'country':
        aValue = countries.getName(a.countryCode, 'en')?.toLowerCase();
        bValue = countries.getName(b.countryCode, 'en')?.toLowerCase();
        break;
        
        case 'credits':
          aValue = a.credits || 0;
          bValue = b.credits || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
     
      if (sortBy === 'credits') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      }
    });
    return filteredUsers;
  };

  const users = getFilteredAndSortedUsers();

  const handleEditUser = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if(!user){
      return;
    }

    setSelectedUser(user);
    setNewUserName(user.username);
    setNewUserFirstName(user.firstName);
    setNewUserLastName(user.lastName);
    setNewUserEmail(user.email);
    setNewUserPhoneNumber(user.phoneNumber);
    setNewUserPassword('');
    setNewUserCountryCode(user.countryCode);
    setEditUserModalVisible(true);
  };

  const handleDeleteUser = (userId, userName) => {
    Alert.alert("Confirm",`Are you sure you want to delete "${userName}"?`,
      [
        {text:"Cancel", style: "cancel"},
        {text:"Delete", style:"Destructive",
        onPress: () => deleteUser(userId),
      },
    ]);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const handleAddUsers = () => {
    setNewUserName('');
    setNewUserEmail('')
    setNewUserFirstName('');
    setNewUserLastName('');
    setNewUserPassword('');
    setNewUserPhoneNumber('');
    setNewUserCountryCode('');
    setAddUserModalVisible(true);
  };

  const confirmDelete = () => {
    Alert.alert('Success', `User ${selectedUser.name} has been deleted.`);
    setDeleteUserModalVisible(false);
    setSelectedUser(null);
  };

  const saveNewUser = async () => {
    if(!newUserName || !newUserFirstName || !newUserLastName || !newUserEmail || !newUserPassword || !newUserPhoneNumber || !newUserCountryCode){
      Alert.alert("Error", "You must fill in all fields.");
      return;
    }

    try {
      console.log("Sending new user information..");
      const email = newUserEmail.toLowerCase();
      const upperCountryCode = newUserCountryCode.toUpperCase();
      console.log(newUserName, newUserFirstName, newUserLastName, newUserEmail, newUserPassword, newUserPhoneNumber, newUserCountryCode);
      const response = await axios.post(`${BASE_URL}/users/signup`,{
        username: newUserName,             
        firstName: newUserFirstName,
        lastName: newUserLastName,
        email: email.toLowerCase(),
        password: newUserPassword,
        phoneNumber: newUserPhoneNumber,
        countryCode: upperCountryCode.toUpperCase(),
      });
      Alert.alert("Welcome!",`Your account '${newUserName}' has been created!`);
      console.log(`User ${newUserName} saved!`);
      setAddUserModalVisible(false);
      getUsers();
    } catch (error) {
      console.error("There was an error when creating the user.",error);
      Alert.alert("Error", "There was an issue when creating the user.");
    }
  };

  const saveEditUser = async () => {
    if(!selectedUser){
      return;
    }

    if(!newUserFirstName || !newUserLastName || !newUserEmail || !newUserPassword || !newUserPhoneNumber || !newUserCountryCode){
      Alert.alert("Error", "All fields required.");
      return;
    }

    try{
      const email = newUserEmail.toLowerCase();
      const upperCountryCode = newUserCountryCode.toUpperCase();
      const payload = {            
        firstName: newUserFirstName,
        lastName: newUserLastName,
        email: email,
        password: newUserPassword,
        phoneNumber: newUserPhoneNumber,
        countryCode: upperCountryCode
      };

      await axios.put(`${BASE_URL}/users/${selectedUser.id}`,payload);

      Alert.alert("Success!",`User ${newUserName} updated!`);
      setEditUserModalVisible(false);
      setSelectedUser(null);
      getUsers();
    } catch (error){
      console.error("There was an error updating the user.", error);
      Alert.alert("Error", "There was an issue when trying to update the user.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>CasaPlanta</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <MaterialCommunityIcons name="bell" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <MaterialIcons name="account-circle" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by Name, Email, Country..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Feather name="x" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Info */}
      {searchText.trim() && (
        <View style={styles.searchResultsInfo}>
          <Text style={styles.searchResultsText}>
            {users.length > 0 
              ? `Found ${users.length} user${users.length !== 1 ? 's' : ''} matching "${searchText}"` 
              : `No users found matching "${searchText}"`}
          </Text>
          {users.length === 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchLink}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* All Users Section */}
        <View style={styles.usersSection}>
          <View style={styles.usersSectionHeader}>
            <Text style={styles.usersTitle}>
              All Users <Text style={styles.userCount}>{users.length}</Text>
              {searchText.trim() && (
                <Text style={styles.searchResultText}> (filtered)</Text>
              )}
            </Text>
            <View style={styles.headerButtonsContainer}>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
                <Feather name="filter" size={16} color="#666" />
                <Text style={styles.filterText}>Filter & Sort</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addUsersBtn} onPress={handleAddUsers}>
              <Feather name="plus" size={16} color="#666" />
              <Text style={styles.addUsersText}>Add Users</Text>
            </TouchableOpacity>
          </View>

          {/* User Cards */}
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Image source={profileImage} style={styles.userAvatar} />
                <View style={styles.userTitle}>
                  <Text style={styles.userName}>Username: {user.username}</Text>
                  <Text style={styles.userBodyText}>Name: {user.name}</Text>
                  <Text style={styles.userBodyText}>Email: {user.email}</Text>
                  <Text style={styles.userBodyText}>Country: {countries.getName(user.countryCode, "en")}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>Credits:</Text>
                  {/* <Text style={styles.userBodyText}>{Math.round(Math.random(1, 100)*100)/100}</Text>   */}
                </View>
              </View>
              
              <View style={styles.userMeta}>
                <Text style={styles.userActivity}>
                  Joined on: {user.dateCreated}
                </Text>
                <View style={styles.userActions}>
                  <TouchableOpacity onPress={() => handleDeleteUser(user.id,user.name)} style={styles.actionBtn}>
                    <MaterialIcons name="delete-outline" size={20} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditUser(user.id)} style={styles.actionBtn}>
                    <Feather name="edit-2" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive} onPress={() => navigation.navigate('AdminDashboard', {screen:'Admin Dashboard'})}>
          <Text style={styles.navTextActive}>Return To Admin Dashboard</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}>
          <Text style={styles.navText}>Return To HomeScreen</Text>
        </TouchableOpacity>
      </View>

      {/* Add User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addUserModalVisible}
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <TouchableOpacity onPress={() => setAddUserModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter username"
              value={newUserName}
              onChangeText={setNewUserName}
              placeholderTextColor="#999"
            />
            
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter first name"
              value={newUserFirstName}
              onChangeText={setNewUserFirstName}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter last name"
              value={newUserLastName}
              onChangeText={setNewUserLastName}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              value={newUserEmail.toLowerCase()}
              onChangeText={setNewUserEmail}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter password"
              value={newUserPassword}
              onChangeText={setNewUserPassword}
              placeholderTextColor="#999"
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <InternationalPhoneInput
              value={newUserPhoneNumber}
              onChangeText={(phoneInputValue) => setNewUserPhoneNumber(phoneInputValue)}
              onChangeSelectedCountry={(country) => setNewUserCountryCode(country.cca2)}
              placeholder="Enter phone number"
              defaultCountry='CA'
              maxLength={11}
            />

            <Text style={styles.inputLabel}>Country Code</Text>
            <TextInput
              style={styles.modalInput}
              autoCapitalize='all'
              value={newUserCountryCode}
              onChangeText={setNewUserCountryCode}
              editable={false}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setAddUserModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveNewUser}
              >
                <Text style={styles.saveButtonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editUserModalVisible}
        onRequestClose={() => setEditUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setEditUserModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter username"
              value={newUserName}
              onChangeText={setNewUserName}
              color="#999"
              placeholderTextColor="#999"
              editable={false}
            />
            
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter first name"
              value={newUserFirstName}
              onChangeText={setNewUserFirstName}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter last name"
              value={newUserLastName}
              onChangeText={setNewUserLastName}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter password"
              value={newUserPassword}
              onChangeText={setNewUserPassword}
              placeholderTextColor="#999"
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <InternationalPhoneInput
              value={newUserPhoneNumber}
              onChangeText={(phoneInputValue) => setNewUserPhoneNumber(phoneInputValue)}
              onChangeSelectedCountry={(country) => setNewUserCountryCode(country.cca2)}
              placeholder="Enter phone number"
              defaultCountry={newUserCountryCode}
              maxLength={11}
            />

            <Text style={styles.inputLabel}>Country Code</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter phone number"
              value={newUserCountryCode}
              onChangeText={setNewUserCountryCode}
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditUserModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveEditUser}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteUserModalVisible}
        onRequestClose={() => setDeleteUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIcon}>
              <MaterialIcons name="warning" size={48} color="#ff4444" />
            </View>
            
            <Text style={styles.deleteTitle}>Delete User</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDeleteUserModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort Users</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Sort Options */}
            <Text style={styles.inputLabel}>Sort by</Text>
            <View style={styles.sortOptionsContainer}>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'name' && styles.sortOptionActive]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'name' && styles.sortOptionTextActive]}>
                  Full Name
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'country' && styles.sortOptionActive]}
                onPress={() => setSortBy('country')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'country' && styles.sortOptionTextActive]}>
                  Country
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'credits' && styles.sortOptionActive]}
                onPress={() => setSortBy('credits')}
              >
                <Text style={[styles.sortOptionText, sortBy === 'credits' && styles.sortOptionTextActive]}>
                  Credits
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sort Order */}
            <Text style={styles.inputLabel}>Sort Order</Text>
            <View style={styles.sortOrderContainer}>
              <TouchableOpacity
                style={[styles.sortOrderOption, sortOrder === 'asc' && styles.sortOrderOptionActive]}
                onPress={() => setSortOrder('asc')}
              >
                <Text style={[styles.sortOrderText, sortOrder === 'asc' && styles.sortOrderTextActive]}>
                  Ascending(A-Z)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOrderOption, sortOrder === 'desc' && styles.sortOrderOptionActive]}
                onPress={() => setSortOrder('desc')}
              >
                <Text style={[styles.sortOrderText, sortOrder === 'desc' && styles.sortOrderTextActive]}>
                  Descending(Z-A)
                </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setFilterCountry('');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
              >
                <Text style={styles.cancelButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>Apply</Text>
              </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e8f5e8', 
  },
  
  // Header Styles
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  headerIcons: { 
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileIcon: {
    marginLeft: 12
  },

  // Dashboard Header
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff'
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  clearButton: {
    padding: 4,
    marginLeft: 8
  },

  // Search Results
  searchResultsInfo: {
    backgroundColor: '#f0f8f0',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50'
  },
  searchResultsText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500'
  },
  clearSearchLink: {
    marginTop: 4
  },
  clearSearchText: {
    fontSize: 12,
    color: '#4CAF50',
    textDecorationLine: 'underline'
  },
  searchResultText: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic'
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16
  },

  // Users Section
  usersSection: {
    marginTop: 8
  },
  usersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  usersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  userCount: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666'
  },
  addUsersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 1
  },
  addUsersText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666'
  },

  // User Cards
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  userTitle: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  userBodyText: {
    fontSize: 14,
    color: '#666'
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userActivity: {
    fontSize: 12,
    color: '#999'
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionBtn: {
    padding: 4,
    marginLeft: 8
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    marginRight: 8
  },
  navText: {
    fontSize: 14,
    color: '#666'
  },
  navTextActive: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600'
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333'
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  deleteIcon: {
    marginBottom: 16
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  deleteMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  }
});