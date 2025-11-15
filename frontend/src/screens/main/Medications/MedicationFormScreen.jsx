import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createMedication, updateMedication, getMedication } from '../../../api/medications';

const MedicationFormScreen = ({ navigation, route }) => {
    const id = route.params?.id;
    const isEdit = !!id;
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [formulation, setFormulation] = useState('');
    const [notes, setNotes] = useState('');
    const [stock, setStock] = useState('');

    const { data: medData, isLoading: loadingMed } = useQuery({
        queryKey: ['medication', id],
        queryFn: () => getMedication(id),
        enabled: isEdit,
    });

    useEffect(() => {
        if (medData?.data) {
            const m = medData.data;
            setName(m.name);
            setFormulation(m.formulation);
            setNotes(m.notes);
            setStock(m.stock ? m.stock.toString() : '');
        }
    }, [medData]);

    const mutation = useMutation({
        mutationFn: (data) => isEdit ? updateMedication(id, data) : createMedication(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['medications']);
            if (isEdit) queryClient.invalidateQueries(['medication', id]);
            navigation.goBack();
        },
        onError: (error) => {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save medication');
        },
    });

    const handleSave = () => {
        if (!name) {
            Alert.alert('Error', 'Medication name is required');
            return;
        }
        mutation.mutate({ name, formulation, notes, stock: stock ? parseInt(stock) : null });
    };

    if (isEdit && loadingMed) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Aspirin" />

            <Text style={styles.label}>Formulation</Text>
            <TextInput style={styles.input} value={formulation} onChangeText={setFormulation} placeholder="e.g. Tablet, 500mg" />

            <Text style={styles.label}>Current Stock (Optional)</Text>
            <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="e.g. 30" />

            <Text style={styles.label}>Notes</Text>
            <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Instructions, side effects..." />

            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isEdit ? 'Update' : 'Create'}</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default MedicationFormScreen;
