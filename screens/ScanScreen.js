import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BACKEND_URL } from '@/config/apiConfig';


const ScanScreen = () => {
  const [CardImage, SetCardImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
 
  useEffect(() => {
    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(camStatus === 'granted');
 
      const { status: galStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galStatus === 'granted');
    })();
  }, []);
 
  const handleOpenCamera = async () => {
    if (!cameraPermission) {
      alert('Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      SetCardImage(result.assets[0].uri);
      setPrediction(null);
    }
  };
 
  const handlePickImage = async () => {
    if (!galleryPermission) {
      alert('Gallery permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      SetCardImage(result.assets[0].uri);
      setPrediction(null);
    }
  };
 
  const handlePredict = async () => {
    if (!CardImage) {
      alert('Please take or upload an image first.');
      return;
    }
 
    setIsLoading(true);
    setPrediction(null);
 
    try {
      const localUri = CardImage;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;
 
      console.log('Uploading:', { uri: localUri, name: filename, type });
 
      const formData = new FormData();
      // Key changed here to 'plant_image' to match Flask backend
      formData.append('plant_image', {
        uri: localUri,
        name: filename,
        type,
      });
 
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('Response status:', response.status); 
 
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }
 
      const data = await response.json();
      console.log('Prediction result:', data,"\n Species:", data["species"]);
      setPrediction(data);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Prediction error', error.message || 'Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleReset = () => {
    SetCardImage(null);
    setPrediction(null);
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>🌿 Plant Scanner</Text>
        <Text style={styles.subtitleText}>Take or upload an image to predict the species</Text>
      </View>
 
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
          <Text style={styles.buttonText}>📷 Take Photo</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>🖼️ Upload Image</Text>
        </TouchableOpacity>
      </View>
 
      {CardImage && (
        <>
          <Image source={{ uri: CardImage }} style={styles.imageStyle} />
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.predictButton, isLoading && styles.disabledButton]}
              onPress={handlePredict}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🔍 Predict</Text>
              )}
            </TouchableOpacity>
 
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={[styles.buttonText, { color: '#2c3e50' }]}>♻️ Reset</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
 
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionTitle}>🔎 Prediction Result:</Text>
          {'error' in prediction ? (
            <Text style={styles.predictionText}>{prediction.error}</Text>
          ) : (
            <>
              <Text style={styles.predictionText}>🌱 Species: {prediction.species}</Text>
              <Text style={styles.predictionText}>🎯 Confidence: {prediction.confidence}%</Text>
              <Text style={styles.predictionText}>📏 Size (WxH): {prediction.size_cm} cm</Text>
              <Text style={styles.predictionText}>🌿 CO₂ Intake: {prediction.co2_g_per_day} g/day</Text>
              {prediction.image_with_box && (
                <Image
                  source={{ uri: prediction.image_with_box }}
                  style={[styles.imageStyle, { marginTop: 10 }]}
                />
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f8',
    paddingTop: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
  },
  subtitleText: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2c3e50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imageStyle: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginVertical: 20,
    resizeMode: 'cover',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  predictButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  predictionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    width: '100%',
    elevation: 3,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  predictionText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 6,
  },
});
 
export default ScanScreen;