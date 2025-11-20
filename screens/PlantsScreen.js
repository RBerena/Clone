// PlantsScreen.js

import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { CartContext } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext'; // import favorites context
import { samplePlants } from '../PlantsData';

export default function PlantsScreen() {
  const { addToCart } = useContext(CartContext);
  const { favorites, toggleFavorite, isFavorite } = useFavorites(); // use favorites context
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Add plant item to cart and show success toast
  const handleAddToCart = (item) => {
    addToCart(item);
    Toast.show({
      type: 'success',
      text1: `${item.name} added to cart`,
      position: 'bottom',
      visibilityTime: 1500,
    });
  };

  // Filter plants by search text and filter tag
  const filteredPlants = samplePlants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      plant.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // Render each plant card with favorite toggle and add to cart button
  const renderPlant = ({ item }) => {
    const favorited = isFavorite(item.id); // check if plant is favorite

    return (
      <View style={styles.card}>
        <View style={styles.userRow}>
          <Ionicons name="person-circle-outline" size={24} color="gray" />
          <Text style={styles.userText}>
            {item.user} · {item.time} / {item.location}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            onPress={() => toggleFavorite(item.id)} // toggle favorite status
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>

        <Image source={item.image} style={styles.image} />
        <Text style={styles.plantName}>{item.name}</Text>
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        style={styles.search}
        placeholder="Search for Plants"
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter buttons */}
      <View style={styles.filters}>
        {['Popular', 'Indoor', 'Outdoor', 'All'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && { backgroundColor: '#3A7F4C' },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && { color: '#fff', fontWeight: 'bold' },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Plants list */}
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        renderItem={renderPlant}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

// Styles for PlantsScreen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 10,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#D5F3DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    color: '#3A7F4C',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    padding: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 13,
  },
  image: {
    width: '94%',
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'center',
  },
  plantName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#444',
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: '#3A7F4C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: '600',
  },
});
