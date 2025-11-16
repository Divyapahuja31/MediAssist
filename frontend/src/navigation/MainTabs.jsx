import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import MedicationStack from './MedicationStack';
import ScheduleStack from './ScheduleStack';
import PrescriptionStack from './PrescriptionStack';
import ProfileStack from './ProfileStack';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Medications') {
                        iconName = focused ? 'medkit' : 'medkit-outline';
                    } else if (route.name === 'Schedules') {
                        iconName = focused ? 'alarm' : 'alarm-outline';
                    } else if (route.name === 'Prescriptions') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
            <Tab.Screen name="Medications" component={MedicationStack} options={{ headerShown: false }} />
            <Tab.Screen name="Schedules" component={ScheduleStack} options={{ headerShown: false }} />
            <Tab.Screen name="Prescriptions" component={PrescriptionStack} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default MainTabs;
