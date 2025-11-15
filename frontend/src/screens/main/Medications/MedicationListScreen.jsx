import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listMedications } from '../../../api/medications';
import { Ionicons } from '@expo/vector-icons';
import MedicationCardMini from '../../../components/MedicationCardMini';

const MedicationListScreen = ({ navigation }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['medications'],
        queryFn: () => listMedications(),
    });

    const medications = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.center}>Error loading medications</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={medications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MedicationCardMini
                        medication={item}
                        onPress={() => navigation.navigate('MedicationDetail', { id: item.id })}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No medications found. Add one!</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('MedicationForm')}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        padding: 20
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
        fontSize: 16
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});

export default MedicationListScreen;
