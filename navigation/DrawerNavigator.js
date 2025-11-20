import { Feather, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
 
import HomeScreen from '../screens/HomeScreen';
import PlantsScreen from '../screens/PlantsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShoppingScreen from '../screens/ShoppingScreen';
import AllUsersScreen from '../screens/AllUsersScreen';
 
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import FAQScreen from '../screens/FAQScreen';
import MyGalleryScreen from '../screens/MyGalleryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import RecentActivityScreen from '../screens/RecentActivityScreen';
import ReportsScreen from '../screens/ReportsScreen';
import TwoFAScreen from '../screens/TwoFAScreen';
import StreakScreen from '../screens/StreakScreen';
 
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
 
function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Plants: 'leaf',
            Shopping: 'cart',
            Profile: 'person',
            Test: 'leaf',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plants" component={PlantsScreen} />
      <Tab.Screen name="Shopping" component={ShoppingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
 
function DrawerItem({ label, onPress, icon }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
      {icon}
      <Text style={styles.drawerLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
 
function CustomDrawerContent(props) {
  const { navigation } = props;
 
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            style={styles.menuButton}
          >
            <Ionicons name="menu-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.titleText}>CasaPlanta</Text>
        </View>
 
        <View style={styles.menuSection}>
          <DrawerItem
            label="MyGallery"
            icon={<MaterialCommunityIcons name="image-multiple" size={24} color="#f06292" />}
            onPress={() => navigation.navigate('MyGallery')}
          />
          <DrawerItem
            label="Recent Users"
            icon={<Ionicons name="people-outline" size={24} color="#66bb6a" />}
            onPress={() => navigation.navigate('Recent Users')}
          />
          <DrawerItem
            label="Reports"
            icon={<Feather name="bar-chart-2" size={24} color="#64b5f6" />}
            onPress={() => navigation.navigate('Reports')}
          />
          <DrawerItem
            label="Notification"
            icon={<Ionicons name="notifications-outline" size={24} color="#ffb74d" />}
            onPress={() => navigation.navigate('Notification')}
          />
           <DrawerItem
            label="Streak"
            icon={ <FontAwesome6 name="fire-flame-curved" size={24} color="#FF6B35" />}
            onPress={() => navigation.navigate('Streak')}
          />
          <DrawerItem
            label="2FA"
            icon={<FontAwesome5 name="lock" size={20} color="#81c784" />}
            onPress={() => navigation.navigate('2FA')}
          />
          <DrawerItem
            label="FAQ"
            icon={<MaterialCommunityIcons name="help-circle-outline" size={24} color="#ba68c8" />}
            onPress={() => navigation.navigate('FAQ')}
          />
        </View>
      </DrawerContentScrollView>
 
      <View style={styles.adminFooter}>
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('Admin Dashboard')}
        >
          <Ionicons name="document-text-outline" size={16} color="#4CAF50" style={{ marginRight: 6 }} />
          <Text style={styles.adminButtonText}>ADMIN DASHBOARD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
function headerOptions(navigation) {
  return {
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 12 }}>
        <Ionicons name="menu-outline" size={28} color="black" />
      </TouchableOpacity>
    ),
    headerTitle: 'CasaPlanta',
    headerTitleStyle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'black',
    },
  };
}
 
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="MyGallery"
        component={MyGalleryScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="Notification"
        component={NotificationScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="2FA"
        component={TwoFAScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="FAQ"
        component={FAQScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="Admin Dashboard"
        component={AdminDashboardScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
       <Drawer.Screen
        name="Streak"
        component={StreakScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
      <Drawer.Screen
        name="All Users"
        component={AllUsersScreen}
        options={({ navigation }) => ({ ...headerOptions(navigation), headerShown: false })}
      />
      <Drawer.Screen
        name="RecentActivity"
        component={RecentActivityScreen}
        options={({ navigation }) => headerOptions(navigation)}
      />
    </Drawer.Navigator>
  );
}
 
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  menuButton: {
    marginRight: 20,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  drawerLabel: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: '500',
  },
  adminFooter: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
    padding: 16,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 6,
  },
  adminButtonText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});