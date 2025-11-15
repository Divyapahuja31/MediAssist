import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listMedications } from '../../../api/medications';
import { Ionicons } from '@expo/vector-icons';
import MedicationCardMini from '../../../components/MedicationCardMini';
import MedSearchBar from '../../../components/MedSearchBar';
import EmptyStateMedications from '../../../components/EmptyStateMedications';
import { LinearGradient } from 'expo-linear-gradient';

const MedicationListScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['medications', { search }],
        queryFn: () => listMedications({ search }),
    });

    const medications = data?.data?.data || [];

    // Client-side filtering if API doesn't support search yet
    const filteredMedications = medications.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    const onRefresh = () => {
        refetch();
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>Medications</Text>
                    <Text style={styles.subtitle}>Manage your medicines</Text>
                </View>

                <View style={styles.content}>
                    <MedSearchBar
                        value={search}
                        onChangeText={setSearch}
                        onClear={() => setSearch('')}
                    />

                    {isLoading ? (
                        <ActivityIndicator style={styles.center} size="large" color="#00b894" />
                    ) : (
                        <FlatList
                            data={filteredMedications}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <MedicationCardMini
                                    medication={item}
                                    onPress={() => navigation.navigate('MedicationDetail', { id: item.id })}
                                />
                            )}
                            contentContainerStyle={styles.list}
                            ListEmptyComponent={
                                <EmptyStateMedications
                                    onAdd={() => navigation.navigate('MedicationForm')}
                                />
                            }
                            refreshControl={
                                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#00b894" />
                            }
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('MedicationForm')}
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
        paddingBottom: 100,
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

export default MedicationListScreen;
