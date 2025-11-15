import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NextDoseCard = ({ schedule, onMarkTaken }) => {
    if (!schedule) {
        return (
            <View style={styles.card}>
                <Text style={styles.emptyText}>No upcoming doses</Text>
            </View>
        );
    }

    const time = new Date(schedule.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Next Dose</Text>
                <Text style={styles.time}>{time}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.medName}>{schedule.medicationName}</Text>
                <Text style={styles.dosage}>{schedule.dosage}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => onMarkTaken(schedule.id)}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Mark Taken</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    time: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    content: {
        marginBottom: 15,
    },
    medName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    dosage: {
        fontSize: 16,
        color: '#666',
    },
    button: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    }
});

export default NextDoseCard;
