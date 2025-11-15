import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrescriptionListScreen from '../screens/main/PrescriptionListScreen';
import UploadPrescriptionScreen from '../screens/main/UploadPrescriptionScreen';

const Stack = createNativeStackNavigator();

const PrescriptionStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PrescriptionList"
                component={PrescriptionListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UploadPrescription"
                component={UploadPrescriptionScreen}
                options={{ title: 'Upload Prescription' }}
            />
        </Stack.Navigator>
    );
};

export default PrescriptionStack;
