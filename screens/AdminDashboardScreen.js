import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { BASE_URL } from '@/config/apiConfig';

// Main functional component
export default function AdminDashboardScreen({ navigation }) {
  const [recentUsers,setRecentUsers] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getRecentUsers();
    getCountryInfo();
  },[]);

  // Loads the top 3 most recently created users 
  const getRecentUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const dbUsers = response.data.data;

      const sortedUsers = dbUsers.sort((a, b) => 
      new Date(b.date_created) - new Date(a.date_created)
      );
    const topRecentUsers = sortedUsers.slice(0, 3).map(u => ({
        name: `${u.first_name} ${u.last_name}`,
        info: `Joined: ${new Date(u.date_created).toLocaleDateString()}`,
        avatar: require('../assets/images/userImage.png'),
      }));

      setRecentUsers(topRecentUsers);
    } catch (error) {
      console.error("Error retrieving recent users", error);
    }
  }

  const getRandomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

  const getCountryInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const dbUsers = response.data.data;

      const countryCount = dbUsers.reduce((acc, user) => {
        const code = user.country_code ? user.country_code.toUpperCase() : "UNKNOWN";
        acc[code] = (acc[code] || 0) + 1;
        return acc;
      }, {});

      const chartPromises = Object.keys(countryCount).map(async (code) => {
      let name = code;
      if (code !== "UNKNOWN") {
        try {
          const countryRes = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
          name = countryRes.data[0].name.common || code;
        } catch {
          name = code;
        }
      }
      return {
        name,
        population: countryCount[code],
        color: getRandomColor(),
        legendFontColor: '#333',
        legendFontSize: 12,
      };
    });

    const chart = (await Promise.all(chartPromises)).filter(entry => entry.population > 0);

      if (chart.length === 0) {
      chart.push({
        name: "No Data",
        population: 1,
        color: "#CCCCCC",
        legendFontColor: '#333',
        legendFontSize: 12,
      });
    }

      console.log("Chart Data:",chart);
      console.log(countryCount);
      setCountries(chart);
    } catch (error) {
      console.log("There was an error while processing the data.", error);
    }
  };

  // Stats showing CO2-related environmental impact
  const co2Stats = [
    { label: 'Total CO2 Reduced', value: '2,500 kg', change: '+300' },
    { label: 'Avg CO2/User', value: '2 kg', change: '-0.5' },
    { label: 'Reports Generated', value: '150', change: '+5' },
  ];

  // Stats related to user reward system
  const rewardStats = [
    { label: 'Total Rewards', value: '500', change: '+50' },
    { label: 'Rewards Used', value: '45', change: '-5' },
    { label: 'Users Redeemed', value: '300', change: '+15' },
  ];

  

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header with welcome message and icons */}
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>Welcome to CasaPlanta</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} style={styles.icon} />
          <Ionicons name="settings-outline" size={22} style={styles.icon} />
        </View>
      </View>

      {/* Card linking to user subscription reports screen */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('UserSubscriptionReportScreen')}
      >
        <Text style={styles.cardTitle}>User Subscription Reports</Text>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      {/* Recent Users Section */}
      <View style={styles.box}>
        <View style={styles.boxHeader}>
          <Text style={styles.boxTitle}>Recent Users</Text>
          <TouchableOpacity onPress={() => navigation.navigate('All Users')}>
            <Text style={styles.linkText}>More Users → </Text>
          </TouchableOpacity>
        </View>

        {/* Display top 3 recent users */}
        {recentUsers.map((user, index) => (
          <View key={index} style={styles.userCard}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userSub}>{user.sub}</Text>
            </View>
            <Text style={styles.userInfo}>{user.info}</Text>
          </View>
        ))}
      </View>

      {/* CO2 Report Section */}
      <View style={styles.box}>
        <View style={styles.boxHeader}>
          <Text style={styles.boxTitle}>CO2 Reports Overview</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CO2ReportScreen')}>
            <Text style={styles.linkText}>Analyze CO2 Levels → </Text>
          </TouchableOpacity>
        </View>

        {/* Display each CO2 stat as a clickable card */}
        <View style={styles.statsRow}>
          {co2Stats.map((stat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.statCard}
              onPress={() => navigation.navigate('CO2ReportScreen')}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rewards Section */}
      <View style={styles.box}>
        <View style={styles.boxHeader}>
          <Text style={styles.boxTitle}>User Rewards Usage</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserRewardScreen')}>
            <Text style={styles.linkText}>View Rewards History→ </Text>
          </TouchableOpacity>
        </View>

        {/* Display each rewards stat */}
        <View style={styles.statsRow}>
          {rewardStats.map((stat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.statCard}
              onPress={() => navigation.navigate('UserRewardScreen')}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Country Distribution Pie Chart */}
        {countries.length > 0 && (
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Users by Country</Text>
            <PieChart
              data={countries}
              width={Dimensions.get("window").width - 40}
              height={220}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              chartConfig={{
                backgroundRadius: 10,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
            />
          </View>
        )}

      {/* Bottom padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 14,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#B2D8C5',
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  box: {
    backgroundColor: '#F0FBF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderColor: '#BEE3C5',
    borderWidth: 1,
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532d',
  },
  linkText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#AED9B5',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  userSub: {
    fontSize: 12,
    color: '#555',
  },
  userInfo: {
    fontSize: 11,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D0E9D1',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statChange: {
    fontSize: 12,
    color: '#388E3C',
  },
});
