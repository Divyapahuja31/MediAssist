import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getProfile, upsertProfile } from '../../../api/profile';

import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ProfileEditScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({ queryKey: ['profile', 'me'], queryFn: () => getProfile('me') });

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [allergies, setAllergies] = useState('');
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [newContactRelation, setNewContactRelation] = useState('');

    useEffect(() => {
        if (data?.data?.data) {
            const p = data.data.data;
            setName(p.name || '');
            setPhone(p.phone || '');
            setDob(p.dob || '');
            setBloodGroup(p.bloodGroup || '');
            setAllergies(p.allergies ? p.allergies.join(', ') : '');
            setEmergencyContacts(p.emergencyContacts || []);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: upsertProfile,
        onSuccess: () => {
            queryClient.invalidateQueries(['profile', 'me']);
            Alert.alert('Success', 'Profile updated');
            navigation.navigate('ProfileMain');
        },
        onError: (error) => {
            console.error('Update Profile Error:', error);
            Alert.alert('Error', 'Failed to update profile: ' + (error.response?.data?.message || error.message));
        },
    });

    const addContact = () => {
        if (!newContactName || !newContactPhone) {
            Alert.alert('Error', 'Name and Phone are required');
            return;
        }
        setEmergencyContacts([...emergencyContacts, { name: newContactName, phone: newContactPhone, relation: newContactRelation }]);
        setNewContactName('');
        setNewContactPhone('');
        setNewContactRelation('');
    };

    const removeContact = (index) => {
        const updated = [...emergencyContacts];
        updated.splice(index, 1);
        setEmergencyContacts(updated);
    };

    const handleSave = () => {
        const allergiesArray = allergies.split(',').map(s => s.trim()).filter(Boolean);
        const payload = {
            name,
            phone: phone || undefined,
            dob: dob || undefined,
            bloodGroup: bloodGroup || undefined,
            allergies: allergiesArray,
            emergencyContacts
        };
        mutation.mutate(payload);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileMain')} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} />

                            <Text style={styles.label}>Phone</Text>
                            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                            <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
                            <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />

                            <Text style={styles.label}>Blood Group</Text>
                            <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} placeholder="e.g. O+" />

                            <Text style={styles.label}>Allergies (comma separated)</Text>
                            <TextInput style={styles.input} value={allergies} onChangeText={setAllergies} placeholder="Peanuts, Penicillin" />

                            <Text style={styles.label}>Emergency Contacts</Text>
                            {emergencyContacts.length > 0 ? (
                                emergencyContacts.map((contact, index) => (
                                    <View key={index} style={styles.contactItem}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.contactName}>{contact.name} ({contact.relation})</Text>
                                            <Text style={styles.contactPhone}>{contact.phone}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => removeContact(index)} style={styles.removeBtn}>
                                            <Ionicons name="trash-outline" size={20} color="#ff7675" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.helperText}>No emergency contacts added yet.</Text>
                            )}

                            <View style={styles.addContactBox}>
                                <Text style={styles.subLabel}>Add New Contact</Text>
                                <TextInput
                                    style={styles.smallInput}
                                    placeholder="Name"
                                    value={newContactName}
                                    onChangeText={setNewContactName}
                                />
                                <TextInput
                                    style={styles.smallInput}
                                    placeholder="Phone"
                                    value={newContactPhone}
                                    onChangeText={setNewContactPhone}
                                    keyboardType="phone-pad"
                                />
                                <TextInput
                                    style={styles.smallInput}
                                    placeholder="Relation (e.g. Spouse, Parent)"
                                    value={newContactRelation}
                                    onChangeText={setNewContactRelation}
                                />
                                <TouchableOpacity style={styles.addBtn} onPress={addContact}>
                                    <Text style={styles.addBtnText}>Add Contact</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={mutation.isPending}>
                                {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
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
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#636e72',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#dfe6e9',
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
        backgroundColor: '#f1f2f6',
        color: '#2d3436',
    },
    button: {
        backgroundColor: '#00b894',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    helperText: {
        fontSize: 12,
        color: '#b2bec3',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    contactName: {
        fontWeight: 'bold',
        color: '#2d3436',
    },
    contactPhone: {
        color: '#636e72',
        fontSize: 12,
    },
    removeBtn: {
        padding: 5,
    },
    addContactBox: {
        marginTop: 10,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dfe6e9',
    },
    subLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 10,
    },
    smallInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        fontSize: 14,
    },
    addBtn: {
        backgroundColor: '#0984e3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
});

export default ProfileEditScreen;
