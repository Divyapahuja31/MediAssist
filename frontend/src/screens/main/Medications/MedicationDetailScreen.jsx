import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, StatusBar, Switch } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedication, deleteMedication } from '../../../api/medications';
import { listSchedules } from '../../../api/schedules';
import { listPrescriptions } from '../../../api/prescriptions';
import { listAdherenceLogs, createAdherenceLog, getAdherenceSummary } from '../../../api/adherence';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime, formatDate } from '../../../utils/formatters';

const MedicationDetailScreen = ({ route, navigation }) => {
    const { id, initialName, initialFormulation, initialStock, fromHome } = route.params;
    const queryClient = useQueryClient();

    // 1. Fetch Medication Details
    const { data: medData, isLoading: medLoading } = useQuery({
        queryKey: ['medication', id],
        queryFn: () => getMedication(id),
        initialData: initialName ? {
            data: {
                id,
                name: initialName,
                formulation: initialFormulation,
                stock: initialStock
            }
        } : undefined
    });

    // 2. Fetch Schedules
    const { data: schedulesData } = useQuery({
        queryKey: ['schedules', { medicationId: id }],
        queryFn: () => listSchedules({ medicationId: id }),
    });

    // 3. Fetch Prescriptions
    const { data: prescriptionsData } = useQuery({
        queryKey: ['prescriptions', { medicationId: id }],
        queryFn: () => listPrescriptions({ medicationId: id }),
    });

    // 4. Fetch Adherence Logs
    const { data: adherenceData } = useQuery({
        queryKey: ['adherence', { medicationId: id, limit: 20 }],
        queryFn: () => listAdherenceLogs({ medicationId: id, limit: 20 }),
    });

    // 5. Fetch Adherence Summary (KPI)
    const { data: adherenceSummaryData } = useQuery({
        queryKey: ['adherenceSummary', { medicationId: id, days: 7 }],
        queryFn: () => getAdherenceSummary({ medicationId: id, days: 7 }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: deleteMedication,
        onSuccess: () => {
            queryClient.invalidateQueries(['medications']);
            if (fromHome) {
                navigation.goBack();
                navigation.navigate('Home');
            } else {
                navigation.goBack();
            }
        },
        onError: () => Alert.alert('Error', 'Failed to delete medication'),
    });

    const logDoseMutation = useMutation({
        mutationFn: (data) => createAdherenceLog(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['adherence']);
            queryClient.invalidateQueries(['adherenceSummary']);
            Alert.alert('Success', 'Dose logged successfully');
        },
        onError: () => Alert.alert('Error', 'Failed to log dose'),
    });

    const handleDelete = () => {
        const hasSchedules = schedulesData?.data?.length > 0;
        const hasPrescriptions = prescriptionsData?.data?.length > 0;

        let message = 'Are you sure you want to delete this medication?';
        if (hasSchedules || hasPrescriptions) {
            message = 'Warning: This medication has associated schedules or prescriptions. Deleting it may remove them as well.';
        }

        Alert.alert('Delete Medication', message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    const handleManualDose = () => {
        Alert.alert('Log Manual Dose', 'Did you take this medication just now?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes, Log it',
                onPress: () => logDoseMutation.mutate({
                    medicationId: id,
                    eventType: 'TAKEN',
                    timestamp: new Date().toISOString(),
                    source: 'MANUAL'
                })
            },
        ]);
    };
    const fetchedMedication = medData?.data;
    const medication = {
        ...fetchedMedication,
        name: fetchedMedication?.name || initialName,
        formulation: fetchedMedication?.formulation || initialFormulation,
        stock: fetchedMedication?.stock || initialStock,
        notes: fetchedMedication?.notes || ''
    };
    const schedules = Array.isArray(schedulesData?.data) ? schedulesData.data : [];
    const prescriptions = Array.isArray(prescriptionsData?.data) ? prescriptionsData.data : [];
    const adherenceLogs = Array.isArray(adherenceData?.data) ? adherenceData.data : [];
    const adherenceKPI = adherenceSummaryData?.data || { taken: 0, total: 0, percentage: 0 };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (fromHome) {
                            navigation.goBack();
                            navigation.navigate('Home');
                        } else {
                            navigation.navigate('MedicationList');
                        }
                    }} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => navigation.navigate('MedicationForm', { id })} style={styles.iconBtn}>
                            <Ionicons name="create-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Header Info */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.name}>{medication?.name}</Text>
                        <Text style={styles.detail}>{medication?.formulation}</Text>
                        {medication?.stock && (
                            <View style={styles.stockBadge}>
                                <Text style={styles.stockText}>{medication.stock} left</Text>
                            </View>
                        )}
                    </View>

                    {/* Primary Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.primaryAction]}
                            onPress={() => navigation.navigate('Schedules', { screen: 'ScheduleForm', params: { medicationId: id } })}
                        >
                            <Ionicons name="alarm-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Add Schedule</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryAction]}
                            onPress={handleManualDose}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color="#00b894" />
                            <Text style={[styles.actionButtonText, { color: '#00b894' }]}>Log Dose</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Notes */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.text}>{medication?.notes || 'No notes added.'}</Text>
                    </View>

                    {/* Schedules Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Schedules</Text>
                        </View>
                        {schedules.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.empty}>No schedules set</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Schedules', { screen: 'ScheduleForm', params: { medicationId: id } })}>
                                    <Text style={styles.link}>Set one up</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        {schedules.map(s => (
                            <TouchableOpacity
                                key={s.id}
                                style={styles.item}
                                onPress={() => navigation.navigate('Schedules', { screen: 'ScheduleForm', params: { id: s.id, medicationId: id } })}
                            >
                                <View style={styles.iconBox}>
                                    <Ionicons name="time" size={20} color="#0984e3" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>{formatTime(s.timeOfDay)} • {s.frequency}</Text>
                                    <Text style={styles.itemSub}>{s.dosage} {s.active ? '' : '(Inactive)'}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Prescriptions Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Prescriptions</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Prescriptions', { screen: 'PrescriptionUpload', params: { medicationId: id } })}>
                                <Text style={styles.link}>+ Upload</Text>
                            </TouchableOpacity>
                        </View>
                        {prescriptions.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.empty}>No prescriptions uploaded</Text>
                            </View>
                        ) : null}
                        {prescriptions.map(p => (
                            <TouchableOpacity key={p.id} style={styles.item}>
                                <View style={[styles.iconBox, { backgroundColor: '#e3f9e5' }]}>
                                    <Ionicons name="document-text" size={20} color="#00b894" />
                                </View>
                                <Text style={[styles.itemTitle, { marginLeft: 10, flex: 1 }]} numberOfLines={1}>{p.filename}</Text>
                                <Ionicons name="download-outline" size={20} color="#666" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Adherence History Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent History</Text>
                            <View style={styles.kpiBadge}>
                                <Text style={styles.kpiText}>{adherenceKPI.taken}/{adherenceKPI.total} this week</Text>
                            </View>
                        </View>
                        {adherenceLogs.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.empty}>No history yet</Text>
                            </View>
                        ) : null}
                        {adherenceLogs.map(log => (
                            <View key={log.id} style={styles.logItem}>
                                <View style={[styles.dot, { backgroundColor: log.eventType === 'TAKEN' ? '#00b894' : '#ff7675' }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.logTitle}>{log.eventType === 'TAKEN' ? 'Taken' : 'Missed'}</Text>
                                    <Text style={styles.logSub}>{formatDate(log.takenAt)} at {formatTime(log.takenAt)}</Text>
                                </View>
                                <Text style={styles.logSource}>{!log.scheduleId ? 'Manual' : 'Scheduled'}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footerSpacer} />
                </ScrollView>
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
    titleContainer: {
        marginTop: 10,
        marginBottom: 25,
        alignItems: 'center',
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    detail: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
        textAlign: 'center',
    },
    stockBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stockText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryAction: {
        backgroundColor: '#fff',
        marginRight: 10,
    },
    secondaryAction: {
        backgroundColor: '#fff',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#00b894',
    },
    actionButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#00b894',
        marginLeft: 8,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    text: {
        fontSize: 16,
        color: '#636e72',
        lineHeight: 24,
    },
    link: {
        color: '#00b894',
        fontWeight: '600',
        fontSize: 16,
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#e8f0fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
    },
    itemSub: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 2,
    },
    emptyCard: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderStyle: 'dashed',
    },
    empty: {
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 5,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kpiBadge: {
        backgroundColor: '#e3f9e5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    kpiText: {
        color: '#00b894',
        fontWeight: '600',
        fontSize: 12,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f0f0f0',
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
    logSource: {
        fontSize: 12,
        color: '#b2bec3',
        fontStyle: 'italic',
    },
    footerSpacer: {
        height: 40,
    },
});

export default MedicationDetailScreen;
