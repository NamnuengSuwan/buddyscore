import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { auth } from './config';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully!');
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed. Please check your email and password.');
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleNavigateToForgot = () => {
    navigation.navigate('Forgot');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./shuttlecock.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Buddy Score</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword}
          maxLength={6} // เพิ่มคุณสมบัติ maxLength เพื่อกำหนดความยาวของรหัสผ่าน
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text onPress={handleNavigateToRegister} style={styles.linkText}>
          Go to Register
        </Text>
        <Text style={styles.linkSeparator}>|</Text>
        <Text onPress={handleNavigateToForgot} style={styles.linkText}>
          Go to Forgot
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  loginButton: {
    padding: 15,
    backgroundColor: '#3498db',
    marginTop: 10,
    width: '100%',
    borderRadius: 8,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    marginHorizontal: 10,
    color: '#3498db',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
