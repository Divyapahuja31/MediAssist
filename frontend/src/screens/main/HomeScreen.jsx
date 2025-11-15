import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { getUpcomingSchedule } from '../../api/schedules';
import { getMedications } from '../../api/medications';
import { getAdherenceSummary, markDoseTaken } from '../../api/adherence';

import NextDoseCard from '../../components/NextDoseCard';
import QuickActions from '../../components/QuickActions';
import MedicationCardMini from '../../components/MedicationCardMini';
import AdherenceMiniChart from '../../components/AdherenceMiniChart';

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [nextDose, setNextDose] = useState(null);
    const [medications, setMedications] = useState([]);
    const [adherence, setAdherence] = useState(null);

    const fetchData = async () => {
        try {
            const [scheduleRes, medsRes, adherenceRes] = await Promise.all([
                getUpcomingSchedule(1),
                getMedications({ limit: 3 }),
                getAdherenceSummary(7)
            ]);


            setNextDose(Array.isArray(scheduleRes.data) ? scheduleRes.data[0] : scheduleRes.data);
            setMedications(medsRes.data || []);
            setAdherence(adherenceRes.data);
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleMarkTaken = async (scheduleId) => {
        try {
            await markDoseTaken(scheduleId);
            fetchData();
        } catch (error) {
            console.error("Error marking dose taken:", error);
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* 1. Greeting */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {user?.name || 'User'} 👋</Text>
                    <Text style={styles.subGreeting}>Here's your daily summary</Text>
                </View>

                {/* 2. Next Upcoming Dose */}
                <NextDoseCard schedule={nextDose} onMarkTaken={handleMarkTaken} />

                {/* 3. Quick Actions */}
                <QuickActions navigation={navigation} />

                {/* 5. Adherence Summary */}
                <AdherenceMiniChart summary={adherence} />

                {/* 4. Mini Med List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Medications</Text>
                        <Text
                            style={styles.seeAll}
                            onPress={() => navigation.navigate('Medications')}
                        >
                            See All
                        </Text>
                    </View>
                    {Array.isArray(medications) && medications.map(med => (
                        <MedicationCardMini
                            key={med.id}
                            medication={med}
                            onPress={() => navigation.navigate('Medications', {
                                screen: 'MedicationDetail',
                                params: { id: med.id }
                            })}
                        />
                    ))}
                    {medications.length === 0 && (
                        <Text style={styles.emptyText}>No medications added yet.</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subGreeting: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginTop: 25,
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
    seeAll: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    }
});

export default HomeScreen;
