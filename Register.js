import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Dimensions } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc,  } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [descrip, setDescrip] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access the camera roll is required!');
      }
    })();
  }, []);

  const uploadImageToStorage = async (uri, imageName) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, imageName + '.jpg');
    
    try {
      const response = await uploadBytes(storageRef, await fetch(uri).then((r) => r.blob()));
      const downloadURL = await getDownloadURL(response.ref);
      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error.message);
      throw error;
    }
  };
  
  const handleRegister = async () => {
    try {
      // Validate password length
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
  
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Upload image to Firebase Storage
      const imageName = userCredential.user.uid;
      const imageUrl = selectedImage ? await uploadImageToStorage(selectedImage.localUri, imageName) : null;
  
      // Add user details to Firestore
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userData = {
        name: name,
        description: descrip,
        imageUrl: imageUrl,
      };
  
      await setDoc(userDocRef, userData);
  
      alert('Registration Successful');
    } catch (error) {
      console.log('Registration error:', error.message);
    }
  };
  

  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access the camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (!pickerResult.canceled) {
        // Access the first selected asset
        const selectedAsset = pickerResult.assets ? pickerResult.assets[0] : null;

        if (selectedAsset) {
          setSelectedImage({ localUri: selectedAsset.uri });
        }
      }
    } catch (error) {
      console.log('Image selection error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the selected image above the text input for name */}
      {selectedImage && (
        <Image source={{ uri: selectedImage.localUri }} style={styles.selectedImage} />
      )}
  
      <View style={styles.inputContainer}>

      <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
  
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            maxLength={6} // Limit to 6 characters
          />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.passwordVisibilityButtonText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
  
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={descrip}
          onChangeText={setDescrip}
        />
  
        {/* Button to select an image */}
       
      </View>
  
      {/* Move the selected image display above the buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  passwordVisibilityButton: {
    padding: 10,
  },
  passwordVisibilityButtonText: {
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '80%',
  },
  button: {
    backgroundColor: '#4CAF50',  // Green color
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10, // Add margin to create space
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',  // White color
    fontSize: 16,
  },
  buttonSpacing: {
    height: 10,
  },
  selectedImage: {
    width: width - 40,
    height: (width - 40) * 0.8,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});