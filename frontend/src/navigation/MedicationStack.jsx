import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicationListScreen from '../screens/main/Medications/MedicationListScreen';
import MedicationDetailScreen from '../screens/main/Medications/MedicationDetailScreen';
import MedicationFormScreen from '../screens/main/Medications/MedicationFormScreen';
import ScheduleFormScreen from '../screens/main/Schedules/ScheduleFormScreen';
import ScheduleListScreen from '../screens/main/Schedules/ScheduleListScreen';
import ScheduleDetailScreen from '../screens/main/Schedules/ScheduleDetailScreen';

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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MedicationForm"
                component={MedicationFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Schedules"
                component={ScheduleListScreen}
                options={{ title: 'All Schedules' }}
            />
            <Stack.Screen
                name="ScheduleForm"
                component={ScheduleFormScreen}
                options={{ title: 'Manage Schedule' }}
            />
            <Stack.Screen
                name="ScheduleDetail"
                component={ScheduleDetailScreen}
                options={{ title: 'Schedule Details' }}
            />
        </Stack.Navigator>
    );
};

export default MedicationStack;
