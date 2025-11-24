import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createMedication, updateMedication, getMedication } from '../../../api/medications';
import InputField from '../../../components/InputField';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicationFormScreen = ({ navigation, route }) => {
    const id = route.params?.id;
    const fromHome = route.params?.fromHome;
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
            if (fromHome) {
                navigation.goBack();
                navigation.navigate('Home');
            } else {
                navigation.goBack();
            }
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
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
                    <Text style={styles.headerTitle}>{isEdit ? 'Edit Medication' : 'Add Medication'}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            <View style={styles.iconHeader}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={isEdit ? "create" : "add"} size={32} color="#00b894" />
                                </View>
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
                        </View>
                        <View style={styles.footerSpacer} />
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
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
    },
    iconHeader: {
        alignItems: 'center',
        marginBottom: 25,
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
    subtitle: {
        fontSize: 16,
        color: '#636e72',
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    button: {
        marginTop: 20,
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

export default MedicationFormScreen;
