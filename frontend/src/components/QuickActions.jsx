import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const QuickActionItem = ({ icon, label, onPress, colors }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <LinearGradient
            colors={colors}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Ionicons name={icon} size={28} color="#fff" />
        </LinearGradient>
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);

const QuickActions = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <QuickActionItem
                icon="add"
                label="Add Med"
                colors={['#00cec9', '#00b894']}
                onPress={() => navigation.navigate('Medications', { screen: 'MedicationForm', params: { fromHome: true } })}
            />
            <QuickActionItem
                icon="calendar"
                label="Schedule"
                colors={['#74b9ff', '#0984e3']}
                onPress={() => navigation.navigate('Medications', { screen: 'Schedules', params: { fromHome: true } })}
            />
            <QuickActionItem
                icon="alert-circle"
                label="Emergency"
                colors={['#ff7675', '#d63031']}
                onPress={() => navigation.navigate('Profile', { screen: 'EmergencyCard' })}
            />
            <QuickActionItem
                icon="document-text"
                label="Upload Rx"
                colors={['#a29bfe', '#6c5ce7']}
                onPress={() => navigation.navigate('Prescriptions', { screen: 'PrescriptionUpload' })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25,
        paddingHorizontal: 10,
    },
    item: {
        alignItems: 'center',
        width: 75,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    label: {
        fontSize: 12,
        color: '#2d3436',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default QuickActions;
