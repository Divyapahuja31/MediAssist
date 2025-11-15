import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchedule, deleteSchedule, markScheduleTaken } from '../../../api/schedules';
import { Ionicons } from '@expo/vector-icons';

const ScheduleDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['schedule', id],
        queryFn: () => getSchedule(id),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            navigation.goBack();
        },
    });

    const markTakenMutation = useMutation({
        mutationFn: () => markScheduleTaken(id, { eventType: 'TAKEN', timestamp: new Date().toISOString() }),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            Alert.alert('Success', 'Marked as taken');
        },
    });

    const handleDelete = () => {
        Alert.alert('Delete Schedule', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    const schedule = data?.data;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.medName}>{schedule?.medication?.name}</Text>
                <Text style={styles.time}>{schedule?.timeOfDay}</Text>
                <Text style={styles.detail}>{schedule?.frequency} • {schedule?.dosage}</Text>
                <Text style={styles.status}>{schedule?.active ? 'Active' : 'Inactive'}</Text>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={() => markTakenMutation.mutate()}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.actionText}>Mark as Taken</Text>
            </TouchableOpacity>

            <View style={styles.row}>
                <TouchableOpacity style={[styles.secondaryBtn, { marginRight: 10 }]} onPress={() => navigation.navigate('ScheduleForm', { id })}>
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={styles.secondaryText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={[styles.secondaryText, { color: '#FF3B30' }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 20, 
        backgroundColor: '#F5F7FA' 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    card: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 16, 
        alignItems: 'center', 
        marginBottom: 30 
    },
    medName: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 10 
    },
    time: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#007AFF', 
        marginBottom: 10 
    },
    detail: { 
        fontSize: 18, 
        color: '#666', 
        marginBottom: 5 
    },
    status: { 
        fontSize: 14, 
        color: '#999', 
        marginTop: 10 
    },
    actionBtn: { 
        backgroundColor: '#4CAF50', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 15 
    },
    actionText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 10 
    },
    row: { 
        flexDirection: 'row' 
    },
    secondaryBtn: { 
        flex: 1, 
        backgroundColor: '#fff', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#ddd' 
    },
    secondaryText: { 
        color: '#007AFF', 
        fontSize: 16, 
        fontWeight: '600', 
        marginLeft: 8 
    },
});

export default ScheduleDetailScreen;
