import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrescriptionListScreen from '../screens/main/Prescriptions/PrescriptionListScreen';
import PrescriptionUploadScreen from '../screens/main/Prescriptions/PrescriptionUploadScreen';
import PrescriptionDetailScreen from '../screens/main/Prescriptions/PrescriptionDetailScreen';

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
                name="PrescriptionUpload"
                component={PrescriptionUploadScreen}
                options={{ title: 'Upload Prescription' }}
            />
            <Stack.Screen
                name="PrescriptionDetail"
                component={PrescriptionDetailScreen}
                options={{ title: 'View Prescription' }}
            />
        </Stack.Navigator>
    );
};

export default PrescriptionStack;
