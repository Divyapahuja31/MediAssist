import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listSchedules, updateSchedule, deleteSchedule } from '../../../api/schedules';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleCard from '../../../components/ScheduleCard';

const ScheduleListScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all'); 

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['schedules'],
        queryFn: () => listSchedules(),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, active }) => updateSchedule(id, { active }),
        onSuccess: () => queryClient.invalidateQueries(['schedules']),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            Alert.alert('Success', 'Schedule deleted');
        },
        onError: () => Alert.alert('Error', 'Failed to delete schedule'),
    });

    const handleDelete = (id) => {
        Alert.alert('Delete Schedule', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    const schedules = Array.isArray(data?.data?.data) ? data.data.data : [];

    const filteredSchedules = schedules.filter(s => {
        if (filter === 'active') return s.active;
        if (filter === 'paused') return !s.active;
        return true;
    });

    const renderItem = ({ item }) => (
        <ScheduleCard
            schedule={item}
            onToggle={(val) => toggleMutation.mutate({ id: item.id, active: val })}
            onPress={() => navigation.navigate('ScheduleForm', { id: item.id, medicationId: item.medicationId })}
            onDelete={() => handleDelete(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>Schedules</Text>
                    <Text style={styles.subtitle}>Manage your reminders</Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    {['all', 'active', 'paused'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterTab, filter === f && styles.activeFilterTab]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.content}>
                    {isLoading ? (
                        <ActivityIndicator style={styles.center} size="large" color="#00b894" />
                    ) : (
                        <FlatList
                            data={filteredSchedules}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="alarm-outline" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>No schedules found.</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#00b894" />
                            }
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('ScheduleForm')}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    filterTab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 10,
    },
    activeFilterTab: {
        backgroundColor: '#fff',
    },
    filterText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        fontSize: 14,
    },
    activeFilterText: {
        color: '#00b894',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingTop: 10,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#00b894',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

export default ScheduleListScreen;
