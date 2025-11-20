import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const interests = [
  { label: 'Anthophile', image: require('../assets/images/Anthophile.png') },
  { label: 'Floral Arrangement', image: require('../assets/images/Floral.png') },
  { label: 'Botanical Art', image: require('../assets/images/Botanical.png') },
  { label: 'Indoor Gardening', image: require('../assets/images/IndoorGardening.png') },
];

export default function InterestsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Interests</Text>
      {interests.map((item, index) => (
        <View key={index} style={styles.card}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  image: { width: 100, height: 100, marginBottom: 8 },
  label: { fontSize: 16 },
});
