import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMedication, deleteMedication } from '../../../api/medications';
import { listSchedules } from '../../../api/schedules';
import { listPrescriptions } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

    if (medLoading) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    const medication = medData?.data;
    const schedules = Array.isArray(schedulesData?.data) ? schedulesData.data : [];
    const prescriptions = Array.isArray(prescriptionsData?.data) ? prescriptionsData.data : [];

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
                        <TouchableOpacity onPress={() => navigation.navigate('MedicationForm', { id })} style={styles.iconBtn}>
                            <Ionicons name="create-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.name}>{medication?.name}</Text>
                        <Text style={styles.detail}>{medication?.formulation}</Text>
                        {medication?.stock && (
                            <View style={styles.stockBadge}>
                                <Text style={styles.stockText}>{medication.stock} left</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.text}>{medication?.notes || 'No notes added.'}</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Schedules</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Schedules', { screen: 'ScheduleForm', params: { medicationId: id } })}>
                                <Text style={styles.link}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                        {schedules.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.empty}>No schedules set</Text>
                            </View>
                        ) : null}
                        {schedules.map(s => (
                            <View key={s.id} style={styles.item}>
                                <View style={styles.iconBox}>
                                    <Ionicons name="time" size={20} color="#0984e3" />
                                </View>
                                <View>
                                    <Text style={styles.itemTitle}>{s.timeOfDay} • {s.frequency}</Text>
                                    <Text style={styles.itemSub}>{s.dosage}</Text>
                                </View>
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
                        {prescriptions.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.empty}>No prescriptions uploaded</Text>
                            </View>
                        ) : null}
                        {prescriptions.map(p => (
                            <View key={p.id} style={styles.item}>
                                <View style={[styles.iconBox, { backgroundColor: '#e3f9e5' }]}>
                                    <Ionicons name="document-text" size={20} color="#00b894" />
                                </View>
                                <Text style={[styles.itemTitle, { marginLeft: 10 }]}>{p.filename}</Text>
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
        height: 200,
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
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    detail: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
    },
    stockBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    stockText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
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
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerSpacer: {
        height: 40,
    },
});

export default MedicationDetailScreen;
