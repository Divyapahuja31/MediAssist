import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const NextDoseCard = ({ schedule, onMarkTaken, onSnooze }) => {
    if (!schedule) {
        return (
            <View style={styles.emptyCard}>
                <Ionicons name="time-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No upcoming doses</Text>
                <Text style={styles.emptySubText}>You're all caught up!</Text>
            </View>
        );
    }

    const medName = schedule.medication?.name || schedule.medicationName || 'Unknown Medication';
    const dosage = schedule.dosage || 'Standard dose';

    let timeDisplay = 'Now';
    if (schedule.nextRunAt) {
        const date = new Date(schedule.nextRunAt);
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeDisplay = isToday ? `Today • ${timeStr}` : `${date.toLocaleDateString()} • ${timeStr}`;
    } else if (schedule.timeOfDay) {
        timeDisplay = `Daily • ${schedule.timeOfDay.slice(0, 5)}`;
    }

    return (
        <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.card}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={24} color="#fff" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.label}>Next Dose</Text>
                    <Text style={styles.time}>{timeDisplay}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.medName}>{medName}</Text>
                <Text style={styles.dosage}>{dosage}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.snoozeBtn]} onPress={() => onSnooze && onSnooze(schedule.id)}>
                    <Text style={styles.snoozeText}>Snooze</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.takeBtn]} onPress={() => onMarkTaken(schedule.id)}>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.takeText}>Mark Taken</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    emptyCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
        marginVertical: 10,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    headerText: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginBottom: 2,
    },
    time: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    content: {
        marginBottom: 20,
    },
    medName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 4,
    },
    dosage: {
        fontSize: 16,
        color: '#636e72',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    snoozeBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dfe6e9',
    },
    snoozeText: {
        color: '#636e72',
        fontWeight: '600',
        fontSize: 16,
    },
    takeBtn: {
        backgroundColor: '#00b894',
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    takeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default NextDoseCard;
