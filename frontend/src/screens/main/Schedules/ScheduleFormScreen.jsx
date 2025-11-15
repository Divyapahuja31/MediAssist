import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createSchedule, updateSchedule, getSchedule } from '../../../api/schedules';
import { listMedications } from '../../../api/medications';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleFormScreen = ({ navigation, route }) => {
    const id = route.params?.id;
    const prefillMedId = route.params?.medicationId;
    const isEdit = !!id;
    const queryClient = useQueryClient();

    const [medicationId, setMedicationId] = useState(prefillMedId || '');
    const [time, setTime] = useState(new Date());
    const [frequency, setFrequency] = useState('DAILY');
    const [dosage, setDosage] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Fetch Meds for Picker
    const { data: medsData } = useQuery({
        queryKey: ['medications'],
        queryFn: () => listMedications(),
    });
    const medications = Array.isArray(medsData?.data) ? medsData.data : (Array.isArray(medsData) ? medsData : []);

    const { data: scheduleData, isLoading: loadingSchedule } = useQuery({
        queryKey: ['schedule', id],
        queryFn: () => getSchedule(id),
        enabled: isEdit,
    });

    useEffect(() => {
        if (scheduleData?.data) {
            const s = scheduleData.data;
            setMedicationId(s.medicationId);
            setFrequency(s.frequency);
            setDosage(s.dosage);
            const [h, m] = s.timeOfDay.split(':');
            const d = new Date();
            d.setHours(parseInt(h), parseInt(m));
            setTime(d);
        }
    }, [scheduleData]);

    const mutation = useMutation({
        mutationFn: (data) => isEdit ? updateSchedule(id, data) : createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            if (isEdit) queryClient.invalidateQueries(['schedule', id]);
            navigation.goBack();
        },
        onError: (error) => Alert.alert('Error', error.response?.data?.message || 'Failed to save schedule'),
    });

    const handleSave = () => {
        if (!medicationId) {
            Alert.alert('Error', 'Please select a medication');
            return;
        }
        const timeOfDay = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        mutation.mutate({
            medicationId,
            timeOfDay,
            frequency,
            dosage,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            active: true
        });
    };

    const onTimeChange = (event, selectedDate) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) setTime(selectedDate);
    };

    if (isEdit && loadingSchedule) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Medication *</Text>
            <View style={styles.pickerContainer}>
                {Array.isArray(medications) && medications.map(m => (
                    <TouchableOpacity
                        key={m.id}
                        style={[styles.pickerItem, medicationId === m.id && styles.pickerItemSelected]}
                        onPress={() => setMedicationId(m.id)}
                    >
                        <Text style={[styles.pickerText, medicationId === m.id && styles.pickerTextSelected]}>{m.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.row}>
                {['DAILY', 'WEEKLY', 'ONCE'].map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.freqItem, frequency === f && styles.freqItemSelected]}
                        onPress={() => setFrequency(f)}
                    >
                        <Text style={[styles.freqText, frequency === f && styles.freqTextSelected]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Dosage</Text>
            <TextInput style={styles.input} value={dosage} onChangeText={setDosage} placeholder="e.g. 1 pill" />

            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isEdit ? 'Update' : 'Create'}</Text>}
            </TouchableOpacity>
        </SafeAreaView>
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
        marginBottom: 10, 
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
        marginTop: 20 
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    pickerContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginBottom: 10 
    },
    pickerItem: { 
        padding: 8, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 20, 
        marginRight: 8, 
        marginBottom: 8 
    },
    pickerItemSelected: { 
        backgroundColor: '#E3F2FD', 
        borderColor: '#007AFF' 
    },
    pickerText: { 
        color: '#666' 
    },
    pickerTextSelected: { 
        color: '#007AFF', 
        fontWeight: 'bold' 
    },
    row: { 
        flexDirection: 'row', 
        marginBottom: 10 
    },
    freqItem: { 
        flex: 1, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        alignItems: 'center', 
        marginRight: 5, 
        borderRadius: 8 
    },
    freqItemSelected: { 
        backgroundColor: '#007AFF', 
        borderColor: '#007AFF' 
    },
    freqText: { 
        color: '#666' 
    },
    freqTextSelected: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
});

export default ScheduleFormScreen;
