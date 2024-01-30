import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Platform, ScrollView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
const {width} = Dimensions.get('window');
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from './config'; // Update the import path accordingly
import { useNavigation } from '@react-navigation/native';

export function CreateSingleGameNormalMode() {
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => doc.data().name);
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const { navigate } = useNavigation();

  const handleCreateGame = () => {
    // ตรงนี้คุณสามารถเพิ่มโค้ดสำหรับการสร้างเกม
    console.log('เกมถูกสร้าง!');
    // เพิ่มโค้ดที่คุณต้องการทำเมื่อเกมถูกสร้าง
    navigate('SingleGameNormal');
  };

  const filteredUsers1 = users.filter((user) => user !== selectedValue2);
  const filteredUsers2 = users.filter((user) => user !== selectedValue1);

  const renderHeader = () => {
    return (
      <View style={[styles.header, styles.shadow]}>
        <Text style={styles.headerTitle}>{'หน้าสร้างเกมเดี่ยวโหมดปกติ'}</Text>
      </View>
    );
  };
  return (
    <View style={styles.saveAreaViewContainer}>
      
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

  <ScrollView>
    <View style={styles.container}>
      {renderHeader()}
      
      <Text style={styles.titleText}>ชื่อผู้เล่น</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue1}
          style={styles.pickerStyle}
          onValueChange={(itemValue, itemIndex) => setSelectedValue1(itemValue)}
        >
          {filteredUsers1.map((user, index) => (
            <Picker.Item key={index} label={user} value={user} />
          ))}
        </Picker>
      </View>

      <Text style={[styles.titleText, styles.opponentText]}>คู่แข่ง </Text>

      <Text style={styles.titleText}>ชื่อคู่แข่ง</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue2}
          style={styles.pickerStyle}
          onValueChange={(itemValue, itemIndex) => setSelectedValue2(itemValue)}
        >
          {filteredUsers2.map((user, index) => (
            <Picker.Item key={index} label={user} value={user} />
          ))}
        </Picker>
      </View>
      
      <TouchableOpacity style={styles.createGameButton} onPress={handleCreateGame}>
        <Text style={styles.createGameButtonText}>สร้างเกม</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',  // เพิ่มบรรทัดนี้
    width: Dimensions.get('window').width - 34,  // เพิ่มบรรทัดนี้
  },
  opponentText: {
    marginTop: 20,
    
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: Dimensions.get('window').width - 34,  // เพิ่มบรรทัดนี้
  },
  pickerStyle: {
    height: Platform.OS === 'ios' ? 200 : 50,
    width: Dimensions.get('window').width - 34,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    width: Dimensions.get('window').width - 34,
  },
  createGameButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width - 34,
    bottom: -5,
  },
  createGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFCCCC'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFCCCC'},
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },
  saveAreaViewContainer: {flex: 1, backgroundColor: '#F8F8FF'},
});