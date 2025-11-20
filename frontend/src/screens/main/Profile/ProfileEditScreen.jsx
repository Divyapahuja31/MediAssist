import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getProfile, upsertProfile } from '../../../api/profile';

const ProfileEditScreen = ({ navigation }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({ queryKey: ['profile', 'me'], queryFn: () => getProfile('me') });

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [allergies, setAllergies] = useState('');
    const [emergencyContacts, setEmergencyContacts] = useState('');

    useEffect(() => {
        if (data?.data) {
            const p = data.data;
            setName(p.name || '');
            setPhone(p.phone || '');
            setDob(p.dob || '');
            setBloodGroup(p.bloodGroup || '');
            setAllergies(p.allergies ? p.allergies.join(', ') : '');
            setEmergencyContacts(p.emergencyContacts ? JSON.stringify(p.emergencyContacts, null, 2) : '');
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: upsertProfile,
        onSuccess: () => {
            queryClient.invalidateQueries(['profile', 'me']);
            Alert.alert('Success', 'Profile updated');
            navigation.goBack();
        },
        onError: () => Alert.alert('Error', 'Failed to update profile'),
    });

    const handleSave = () => {
        const allergiesArray = allergies.split(',').map(s => s.trim()).filter(Boolean);
        let contactsArray = [];
        try {
            if (emergencyContacts) {
                contactsArray = JSON.parse(emergencyContacts);
            }
        } catch (e) {
            Alert.alert('Error', 'Invalid JSON for Emergency Contacts');
            return;
        }
        mutation.mutate({ name, phone, dob, bloodGroup, allergies: allergiesArray, emergencyContacts: contactsArray });
    };

    return (
        <ScrollView style={styles.container}>
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

            <Text style={styles.label}>Emergency Contacts (JSON)</Text>
            <Text style={styles.helperText}>Format: {'[{"name":"Mom","phone":"123","relation":"Parent"}]'}</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                value={emergencyContacts}
                onChangeText={setEmergencyContacts}
                placeholder='[{"name":"Mom","phone":"123","relation":"Parent"}]'
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        fontStyle: 'italic'
    }
});

export default ProfileEditScreen;
