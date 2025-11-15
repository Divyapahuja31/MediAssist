import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
    SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createSchedule, updateSchedule, deleteSchedule } from '../../api/schedules';

const ScheduleFormScreen = ({ route, navigation }) => {
    const { medicationId, scheduleId, existingSchedule } = route.params;
    const isEditing = !!scheduleId;

    const [date, setDate] = useState(existingSchedule ? new Date(existingSchedule.time) : new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                medicationId,
                time: date.toISOString(),
                // Add other fields like dosage if needed per schedule
            };

            if (isEditing) {
                await updateSchedule(scheduleId, payload);
            } else {
                await createSchedule(payload);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save schedule');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Schedule",
            "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteSchedule(scheduleId);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>Select Time</Text>

                {Platform.OS === 'android' && (
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeButton}>
                        <Text style={styles.timeText}>
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                )}

                {(showPicker || Platform.OS === 'ios') && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={onChange}
                        style={styles.picker}
                    />
                )}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {isEditing ? 'Update Schedule' : 'Add Schedule'}
                    </Text>
                </TouchableOpacity>

                {isEditing && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        <Text style={styles.deleteButtonText}>Delete Schedule</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    timeButton: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 20,
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    picker: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginTop: 15,
        padding: 15,
    },
    deleteButtonText: {
        color: 'red',
        fontSize: 16,
    }
});

export default ScheduleFormScreen;
