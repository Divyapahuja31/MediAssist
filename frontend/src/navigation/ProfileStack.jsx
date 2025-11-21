import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/main/Profile/ProfileScreen';
import ProfileEditScreen from '../screens/main/Profile/ProfileEditScreen';
import EmergencyCardScreen from '../screens/main/Emergency/EmergencyCardScreen';

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
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EmergencyCard"
                component={EmergencyCardScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStack;
