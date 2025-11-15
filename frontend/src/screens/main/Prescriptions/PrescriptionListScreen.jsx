import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listPrescriptions, deletePrescription } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';

const PrescriptionListScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => listPrescriptions(),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePrescription,
        onSuccess: () => queryClient.invalidateQueries(['prescriptions']),
        onError: () => Alert.alert('Error', 'Failed to delete prescription'),
    });

    const handleDelete = (id) => {
        Alert.alert('Delete Prescription', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    const prescriptions = data?.data || [];

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.center}>Error loading prescriptions</Text>;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PrescriptionDetail', { id: item.id })}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={24} color="#007AFF" />
            </View>
            <View style={styles.info}>
                <Text style={styles.filename} numberOfLines={1}>{item.filename}</Text>
                <Text style={styles.date}>{new Date(item.uploadedAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={prescriptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>No prescriptions found</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('PrescriptionUpload')}
            >
                <Ionicons name="cloud-upload" size={30} color="#fff" />
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
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: {
        flex: 1
    },
    filename: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    date: {
        fontSize: 14,
        color: '#999'
    },
    deleteBtn: {
        padding: 10
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
    },
});

export default PrescriptionListScreen;
