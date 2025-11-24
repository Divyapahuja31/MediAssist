import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking, Share, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, createEmergencyToken, getEmergencyToken, revokeEmergencyToken } from '../../../api/profile';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { getAvatarUrl } from '../../../api/api';
import { Image } from 'react-native';

const EmergencyCardScreen = ({ navigation, route }) => {
    const fromHome = route.params?.fromHome;
    const queryClient = useQueryClient();
    const [showQrModal, setShowQrModal] = useState(false);

    // Fetch Profile Data
    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: () => getProfile('me'),
    });

    // Fetch Emergency Token
    const { data: tokenData, isLoading: tokenLoading } = useQuery({
        queryKey: ['emergencyToken'],
        queryFn: () => getEmergencyToken(),
    });

    const createTokenMutation = useMutation({
        mutationFn: createEmergencyToken,
        onSuccess: () => {
            queryClient.invalidateQueries(['emergencyToken']);
            Alert.alert('Success', 'Public emergency link created');
        },
        onError: (error) => {
            console.error('Create Token Error:', error);
            Alert.alert('Error', 'Failed to create emergency link: ' + (error.response?.data?.message || error.message));
        },
    });

    const revokeTokenMutation = useMutation({
        mutationFn: (token) => revokeEmergencyToken(token),
        onSuccess: () => {
            queryClient.invalidateQueries(['emergencyToken']);
            Alert.alert('Success', 'Emergency link revoked');
        },
        onError: () => Alert.alert('Error', 'Failed to revoke link'),
    });

    const handleCreateToken = () => {
        Alert.alert(
            'Create Public Link',
            'This will generate a public link and QR code for your emergency info (allergies, blood group, contacts). Anyone with the link can view this info.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create', onPress: () => createTokenMutation.mutate() },
            ]
        );
    };

    const handleRevokeToken = () => {
        const token = tokenInfo?.token;
        if (!token) return;

        Alert.alert(
            'Revoke Link',
            'Are you sure? The existing QR code will stop working immediately.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Revoke', style: 'destructive', onPress: () => revokeTokenMutation.mutate(token) },
            ]
        );
    };

    const handleCall = (phone) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            Alert.alert('Error', 'No phone number available');
        }
    };

    const handleShare = async () => {
        const url = tokenInfo?.url;
        if (url) {
            try {
                await Share.share({
                    message: `My Emergency Medical Info: ${url}`,
                    url: url,
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to share');
            }
        }
    };

    if (profileLoading) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    const profile = profileData?.data?.data || {};
    const tokenInfo = tokenData?.data?.data;
    const hasToken = !!tokenInfo?.token;
    const emergencyContacts = profile.emergencyContacts || [];
    const allergies = profile.allergies || [];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (fromHome) {
                            navigation.goBack();
                            navigation.navigate('Home');
                        } else {
                            navigation.goBack();
                        }
                    }} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Emergency Card</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { screen: 'ProfileEdit' })}>
                        <Ionicons name="create-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Main Card */}
                    <View style={styles.card}>
                        <View style={styles.profileHeader}>
                            <Image
                                source={{ uri: getAvatarUrl(profile.name) }}
                                style={styles.avatar}
                            />
                            <View style={styles.profileInfo}>
                                <Text style={styles.name}>{profile.name || 'User'}</Text>
                                <Text style={styles.dob}>{profile.dob ? `Born: ${profile.dob}` : 'DOB not set'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.section}>
                            <View style={styles.row}>
                                <Ionicons name="water" size={20} color="#ff7675" />
                                <Text style={styles.sectionLabel}>Blood Group</Text>
                            </View>
                            <Text style={styles.bloodGroup}>{profile.bloodGroup || 'Not set'}</Text>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.row}>
                                <Ionicons name="alert-circle" size={20} color="#fdcb6e" />
                                <Text style={styles.sectionLabel}>Allergies</Text>
                            </View>
                            <View style={styles.chipContainer}>
                                {allergies.length > 0 ? (
                                    allergies.map((allergy, index) => (
                                        <View key={index} style={styles.chip}>
                                            <Text style={styles.chipText}>{allergy}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.placeholderText}>No allergies listed</Text>
                                )}
                            </View>
                        </View>

                        {/* QR Section */}
                        <View style={styles.qrSection}>
                            {tokenLoading ? (
                                <ActivityIndicator color="#00b894" />
                            ) : hasToken ? (
                                <View style={styles.qrContainer}>
                                    <QRCode value={tokenInfo.url} size={150} />
                                    <Text style={styles.qrText}>Scan to view full emergency info</Text>
                                    <View style={styles.qrActions}>
                                        <TouchableOpacity style={styles.qrBtn} onPress={handleShare}>
                                            <Ionicons name="share-social" size={20} color="#00b894" />
                                            <Text style={styles.qrBtnText}>Share Link</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.qrBtn} onPress={handleRevokeToken}>
                                            <Ionicons name="trash-outline" size={20} color="#ff7675" />
                                            <Text style={[styles.qrBtnText, { color: '#ff7675' }]}>Revoke</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.createTokenBtn} onPress={handleCreateToken}>
                                    <Ionicons name="qr-code-outline" size={24} color="#fff" />
                                    <Text style={styles.createTokenText}>Generate Emergency QR</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Emergency Contacts */}
                    <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                    {emergencyContacts.length > 0 ? (
                        emergencyContacts.map((contact, index) => (
                            <View key={index} style={styles.contactCard}>
                                <View style={styles.contactInfo}>
                                    <Text style={styles.contactName}>{contact.name}</Text>
                                    <Text style={styles.contactRelation}>{contact.relation}</Text>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.callBtn}
                                    onPress={() => handleCall(contact.phone)}
                                >
                                    <Ionicons name="call" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContacts}>
                            <Text style={styles.placeholderText}>No emergency contacts added.</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile', { screen: 'ProfileEdit' })}>
                                <Text style={styles.linkText}>Add in Profile</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 25,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    dob: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f2f6',
        marginVertical: 15,
    },
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#636e72',
        marginLeft: 8,
    },
    bloodGroup: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e17055', // Reddish orange for blood
        textAlign: 'center',
        backgroundColor: '#ffeaa7', // Light yellow/orange bg
        paddingVertical: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        backgroundColor: '#ff7675',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    qrSection: {
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f2f6',
    },
    qrContainer: {
        alignItems: 'center',
    },
    qrText: {
        marginTop: 10,
        color: '#636e72',
        fontSize: 12,
    },
    qrActions: {
        flexDirection: 'row',
        marginTop: 15,
    },
    qrBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f2f6',
        marginHorizontal: 5,
    },
    qrBtnText: {
        marginLeft: 5,
        fontWeight: '600',
        color: '#00b894',
        fontSize: 12,
    },
    createTokenBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00b894',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    createTokenText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 15,
        marginLeft: 5,
    },
    contactCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    contactRelation: {
        fontSize: 12,
        color: '#636e72',
        marginTop: 2,
    },
    contactPhone: {
        fontSize: 14,
        color: '#0984e3',
        marginTop: 4,
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#00b894',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContacts: {
        alignItems: 'center',
        padding: 20,
    },
    placeholderText: {
        color: '#b2bec3',
        fontStyle: 'italic',
    },
    linkText: {
        color: '#00b894',
        fontWeight: '600',
        marginTop: 5,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerSpacer: {
        height: 40,
    },
});

export default EmergencyCardScreen;
