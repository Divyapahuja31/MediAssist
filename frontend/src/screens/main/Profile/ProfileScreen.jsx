import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../../api/profile';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => getProfile('me'),
    });

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
        ]);
    };

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    const profile = data?.data || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="#fff" />
                </View>
                <Text style={styles.name}>{profile.name || 'User'}</Text>
                <Text style={styles.email}>{profile.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Info</Text>
                <View style={styles.item}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{profile.phone || 'Not set'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <Text style={styles.value}>{profile.dob || 'Not set'}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Blood Group</Text>
                    <Text style={styles.value}>{profile.bloodGroup || 'Not set'}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ProfileEdit')}>
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <Text style={styles.btnText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('EmergencyCard')}>
                    <Ionicons name="medical-outline" size={20} color="#FF3B30" />
                    <Text style={[styles.btnText, { color: '#FF3B30' }]}>Emergency Card</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
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
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        marginBottom: 20
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    email: {
        fontSize: 16,
        color: '#666'
    },
    section: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10
    },
    label: {
        color: '#666'
    },
    value: {
        fontWeight: '500',
        color: '#333'
    },
    actions: {
        padding: 20
    },
    btn: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 1
    },
    btnText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF'
    },
    logoutBtn: {
        margin: 20,
        padding: 15,
        alignItems: 'center'
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ProfileScreen;
