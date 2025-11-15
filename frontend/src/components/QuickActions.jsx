import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickActionItem = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);

const QuickActions = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <QuickActionItem
                icon="add"
                label="Add Med"
                color="#4CAF50"
                onPress={() => navigation.navigate('Medications', { screen: 'AddMedication' })}
            />
            <QuickActionItem
                icon="document-text"
                label="Upload Rx"
                color="#2196F3"
                onPress={() => navigation.navigate('Prescriptions', { screen: 'UploadPrescription' })}
            />
            <QuickActionItem
                icon="alert-circle"
                label="Emergency"
                color="#F44336"
                onPress={() => navigation.navigate('Profile', { screen: 'EmergencyCard' })}
            />
            <QuickActionItem
                icon="list"
                label="All Meds"
                color="#FF9800"
                onPress={() => navigation.navigate('Medications')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    item: {
        alignItems: 'center',
        width: 70,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
});

export default QuickActions;
