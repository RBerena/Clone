import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const plantDatabase = {
  "Peace Lily": {
    image: require('../assets/images/peace_lily.jpg'),
    description: "The Peace Lily is an air-purifying, low-maintenance plant that thrives indoors.",
    care: [
      { emoji: "💧", text: "Water once a week" },
      { emoji: "🌤", text: "Bright, indirect light" },
      { emoji: "🌱", text: "Use well-draining soil" },
      { emoji: "🪴", text: "Repot annually in spring" }
    ]
  },
  "Snake Plant": {
    image: require('../assets/images/snake_plant.jpg'),
    description: "Snake Plants are hardy and excellent air purifiers, perfect for beginners.",
    care: [
      { emoji: "💧", text: "Water every 2-3 weeks" },
      { emoji: "🌞", text: "Tolerates low light" },
      { emoji: "🌱", text: "Use cactus potting mix" },
      { emoji: "🪴", text: "Fertilize in spring and summer" }
    ]
  },
  "Aloe Vera": {
    image: require('../assets/images/aloe_vera.jpg'),
    description: "Aloe Vera is known for its medicinal properties and low water needs.",
    care: [
      { emoji: "💧", text: "Water when soil is dry" },
      { emoji: "☀", text: "Direct sunlight" },
      { emoji: "🌱", text: "Sandy soil preferred" },
      { emoji: "🪴", text: "Minimal maintenance" }
    ]
  }
};

const PlantDetailsScreen = ({ route }) => {
  const { plantName } = route.params;
  const plant = plantDatabase[plantName];

  if (!plant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Plant data not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={plant.image} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{plantName}</Text>
      <Text style={styles.description}>{plant.description}</Text>

      <Text style={styles.careTitle}>🌿 Care Instructions:</Text>
      {plant.care.map((item, index) => (
        <Text key={index} style={styles.careItem}>
          {item.emoji} {item.text}
        </Text>
      ))}
    </ScrollView>
  );
};

export default PlantDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f7f8f6',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#234b2c',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  careTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#26784e',
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  careItem: {
    fontSize: 15,
    marginBottom: 6,
    alignSelf: 'flex-start'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    fontSize: 18,
    color: 'red'
  }
});
