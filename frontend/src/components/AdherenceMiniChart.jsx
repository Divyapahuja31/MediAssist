import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdherenceMiniChart = ({ summary }) => {
    const taken = summary?.taken || 0;
    const total = summary?.total || 0;
    const percentage = summary?.percentage || 0;

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.label}>Adherence (Last 7 Days)</Text>
                <Text style={styles.stat}>{taken}/{total} Doses</Text>
            </View>
            <View style={styles.chartContainer}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.percentage}>{percentage}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    stat: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBg: {
        flex: 1,
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    percentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default AdherenceMiniChart;
