import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const data = JSON.stringify({
        address: '0x1C0050665600Bc503eBc8dE52000D67196404d08',
      });

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://192.168.107.128:3001/readimage',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(response.data.map(item => item.filecid_url));
      setImages(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleImageClick(image) {
    setSelectedImage(image);
  }

  function handleBack() {
    setSelectedImage(null);
  }

  if (selectedImage) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <SafeAreaView style={styles.safeAreaView} />
        <SafeAreaView style={styles.safeAreaView2}>
          <View style={styles.fullSizeImageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullSizeImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <SafeAreaView style={styles.safeAreaView} />
      <SafeAreaView style={styles.safeAreaView2}>
        <Text style={styles.addressText}>Address : 0x1C0050665600Bc503eBc8dE52000D67196404d08</Text>
        <View style={styles.galleryContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => handleImageClick(image.filecid_url)}
            >
              <Image
                source={{ uri: image.filecid_url }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 0,
    backgroundColor: '#f9f9f9',
  },
  safeAreaView2: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  galleryContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    margin: 5,
    width: '45%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  thumbnailImage: {
    flex: 1,
  },
  fullSizeImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullSizeImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  backButtonText: {
    color: '#fff',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Home;
