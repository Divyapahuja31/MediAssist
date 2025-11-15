import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getEmergencyContacts } from '../../../api/profile';
import QRCode from 'react-native-qrcode-svg';

const EmergencyCardScreen = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['emergency', 'me'],
        queryFn: () => getEmergencyContacts('me'),
    });

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#FF3B30" />;
    if (error) return <Text style={styles.center}>Error loading emergency info</Text>;

    const info = data?.data || {};
    const contacts = info.emergencyContacts || [];

    const qrPayload = `https://mediassist.app/emergency/${info.userId || 'unknown'}`;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Emergency Card</Text>
                <Text style={styles.subtitle}>Show this to first responders</Text>
            </View>

            <View style={styles.qrContainer}>
                <QRCode value={qrPayload} size={200} />
                <Text style={styles.qrText}>Scan for full medical profile</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{info.name || 'N/A'}</Text>

                <Text style={styles.label}>Blood Group</Text>
                <Text style={styles.value}>{info.bloodGroup || 'N/A'}</Text>

                <Text style={styles.label}>Allergies</Text>
                <Text style={styles.value}>{info.allergies ? info.allergies.join(', ') : 'None'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {contacts.map((contact, index) => (
                <View key={index} style={styles.contactCard}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relation}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
            ))}
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
        alignItems: 'center', 
        marginBottom: 20 
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#FF3B30' 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#666' 
    },
    qrContainer: { 
        alignItems: 'center', 
        marginBottom: 30, 
        padding: 20, 
        backgroundColor: '#fff', 
        borderRadius: 16 
    },
    qrText: { 
        marginTop: 10, 
        color: '#999', 
        fontSize: 12 
    },
    card: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 16, 
        marginBottom: 20 
    },
    label: { 
        fontSize: 14, 
        color: '#999', 
        marginBottom: 2 
    },
    value: { 
        fontSize: 18, 
        color: '#333', 
        fontWeight: '600', 
        marginBottom: 15 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 10 
    },
    contactCard: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 12, 
        marginBottom: 10 
    },
    contactName: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    contactRelation: { 
        fontSize: 14, 
        color: '#666' 
    },
    contactPhone: { 
        fontSize: 16, 
        color: '#007AFF', 
        marginTop: 5, 
        fontWeight: '600' 
    },
});

export default EmergencyCardScreen;
