import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MedicinesScreen from '../screens/MedicinesScreen';
import RecordsScreen from '../screens/RecordsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import ProfileScreen from '../screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 15,
          paddingTop: 5,
          backgroundColor: '#ffffff',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Medicines') iconName = focused ? 'medkit' : 'medkit-outline';
          else if (route.name === 'Records') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Emergency') iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Medicines" component={MedicinesScreen} />
      <Tab.Screen name="Records" component={RecordsScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
