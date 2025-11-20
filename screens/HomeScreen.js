import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import {BASE_URL} from '../config/apiConfig';


export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [likedProducts, setLikedProducts] = useState({});
  const { addNotification } = useNotifications();
  const [firstName, setFirstName] = useState('Loading..');

  const gardenStatsOptions = [
    [
      { label: 'Plants Watered', value: 42, delta: '+8' },
      { label: 'Active Gardens', value: 5, delta: '+1' },
      { label: 'New Plants Added', value: 11, delta: '+4' },
    ],
    [
      { label: 'Plants Watered', value: 49, delta: '+3' },
      { label: 'Active Gardens', value: 6, delta: '+1' },
      { label: 'New Plants Added', value: 14, delta: '+2' },
    ],
    [
      { label: 'Plants Watered', value: 53, delta: '+4' },
      { label: 'Active Gardens', value: 7, delta: '+1' },
      { label: 'New Plants Added', value: 16, delta: '+2' },
    ],
  ];
  const [gardenStatsIndex, setGardenStatsIndex] = useState(0);
  const [gardenStats, setGardenStats] = useState(gardenStatsOptions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGardenStatsIndex((prev) => (prev + 1) % gardenStatsOptions.length);
      setGardenStats(gardenStatsOptions[(gardenStatsIndex + 1) % gardenStatsOptions.length]);
    }, 5000);
    return () => clearInterval(interval);
  }, [gardenStatsIndex]);

  const [topPicks] = useState([
    {
      id: '1',
      name: 'Snake Plant',
      price: 22,
      image: require('../assets/images/peacelily1.jpg'),
    },
    {
      id: '2',
      name: 'Peace Lily',
      price: 30,
      image: require('../assets/images/peacelily2.jpg'),
    },
    {
      id: '3',
      name: 'Golden Pothos',
      price: 18,
      image: require('../assets/images/mariannaole.jpg'),
    },
  ]);

  const [careTips] = useState([
    '💧 Water once a week or when soil is dry to the touch.',
    '🌤 Place in bright, indirect sunlight.',
    '🪴 Use well-draining soil and rotate pot monthly.',
  ]);

  const [articles, setArticles] = useState([]);

  const featuredPlants = [
    {
      name: 'Peace Lily',
      desc: 'Air-purifying and pet-friendly. Thrives in low light!',
      image: require('../assets/images/peacelily2.jpg'),
    },
    {
      name: 'Snake Plant',
      desc: 'Hardy and beginner-friendly. Tolerates neglect.',
      image: require('../assets/images/peace_lily.jpg'),
    },
    {
      name: 'Aloe Vera',
      desc: 'Medicinal plant that loves bright sunlight!',
      image: require('../assets/images/aloe_vera.jpg'),
    },
  ];
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = featuredPlants[featuredIndex];

  useEffect(() => {
    const fetchArticles = async () => {
      const fetched = [
        {
          title: 'How Houseplants Improve Air Quality',
          url: 'https://www.example.com/article1',
        },
        {
          title: 'Top 5 Easy-to-Grow Plants for Beginners',
          url: 'https://www.example.com/article2',
        },
        {
          title: 'Why Plants Make You Happier at Home',
          url: 'https://www.example.com/article3',
        },
      ];
      setArticles(fetched);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredPlants.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleProductLike = (id, name) => {
    setLikedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!likedProducts[id]) {
      addNotification(`You liked ${name}`);
    }
  };

  const addToCart = (name) => {
    addNotification(`Added ${name} to cart`);
  };

  const goToFavorites = () => {
    const favoriteIds = topPicks
      .filter((item) => likedProducts[item.id])
      .map((item) => item.id);
    navigation.navigate('MyGallery', {
      favoriteIds: favoriteIds,
    });
  };

  useEffect (() => {
    const getUser = async () =>{
      try {
        const token =  await AsyncStorage.getItem("token");
        const user_id = await AsyncStorage.getItem("user_id");

        if(!token || !user_id){
          console.log("Could not find user_id or token.");
          return;
        }
          console.log("Retrieving name..")
          const response = await axios.get(`${BASE_URL}/users/${user_id}`,
            {headers: { Authorization: `${token}`}
      });
      console.log(response.data.data.first_name);
      setFirstName(response.data.data.first_name);
      } catch (error) {
        Alert.alert("Error loading name.", error);
      }
    };
    getUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>CasaPlanta</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <MaterialCommunityIcons name="bell" size={22} color="#e0b200" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToFavorites}>
            <AntDesign name="heart" size={22} color="red" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userRow}>
        <Image source={require('../assets/images/avatar1.png')} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{firstName}</Text>
          <Text style={styles.subText}>Welcome back to CasaPlanta!</Text>
        </View>
      </View>

      <Text style={styles.statsTitle}>Your Garden Stats</Text>
      <Text style={styles.statsSubtitle}>Keep track of your plants</Text>
      <View style={styles.statsRow}>
        {gardenStats.map((s, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statDelta}>{s.delta}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sloganBox}>
        <Text style={styles.slogan}>From Plant to Pixel,{"\n"}the Nature unfolds.</Text>          
          <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scan')}>
            <Text style={styles.scanText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arBtn} onPress={() => navigation.navigate('ARScan')}>
            <Text style={styles.arText}>AR View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.featuredCard, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={featured.image} style={styles.featuredImg} />
        <View style={{ padding: 10 }}>
          <Text style={styles.featuredTitle}>🌟 Featured: {featured.name}</Text>
          <Text style={styles.featuredDesc}>{featured.desc}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PlantDetails', { plantName: featured.name })}>
            <Text style={styles.learnMore}>Learn More →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Text style={styles.tipTitle}>🌱 Care Tips</Text>
      <View style={styles.tipCard}>
        {careTips.map((tip, idx) => (
          <Text key={idx} style={styles.tipText}>{tip}</Text>
        ))}
      </View>

      <Text style={styles.picksTitle}>Top Picks for You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {topPicks.map((p) => (
          <View key={p.id} style={styles.productCard}>
            <Image source={p.image} style={styles.productImg} />
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.productPrice}>${p.price}</Text>
            <View style={styles.cardIcons}>
              <TouchableOpacity onPress={() => addToCart(p.name)}>
                <Feather name="shopping-cart" size={18} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleProductLike(p.id, p.name)}>
                <AntDesign
                  name={likedProducts[p.id] ? 'heart' : 'heart'}
                  size={18}
                  color={likedProducts[p.id] ? 'red' : 'grey'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  title: { fontSize: 18, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 14 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  subText: { color: 'gray', fontSize: 12 },
  statsTitle: { fontWeight: 'bold', fontSize: 14 },
  statsSubtitle: { color: 'gray', fontSize: 11, marginBottom: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  statLabel: { fontSize: 11, color: 'gray', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statDelta: { fontSize: 12, color: 'gray', marginTop: 2 },
  sloganBox: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 16, 
    alignItems: 'center', 
    padding: 18, 
    marginBottom: 20 
  },
  slogan: { 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 14 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  scanBtn: { 
    backgroundColor: '#8af09b', 
    borderRadius: 8, 
    paddingHorizontal: 24, 
    paddingVertical: 10, 
    elevation: 2,
    flex: 1,
  },
  arBtn: {
    backgroundColor: '#a78bfa',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    elevation: 2,
    flex: 1,
  },
  scanText: { 
    color: '#fff', 
    fontWeight: '600',
    textAlign: 'center',
  },
  arText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredCard: {
    backgroundColor: '#f0fff0',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 20,
    elevation: 2,
  },
  featuredImg: { width: 100, height: 100 },
  featuredTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  featuredDesc: { fontSize: 12, color: 'gray' },
  learnMore: { color: '#4CAF50', fontWeight: '600', marginTop: 6 },
  tipTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
  tipCard: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 12, marginBottom: 20 },
  tipText: { fontSize: 13, color: '#2e7d32', marginBottom: 6 },
  picksTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
  productCard: { width: 120, marginRight: 12, alignItems: 'center' },
  productImg: { width: 100, height: 100, borderRadius: 8 },
  productName: { fontWeight: 'bold', marginTop: 6, textAlign: 'center' },
  productPrice: { color: 'gray', fontSize: 13 },
  cardIcons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: 60, 
    marginTop: 5 
  },
});