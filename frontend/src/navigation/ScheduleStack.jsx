import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleListScreen from '../screens/main/Schedules/ScheduleListScreen';
import ScheduleFormScreen from '../screens/main/Schedules/ScheduleFormScreen';
import ScheduleDetailScreen from '../screens/main/Schedules/ScheduleDetailScreen';

const Stack = createStackNavigator();

const ScheduleStack = () => {
    return (
        <Stack.Navigator initialRouteName="ScheduleList">
            <Stack.Screen
                name="ScheduleList"
                component={ScheduleListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ScheduleForm"
                component={ScheduleFormScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ScheduleDetail"
                component={ScheduleDetailScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default ScheduleStack;
