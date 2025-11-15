import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getMedicationById, deleteMedication } from '../../api/medications';
import { getSchedules } from '../../api/schedules';

const MedicationDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [medication, setMedication] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [medData, scheduleData] = await Promise.all([
                getMedicationById(id),
                getSchedules({ medicationId: id })
            ]);
            setMedication(medData);
            setSchedules(scheduleData);
        } catch (error) {
            console.error("Error fetching medication details:", error);
            Alert.alert("Error", "Could not load details");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [id])
    );

    const handleDelete = () => {
        Alert.alert(
            "Delete Medication",
            "Are you sure? This will also delete all schedules.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMedication(id);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!medication) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name}>{medication.name}</Text>
                        <TouchableOpacity onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.detail}>Dosage: {medication.dosage}</Text>
                    {medication.frequency && <Text style={styles.detail}>Frequency: {medication.frequency}</Text>}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Schedules</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ScheduleForm', { medicationId: id })}
                    >
                        <Text style={styles.addButton}>+ Add Schedule</Text>
                    </TouchableOpacity>
                </View>

                {schedules.map(schedule => (
                    <View key={schedule.id} style={styles.scheduleItem}>
                        <Text style={styles.scheduleTime}>
                            {new Date(schedule.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ScheduleForm', {
                                medicationId: id,
                                scheduleId: schedule.id,
                                existingSchedule: schedule
                            })}
                        >
                            <Ionicons name="create-outline" size={20} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                ))}
                {schedules.length === 0 && (
                    <Text style={styles.emptyText}>No schedules set.</Text>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    content: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    detail: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    scheduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    scheduleTime: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    }
});

export default MedicationDetailScreen;
