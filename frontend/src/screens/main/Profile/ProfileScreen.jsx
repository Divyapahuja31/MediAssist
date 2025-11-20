import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../../api/profile';
import { getAvatarUrl } from '../../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
    const { logout, user } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => getProfile('me'),
    });

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout },
        ]);
    };

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    const profile = data?.data || {};
    // Fallback to auth user data if profile fetch fails or is incomplete
    const displayName = profile.name || user?.name || 'User';
    const displayEmail = profile.email || user?.email || 'email@example.com';

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="person" size={24} color="#2d3436" />
                    </View>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <Text style={styles.headerSubtitle}>Manage your account</Text>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Main Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: getAvatarUrl(displayName) }}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.userEmail}>{displayEmail}</Text>

                        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('ProfileEdit')}>
                            <Text style={styles.editBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Personal Information Section */}
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#e3f9e5' }]}>
                                <Ionicons name="person-outline" size={20} color="#00b894" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                <Text style={styles.infoValue}>{displayName}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#e8f0fe' }]}>
                                <Ionicons name="call-outline" size={20} color="#0984e3" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Phone</Text>
                                <Text style={styles.infoValue}>{profile.phone || 'Not set'}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#ffeaa7' }]}>
                                <Ionicons name="mail-outline" size={20} color="#fdcb6e" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{displayEmail}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Other Actions */}
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.infoCard}>
                        <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('EmergencyCard')}>
                            <View style={[styles.iconBox, { backgroundColor: '#ff7675' }]}>
                                <Ionicons name="medical-outline" size={20} color="#fff" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Emergency Card</Text>
                                <Text style={styles.infoValue}>View & Share</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>
                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.infoItem} onPress={handleLogout}>
                            <View style={[styles.iconBox, { backgroundColor: '#fab1a0' }]}>
                                <Ionicons name="log-out-outline" size={20} color="#d63031" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    headerIcon: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#636e72',
        marginBottom: 20,
    },
    content: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e3f9e5',
        padding: 5,
        marginBottom: 15,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 20,
    },
    editBtn: {
        backgroundColor: '#00b894',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    editBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 15,
        marginLeft: 5,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 70,
    },
    footerSpacer: {
        height: 50,
    },
});

export default ProfileScreen;
