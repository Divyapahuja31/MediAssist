import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { createMedication } from '../../api/medications';

const AddMedicationScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !dosage) {
            Alert.alert('Error', 'Please fill in at least Name and Dosage');
            return;
        }

        setLoading(true);
        try {
            await createMedication({ name, dosage, frequency });
            Alert.alert('Success', 'Medication added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to add medication');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Medication Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Amoxicillin"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Dosage</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 500mg"
                    value={dosage}
                    onChangeText={setDosage}
                />

                <Text style={styles.label}>Frequency (Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Twice daily"
                    value={frequency}
                    onChangeText={setFrequency}
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Medication</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AddMedicationScreen;
