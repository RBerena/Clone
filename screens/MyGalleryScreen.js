import { AntDesign } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { samplePlants } from '../PlantsData';

// MyGalleryScreen shows user's photos and favorites with dropdown toggles
export default function MyGalleryScreen() {
  const route = useRoute();
  const [selectedDropdown, setSelectedDropdown] = useState('My Photos');
  const [favoriteIds, setFavoriteIds] = useState([]);

  // On route param change, update favorites list and show Favorite tab
  useEffect(() => {
    if (route.params?.favoriteIds) {
      setFavoriteIds(route.params.favoriteIds);
      setSelectedDropdown('Favorite');
    }
  }, [route.params]);

  const photos = samplePlants;
  // Filter favorite photos based on favoriteIds
  const favoritePhotos = photos.filter((photo) => favoriteIds.includes(photo.id));

  // Render flat list of images in a 2-column grid
  const renderImages = (data) => (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image source={item.image} style={styles.image} />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Gallery</Text>

      {/* Dropdown button for My Photos */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setSelectedDropdown('My Photos')}
      >
        <Text style={styles.dropdownText}>
          <AntDesign name="camera" size={16} /> My Photos
        </Text>
        <AntDesign name="down" size={12} />
      </TouchableOpacity>

      {/* Show photos if My Photos selected */}
      {selectedDropdown === 'My Photos' && renderImages(photos)}

      {/* Dropdown button for Favorite photos */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setSelectedDropdown('Favorite')}
      >
        <Text style={styles.dropdownText}>
          <AntDesign name="heart" size={16} color="red" /> Favorite
        </Text>
        <AntDesign name="down" size={12} />
      </TouchableOpacity>

      {/* Show favorite photos if Favorite selected */}
      {selectedDropdown === 'Favorite' && renderImages(favoritePhotos)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#a42222',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: 160,
    height: 160,
    margin: 8,
    borderRadius: 6,
  },
});
