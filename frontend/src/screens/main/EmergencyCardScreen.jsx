import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getEmergencyCard } from '../../api/profile';

const EmergencyCardScreen = () => {
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const data = await getEmergencyCard();
                setCardData(data);
            } catch (error) {
                console.error("Error fetching emergency card:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCard();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#F44336" />
            </View>
        );
    }

    const qrValue = cardData ? JSON.stringify(cardData) : "No emergency data available";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Emergency Medical Card</Text>
                <Text style={styles.subtitle}>Scan this QR code for medical info</Text>

                <View style={styles.qrContainer}>
                    <QRCode
                        value={qrValue}
                        size={200}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{cardData?.name || 'N/A'}</Text>

                    <Text style={styles.infoLabel}>Emergency Contact:</Text>
                    <Text style={styles.infoValue}>{cardData?.emergencyContact || 'N/A'}</Text>

                    <Text style={styles.infoLabel}>Blood Type:</Text>
                    <Text style={styles.infoValue}>{cardData?.bloodType || 'N/A'}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F44336',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    qrContainer: {
        marginBottom: 30,
    },
    infoContainer: {
        width: '100%',
    },
    infoLabel: {
        fontSize: 14,
        color: '#999',
        marginTop: 10,
    },
    infoValue: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    }
});

export default EmergencyCardScreen;
