import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicationListScreen from '../screens/main/MedicationListScreen';
import MedicationDetailScreen from '../screens/main/MedicationDetailScreen';
import AddMedicationScreen from '../screens/main/AddMedicationScreen';
import ScheduleFormScreen from '../screens/main/ScheduleFormScreen';

const Stack = createNativeStackNavigator();

const MedicationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MedicationList"
                component={MedicationListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MedicationDetail"
                component={MedicationDetailScreen}
                options={{ title: 'Medication Details' }}
            />
            <Stack.Screen
                name="AddMedication"
                component={AddMedicationScreen}
                options={{ title: 'Add Medication' }}
            />
            <Stack.Screen
                name="ScheduleForm"
                component={ScheduleFormScreen}
                options={{ title: 'Manage Schedule' }}
            />
        </Stack.Navigator>
    );
};

export default MedicationStack;
