// Import necessary components
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native'; // Import Image component
import { auth } from './config'; // Updated import statement
import { Login } from './Login';
import { Register } from './Register';
import { Forgot } from './Forgot';
import { Rank } from './Rank';
import { CreateSingleGamePracticeMode } from './CreateSingleGamePracticeMode';
import { CreateMultiplayerPracticeMode } from './CreateMultiplayerPracticeMode';
import { CreateSingleGameNormalMode } from './CreateSingleGameNormalMode';
import { CreateMultiplayerNormalMode } from './CreateMultiplayerNormalMode';
import { Profile } from './Profile'; // Import the Profile component
import { SingleGameNormal } from './SingleGameNormal';
import { SingleGamePracticeMode } from './SingleGamePracticeMode';
import { MultiplayerNormal } from './MultiplayerNormal';
import { MultiplayerGamePracticeMode } from './MultiplayerGamePracticeMode';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="CreateSingleGamePracticeMode" component={CreateSingleGamePracticeMode} />
        <Stack.Screen name="CreateMultiplayerPracticeMode" component={CreateMultiplayerPracticeMode} />
        <Stack.Screen name="CreateSingleGameNormalMode" component={CreateSingleGameNormalMode} />
        <Stack.Screen name="CreateMultiplayerNormalMode" component={CreateMultiplayerNormalMode} />
        <Stack.Screen name="SingleGameNormal" component={SingleGameNormal} />
        <Stack.Screen name="SingleGamePracticeMode" component={SingleGamePracticeMode} />
        <Stack.Screen name="MultiplayerNormal" component={MultiplayerNormal} />
        <Stack.Screen name="MultiplayerGamePracticeMode" component={MultiplayerGamePracticeMode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Rank"
        component={Rank}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./top-three.png') : require('./top-three.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./profile-user.png') : require('./profile-user.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
