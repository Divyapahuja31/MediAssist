import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdherenceMiniChart = ({ summary }) => {
    const { taken = 0, total = 0, percentage = 0 } = summary;

    const streak = summary.streak || 0;

    return (
        <View style={styles.container}>
            <View style={[styles.card, styles.streakCard]}>
                <View style={[styles.iconBox, { backgroundColor: '#e3f9e5' }]}>
                    <Ionicons name="flame" size={24} color="#00b894" />
                </View>
                <View>
                    <Text style={styles.label}>Streak</Text>
                    <Text style={styles.value}>{streak} days</Text> 
                </View>
            </View>

            <View style={[styles.card, styles.adherenceCard]}>
                <View style={[styles.iconBox, { backgroundColor: '#e8f0fe' }]}>
                    <Ionicons name="pie-chart" size={24} color="#0984e3" />
                </View>
                <View>
                    <Text style={styles.label}>Adherence</Text>
                    <Text style={styles.value}>{Math.round(percentage)}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 13,
        color: '#636e72',
        marginBottom: 2,
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
    },
});

export default AdherenceMiniChart;
