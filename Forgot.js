import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';  // เปลี่ยน import นี้

export function Forgot({ navigation }) {
  const [email, setEmail] = useState('');

  const ResetPass = async () => {
    try {
      const auth = getAuth();  // เพิ่มบรรทัดนี้
      await sendPasswordResetEmail(auth, email);
      alert('Email Sent');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Password reset error:', error.message);
    }
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={require('./gmail.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={ResetPass}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
  logo: {
    width: 200,
    height: 150,
    marginBottom: 30,
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
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '80%',
  },
  button: {
    backgroundColor: 'red', // Change the background color to red
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonSpacing: {
    height: 10,
  },
});
