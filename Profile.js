import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button, Platform } from 'react-native';
import { auth, firestore, storage } from './config';
import { getDoc } from 'firebase/firestore';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export function Profile({ navigation }) {
  const [cuser, setCuser] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    async function CheckLogin() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCuser(user);

          const docRef = firestore.collection('users').doc(user.uid);

          docRef.get().then((doc) => {
            setName(doc.data().name);
          });

          let storageRef = firebase.storage().ref();
          let picRef = storageRef.child(user.uid + '.jpg').getDownloadURL();

          picRef.then((url) => setImage(url));
        }
      });
    }
    CheckLogin();
  }, []);

  useEffect(() => {
    async function AskPer() {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Need Permission');
        }
      }
    }
    AskPer();
  }, []);

  async function UploadPic() {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      let response = await fetch(result.uri);
      let blob = await response.blob();

      let storageRef = firebase.storage().ref();
      let picRef = storageRef.child(cuser.uid + '.jpg');

      picRef.put(blob).then((pic) => {
        alert('Uploaded!!');
        setImage(result.uri);
      });
    }
  }

  async function Logout() {
    await firebase.auth().signOut();
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={image == '' ? require('./profile.png') : { uri: image }} style={styles.profilePic} />
        <Text style={styles.profileName}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={UploadPic}>
        <Text style={styles.buttonText}>CHANGE PROFILE PIC</Text>
      </TouchableOpacity>
      <Button title="Log out" onPress={() => Logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF8800',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;