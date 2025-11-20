import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PrescriptionListScreen from '../screens/main/Prescriptions/PrescriptionListScreen';
import PrescriptionUploadScreen from '../screens/main/Prescriptions/PrescriptionUploadScreen';
import PrescriptionDetailScreen from '../screens/main/Prescriptions/PrescriptionDetailScreen';

const Stack = createStackNavigator();

const PrescriptionStack = () => {
    return (
        <Stack.Navigator initialRouteName="PrescriptionList">
            <Stack.Screen
                name="PrescriptionList"
                component={PrescriptionListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PrescriptionUpload"
                component={PrescriptionUploadScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PrescriptionDetail"
                component={PrescriptionDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default PrescriptionStack;
