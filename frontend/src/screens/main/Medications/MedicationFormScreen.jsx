import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createMedication, updateMedication, getMedication } from '../../../api/medications';
import InputField from '../../../components/InputField';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { Ionicons } from '@expo/vector-icons';

const MedicationFormScreen = ({ navigation, route }) => {
    const id = route.params?.id;
    const isEdit = !!id;
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [formulation, setFormulation] = useState('');
    const [notes, setNotes] = useState('');
    const [stock, setStock] = useState('');
    const [errors, setErrors] = useState({});

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

    const validate = () => {
        let valid = true;
        let newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Medication name is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = () => {
        if (validate()) {
            mutation.mutate({
                name,
                formulation,
                notes,
                stock: stock ? parseInt(stock) : null
            });
        }
    };

    if (isEdit && loadingMed) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={isEdit ? "create" : "add"} size={32} color="#00b894" />
                    </View>
                    <Text style={styles.title}>{isEdit ? 'Edit Medication' : 'Add Medication'}</Text>
                    <Text style={styles.subtitle}>
                        {isEdit ? 'Update details below' : 'Enter details to track your meds'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <InputField
                        label="Medication Name *"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Aspirin, Lisinopril"
                        error={errors.name}
                    />

                    <InputField
                        label="Formulation / Dosage"
                        value={formulation}
                        onChangeText={setFormulation}
                        placeholder="e.g. Tablet 500mg, Syrup 10ml"
                    />

                    <InputField
                        label="Current Stock (Optional)"
                        value={stock}
                        onChangeText={setStock}
                        placeholder="e.g. 30"
                        keyboardType="numeric"
                    />

                    <InputField
                        label="Notes (Optional)"
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="e.g. Take after food, may cause drowsiness..."
                        multiline
                        numberOfLines={4}
                    />

                    <ButtonPrimary
                        title={isEdit ? 'Update Medication' : 'Add Medication'}
                        onPress={handleSave}
                        loading={mutation.isPending}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e3f9e5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
    },
    form: {
        flex: 1,
    },
    button: {
        marginTop: 20,
    },
});

export default MedicationFormScreen;
