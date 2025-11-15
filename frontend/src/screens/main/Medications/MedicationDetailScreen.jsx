import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedication, deleteMedication } from '../../../api/medications';
import { listSchedules } from '../../../api/schedules';
import { listPrescriptions } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';

const MedicationDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const queryClient = useQueryClient();

    const { data: medData, isLoading: medLoading } = useQuery({
        queryKey: ['medication', id],
        queryFn: () => getMedication(id),
    });

    const { data: schedulesData } = useQuery({
        queryKey: ['schedules', { medicationId: id }],
        queryFn: () => listSchedules({ medicationId: id }),
    });

    const { data: prescriptionsData } = useQuery({
        queryKey: ['prescriptions', { medicationId: id }],
        queryFn: () => listPrescriptions({ medicationId: id }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMedication,
        onSuccess: () => {
            queryClient.invalidateQueries(['medications']);
            navigation.goBack();
        },
        onError: () => Alert.alert('Error', 'Failed to delete medication'),
    });

    const handleDelete = () => {
        Alert.alert('Delete Medication', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    if (medLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    const medication = medData?.data;
    const schedules = schedulesData?.data || [];
    const prescriptions = prescriptionsData?.data || [];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{medication?.name}</Text>
                    <Text style={styles.detail}>{medication?.formulation}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate('MedicationForm', { id })} style={styles.iconBtn}>
                        <Ionicons name="create-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.text}>{medication?.notes || 'No notes'}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Schedules</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Schedules', { screen: 'ScheduleForm', params: { medicationId: id } })}>
                        <Text style={styles.link}>+ Add</Text>
                    </TouchableOpacity>
                </View>
                {schedules.length === 0 ? <Text style={styles.empty}>No schedules</Text> : null}
                {schedules.map(s => (
                    <View key={s.id} style={styles.item}>
                        <Text style={styles.itemTitle}>{s.timeOfDay} - {s.frequency}</Text>
                        <Text style={styles.itemSub}>{s.dosage}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Prescriptions</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Prescriptions', { screen: 'PrescriptionUpload', params: { medicationId: id } })}>
                        <Text style={styles.link}>+ Upload</Text>
                    </TouchableOpacity>
                </View>
                {prescriptions.length === 0 ? <Text style={styles.empty}>No prescriptions</Text> : null}
                {prescriptions.map(p => (
                    <View key={p.id} style={styles.item}>
                        <Ionicons name="document-text-outline" size={20} color="#666" />
                        <Text style={[styles.itemTitle, { marginLeft: 10 }]}>{p.filename}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 20
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333'
    },
    detail: {
        fontSize: 16,
        color: '#666'
    },
    actions: {
        flexDirection: 'row'
    },
    iconBtn: {
        marginLeft: 15
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20
    },
    section: {
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    text: {
        fontSize: 16,
        color: '#444'
    },
    link: {
        color: '#007AFF',
        fontWeight: '600'
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    itemSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    empty: {
        color: '#999',
        fontStyle: 'italic'
    },
});

export default MedicationDetailScreen;
