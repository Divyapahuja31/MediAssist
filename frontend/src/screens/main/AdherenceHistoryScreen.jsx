import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { getAdherenceHistory } from '../../api/adherence';

const AdherenceHistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const to = new Date().toISOString();
                const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
                const data = await getAdherenceHistory(from, to);
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={[styles.statusIndicator, { backgroundColor: item.taken ? '#4CAF50' : '#F44336' }]} />
            <View style={styles.info}>
                <Text style={styles.medName}>{item.medicationName}</Text>
                <Text style={styles.time}>
                    {new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <Text style={[styles.statusText, { color: item.taken ? '#4CAF50' : '#F44336' }]}>
                {item.taken ? 'TAKEN' : 'MISSED'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <Text style={styles.headerTitle}>Adherence History (Last 30 Days)</Text>
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No history available.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 14,
        color: '#666',
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    }
});

export default AdherenceHistoryScreen;
