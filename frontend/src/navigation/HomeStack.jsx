import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import AdherenceHistoryScreen from '../screens/main/AdherenceHistoryScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeMain"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdherenceHistory"
                component={AdherenceHistoryScreen}
                options={{ title: 'History' }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
