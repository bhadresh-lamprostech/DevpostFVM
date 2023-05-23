import React, { useState, useEffect } from 'react';
import { Image, Alert, View, Button, StyleSheet } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import axios from 'axios';

const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}${random}`;
};

const ScannerScreen = ({ navigation }) => {
  const address = "0x1C0050665600Bc503eBc8dE52000D67196404d08";
  const [scannedImage, setScannedImage] = useState('');

  const scanDocument = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument();
    if (scannedImages.length > 0) {
      setScannedImage(scannedImages[0]);
      uploadImage(scannedImages[0]); // Upload the scanned image
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const formData = new FormData();
      console.log(imageUri);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'scannedImage.jpg',
      });
      console.log('uploading....');

      const response = await axios.post('http://192.168.107.128:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const dynamicLink = response.data.dynamicLinks[0];
        const splitLink = dynamicLink.split('-');
        const url = await `${dynamicLink}/${splitLink[0]}`;

        // Generate a unique ID for the insertion
        const uniqueId = generateUniqueId();
          console.log(uniqueId)
          console.log(url)
          console.log(address)
        // Insert the scanned image and URL into the database
        const insertResponse = await axios.post('http://192.168.107.128:3001/insertimage', {
          id: uniqueId,
          filecid: url,
          address: address,
          // id : 12,
          // filecid : "hdshfhsdjfdsfsk",
          // address : "0x123454",

        });

        console.log(insertResponse)

        if (insertResponse.status === 200) {
          console.log('Image uploaded and inserted successfully');
          // Handle success case
        } else {
          console.log('Image upload failed');
          // Handle failure case
        }
      } else {
        console.log('Image upload failed');
        // Handle failure case
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      // Handle error case
    }
  };

  useEffect(() => {
    scanDocument();
  }, []);

  return (
    <View style={styles.container}>
      {scannedImage !== '' && (
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: scannedImage }}
        />
      )}
      <Button title="Scan Document" onPress={scanDocument} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  button: {
    width: 200,
    height: 50,
  },
});

export default ScannerScreen;


//http://192.168.107.128:3001/insertimage