import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listSchedules, updateSchedule } from '../../../api/schedules';
import { Ionicons } from '@expo/vector-icons';

const ScheduleListScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['schedules'],
        queryFn: () => listSchedules(),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, active }) => updateSchedule(id, { active }),
        onSuccess: () => queryClient.invalidateQueries(['schedules']),
    });

    const schedules = data?.data || [];

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.center}>Error loading schedules</Text>;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ScheduleDetail', { id: item.id })}
        >
            <View style={styles.info}>
                <Text style={styles.medName}>{item.medication?.name || 'Unknown Med'}</Text>
                <Text style={styles.details}>{item.timeOfDay} • {item.frequency}</Text>
                <Text style={styles.dosage}>{item.dosage}</Text>
            </View>
            <Switch
                value={item.active}
                onValueChange={(val) => toggleMutation.mutate({ id: item.id, active: val })}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={item.active ? "#007AFF" : "#f4f3f4"}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No schedules set.</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ScheduleForm')}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    info: { flex: 1 },
    medName: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    details: { 
        fontSize: 14, 
        color: '#666', 
        marginTop: 2 
    },
    dosage: { 
        fontSize: 14, 
        color: '#007AFF', 
        marginTop: 2 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: '#666', 
        fontSize: 16 
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default ScheduleListScreen;
