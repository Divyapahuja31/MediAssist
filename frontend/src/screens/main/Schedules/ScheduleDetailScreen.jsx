import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, StatusBar, Switch, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchedule, deleteSchedule, markScheduleTaken, updateSchedule } from '../../../api/schedules';
import { listAdherenceLogs } from '../../../api/adherence';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTime, formatDate } from '../../../utils/formatters';

const ScheduleDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const queryClient = useQueryClient();
    const [snoozeVisible, setSnoozeVisible] = useState(false);

    // Fetch Schedule Details
    const { data: scheduleData, isLoading: loadingSchedule } = useQuery({
        queryKey: ['schedule', id],
        queryFn: () => getSchedule(id),
    });

    // Fetch History
    const { data: historyData } = useQuery({
        queryKey: ['adherence', { scheduleId: id, limit: 10 }],
        queryFn: () => listAdherenceLogs({ scheduleId: id, limit: 10 }),
    });

    const markTakenMutation = useMutation({
        mutationFn: () => markScheduleTaken(id, { eventType: 'TAKEN', timestamp: new Date().toISOString() }),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedule', id]);
            queryClient.invalidateQueries(['adherence']);
            queryClient.invalidateQueries(['schedules']);
            Alert.alert('Success', 'Marked as taken!');
        },
        onError: () => Alert.alert('Error', 'Failed to mark as taken'),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ active }) => updateSchedule(id, { active }),
        onSuccess: () => queryClient.invalidateQueries(['schedule', id]),
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            navigation.goBack();
        },
    });

    const handleDelete = () => {
        Alert.alert('Delete Schedule', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
        ]);
    };

    const handleSnooze = (minutes) => {
        // For MVP, just alerting. In real app, calculate new time and PATCH schedule
        Alert.alert('Snooze', `Snoozed for ${minutes} minutes (Simulated)`);
        setSnoozeVisible(false);
    };

    if (loadingSchedule) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    const schedule = scheduleData?.data;
    const history = historyData?.data || [];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => navigation.navigate('ScheduleForm', { id: schedule.id })} style={styles.iconBtn}>
                            <Ionicons name="create-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Main Info Card */}
                    <View style={styles.mainCard}>
                        <Text style={styles.medName}>{schedule?.medication?.name}</Text>
                        <Text style={styles.medDetail}>{schedule?.medication?.formulation}</Text>

                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={32} color="#00b894" />
                            <Text style={styles.timeText}>{formatTime(schedule?.timeOfDay)}</Text>
                        </View>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Frequency</Text>
                                <Text style={styles.metaValue}>{schedule?.frequency}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Dosage</Text>
                                <Text style={styles.metaValue}>{schedule?.dosage}</Text>
                            </View>
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Active Reminder</Text>
                            <Switch
                                value={schedule?.active}
                                onValueChange={(val) => toggleMutation.mutate({ active: val })}
                                trackColor={{ false: "#dcdde1", true: "#74b9ff" }}
                                thumbColor={schedule?.active ? "#0984e3" : "#f5f6fa"}
                            />
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.primaryBtn]}
                            onPress={() => markTakenMutation.mutate()}
                        >
                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            <Text style={styles.primaryBtnText}>Mark Taken</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.secondaryBtn]}
                            onPress={() => setSnoozeVisible(true)}
                        >
                            <Ionicons name="alarm" size={24} color="#00b894" />
                            <Text style={styles.secondaryBtnText}>Snooze</Text>
                        </TouchableOpacity>
                    </View>

                    {/* History */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent History</Text>
                        {history.length === 0 ? (
                            <Text style={styles.emptyText}>No history recorded yet.</Text>
                        ) : (
                            history.map(log => (
                                <View key={log.id} style={styles.logItem}>
                                    <View style={[styles.dot, { backgroundColor: log.eventType === 'TAKEN' ? '#00b894' : '#ff7675' }]} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.logTitle}>{log.eventType === 'TAKEN' ? 'Taken' : 'Missed'}</Text>
                                        <Text style={styles.logSub}>{formatDate(log.timestamp)} at {formatTime(log.timestamp)}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    <View style={styles.footerSpacer} />
                </ScrollView>
            </SafeAreaView>

            {/* Snooze Modal */}
            <Modal
                transparent={true}
                visible={snoozeVisible}
                animationType="slide"
                onRequestClose={() => setSnoozeVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Snooze for...</Text>
                        {[10, 30, 60].map(min => (
                            <TouchableOpacity
                                key={min}
                                style={styles.modalOption}
                                onPress={() => handleSnooze(min)}
                            >
                                <Text style={styles.modalOptionText}>{min} Minutes</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.modalOption, styles.cancelOption]}
                            onPress={() => setSnoozeVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        height: 220,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backBtn: {
        padding: 5,
    },
    actions: {
        flexDirection: 'row',
    },
    iconBtn: {
        marginLeft: 15,
        padding: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 25,
    },
    medName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        textAlign: 'center',
    },
    medDetail: {
        fontSize: 16,
        color: '#636e72',
        marginBottom: 20,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f9e5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        marginBottom: 20,
    },
    timeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00b894',
        marginLeft: 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f2f6',
        paddingTop: 20,
    },
    metaItem: {
        alignItems: 'center',
        flex: 1,
    },
    metaLabel: {
        fontSize: 12,
        color: '#b2bec3',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    metaValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
    },
    switchLabel: {
        fontSize: 16,
        color: '#636e72',
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryBtn: {
        backgroundColor: '#00b894',
        marginRight: 10,
    },
    primaryBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    secondaryBtn: {
        backgroundColor: '#fff',
        marginLeft: 10,
    },
    secondaryBtnText: {
        color: '#00b894',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 15,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 15,
    },
    logTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
    },
    logSub: {
        fontSize: 12,
        color: '#636e72',
        marginTop: 2,
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerSpacer: {
        height: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f2f6',
        alignItems: 'center',
    },
    modalOptionText: {
        fontSize: 18,
        color: '#00b894',
    },
    cancelOption: {
        marginTop: 10,
        borderBottomWidth: 0,
    },
    cancelText: {
        fontSize: 18,
        color: '#ff7675',
        fontWeight: '600',
    },
});

export default ScheduleDetailScreen;
