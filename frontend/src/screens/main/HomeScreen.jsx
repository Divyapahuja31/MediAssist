import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { listSchedules, markScheduleTaken } from '../../api/schedules';
import { listMedications } from '../../api/medications';
import { getAdherenceSummary } from '../../api/adherence';
import NextDoseCard from '../../components/NextDoseCard';
import QuickActions from '../../components/QuickActions';
import MedicationCardMini from '../../components/MedicationCardMini';
import AdherenceMiniChart from '../../components/AdherenceMiniChart';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch Next Dose
    const { data: nextDoseData, isLoading: loadingNextDose } = useQuery({
        queryKey: ['schedules', 'upcoming'],
        queryFn: () => listSchedules({ upcoming: true, limit: 1 }),
        staleTime: 30000,
    });

    // Fetch Medications
    const { data: medsData, isLoading: loadingMeds } = useQuery({
        queryKey: ['medications', { limit: 4 }],
        queryFn: () => listMedications({ limit: 4 }),
    });

    // Fetch Adherence Summary
    const { data: adherenceData, isLoading: loadingAdherence } = useQuery({
        queryKey: ['adherenceSummary', { days: 7 }],
        queryFn: () => getAdherenceSummary({ days: 7 }),
    });

    // Mark Taken Mutation
    const markTakenMutation = useMutation({
        mutationFn: ({ id }) => markScheduleTaken(id, { eventType: 'TAKEN', timestamp: new Date().toISOString() }),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            queryClient.invalidateQueries(['adherenceSummary']);
            Alert.alert('Success', 'Medication marked as taken!');
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to mark as taken');
            console.error(error);
        },
    });

    const handleMarkTaken = (id) => {
        markTakenMutation.mutate({ id });
    };

    const handleSnooze = (id) => {
        Alert.alert('Snooze', 'Snooze functionality coming soon!');
    };

    const onRefresh = () => {
        queryClient.invalidateQueries(['schedules']);
        queryClient.invalidateQueries(['medications']);
        queryClient.invalidateQueries(['adherenceSummary']);
    };

    const nextDose = nextDoseData?.data?.[0];
    const medications = medsData?.data?.data || [];
    const adherenceSummary = adherenceData?.data || { taken: 0, total: 0, percentage: 0 };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'} 👋</Text>
                        <Text style={styles.date}>{today}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-outline" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loadingNextDose || loadingMeds || loadingAdherence}
                            onRefresh={onRefresh}
                            tintColor="#fff"
                        />
                    }
                >
                    {/* Section B: Next Dose */}
                    <NextDoseCard
                        schedule={nextDose}
                        onMarkTaken={handleMarkTaken}
                        onSnooze={handleSnooze}
                    />

                    {/* Section C: Quick Actions */}
                    <QuickActions navigation={navigation} />

                    {/* Section E: Adherence Summary */}
                    <AdherenceMiniChart summary={adherenceSummary} />

                    {/* Section D: Mini Medication List */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Medications</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        {medications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="medkit-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyStateText}>No medications added yet</Text>
                                <TouchableOpacity
                                    style={styles.addMedBtn}
                                    onPress={() => navigation.navigate('Medications', { screen: 'MedicationForm' })}
                                >
                                    <Text style={styles.addMedBtnText}>Add Your First Medication</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            medications.map((med) => (
                                <MedicationCardMini
                                    key={med.id}
                                    medication={med}
                                    onPress={() => navigation.navigate('Medications', { screen: 'MedicationDetail', params: { id: med.id } })}
                                />
                            ))
                        )}
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
        height: 250,
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
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    date: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    profileBtn: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: {
        marginTop: 10,
        marginBottom: 20,
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
        color: '#2d3436',
    },
    seeAll: {
        fontSize: 14,
        color: '#0984e3',
        fontWeight: '600',
    },
    emptyState: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#636e72',
        marginTop: 10,
        marginBottom: 20,
    },
    addMedBtn: {
        backgroundColor: '#00b894',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    addMedBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    footerSpacer: {
        height: 50,
    },
});

export default HomeScreen;
