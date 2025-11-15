import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listAdherenceLogs } from '../../../api/adherence';
import { Ionicons } from '@expo/vector-icons';

const AdherenceHistoryScreen = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['adherence'],
        queryFn: () => listAdherenceLogs(),
    });

    const logs = data?.data || [];

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.center}>Error loading history</Text>;

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={[styles.iconContainer, { backgroundColor: item.eventType === 'TAKEN' ? '#E8F5E9' : '#FFEBEE' }]}>
                <Ionicons
                    name={item.eventType === 'TAKEN' ? 'checkmark-circle' : 'alert-circle'}
                    size={24}
                    color={item.eventType === 'TAKEN' ? '#4CAF50' : '#F44336'}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.medName}>{item.medicationName || 'Unknown Med'}</Text>
                <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <Text style={[styles.status, { color: item.eventType === 'TAKEN' ? '#4CAF50' : '#F44336' }]}>
                {item.eventType}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={logs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No logs found</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 20 },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: { 
        flex: 1 
    },
    medName: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333' 
    },
    date: {
         fontSize: 12, 
         color: '#999' 
        },
    status: { 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, color: '#666', 
        fontSize: 16 
    },
});

export default AdherenceHistoryScreen;
