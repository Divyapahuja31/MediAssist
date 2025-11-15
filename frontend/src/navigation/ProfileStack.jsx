import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/main/ProfileScreen';
import EmergencyCardScreen from '../screens/main/EmergencyCardScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmergencyCard"
                component={EmergencyCardScreen}
                options={{ title: 'Emergency Card' }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;
