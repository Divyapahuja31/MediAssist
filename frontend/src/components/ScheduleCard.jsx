import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../utils/formatters';

const ScheduleCard = ({ schedule, onToggle, onPress, onDelete }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.info}>
                <Text style={styles.medName}>{schedule.medication?.name || 'Unknown Med'}</Text>
                <View style={styles.row}>
                    <Text style={styles.details}>{formatTime(schedule.timeOfDay)} • {schedule.frequency}</Text>
                </View>
                <Text style={styles.dosage}>{schedule.dosage} {schedule.medication?.formulation ? `(${schedule.medication.formulation})` : ''}</Text>
            </View>

            <View style={styles.actions}>
                <Switch
                    value={schedule.active}
                    onValueChange={onToggle}
                    trackColor={{ false: "#dcdde1", true: "#74b9ff" }}
                    thumbColor={schedule.active ? "#0984e3" : "#f5f6fa"}
                    style={styles.switch}
                />
                {onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={20} color="#ff7675" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    info: {
        flex: 1,
        marginRight: 10,
    },
    medName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    details: {
        fontSize: 14,
        color: '#636e72',
        fontWeight: '500',
    },
    dosage: {
        fontSize: 13,
        color: '#00b894',
        marginTop: 2,
    },
    actions: {
        alignItems: 'flex-end',
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginBottom: 5,
    },
    deleteBtn: {
        padding: 5,
    },
});

export default ScheduleCard;
