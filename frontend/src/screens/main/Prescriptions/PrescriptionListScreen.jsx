import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Linking } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listPrescriptions, deletePrescription, getPrescriptionDownloadUrl } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrescriptionCard from '../../../components/PrescriptionCard';
import MedSearchBar from '../../../components/MedSearchBar';

const PrescriptionListScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['prescriptions', { search }],
        queryFn: () => listPrescriptions({ search }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deletePrescription(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['prescriptions']);
            Alert.alert('Success', 'Prescription deleted');
        },
        onError: () => Alert.alert('Error', 'Failed to delete prescription'),
    });

    const handleDelete = (id) => {
        Alert.alert('Delete Prescription', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
        ]);
    };

    const handleDownload = async (id) => {
        try {
            const res = await getPrescriptionDownloadUrl(id);
            if (res.data?.url) {
                Linking.openURL(res.data.url);
            } else {
                Alert.alert('Error', 'Could not get download URL');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download prescription');
        }
    };

    const prescriptions = data?.data?.data || [];

    // Client-side filtering if needed
    const filteredPrescriptions = prescriptions.filter(p =>
        p.filename.toLowerCase().includes(search.toLowerCase()) ||
        (p.medication?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <PrescriptionCard
            prescription={item}
            onPress={() => navigation.navigate('PrescriptionDetail', { id: item.id })}
            onDownload={() => handleDownload(item.id)}
            onDelete={() => handleDelete(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>Prescriptions</Text>
                    <Text style={styles.subtitle}>Your medical documents</Text>
                </View>

                <View style={styles.content}>
                    <MedSearchBar
                        value={search}
                        onChangeText={setSearch}
                        onClear={() => setSearch('')}
                        placeholder="Search documents..."
                    />

                    {isLoading ? (
                        <ActivityIndicator style={styles.center} size="large" color="#00b894" />
                    ) : (
                        <FlatList
                            data={filteredPrescriptions}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="document-text-outline" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>No prescriptions uploaded yet.</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#00b894" />
                            }
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('PrescriptionUpload')}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        paddingTop: 10,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#999',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#00b894',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

export default PrescriptionListScreen;
