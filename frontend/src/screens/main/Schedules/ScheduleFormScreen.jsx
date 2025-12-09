import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createSchedule, updateSchedule, getSchedule } from '../../../api/schedules';
import { listMedications } from '../../../api/medications';
import InputField from '../../../components/InputField';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleFormScreen = ({ navigation, route }) => {
    const id = route.params?.id;
    const initialMedicationId = route.params?.medicationId;
    const isEdit = !!id;
    const queryClient = useQueryClient();

    const [medicationId, setMedicationId] = useState(initialMedicationId ? initialMedicationId.toString() : '');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [frequency, setFrequency] = useState('DAILY');
    const [dosage, setDosage] = useState('1 pill');
    const [active, setActive] = useState(true);
    const [errors, setErrors] = useState({});

    // Fetch Schedule for Edit
    const { data: scheduleData, isLoading: loadingSchedule } = useQuery({
        queryKey: ['schedule', id],
        queryFn: () => getSchedule(id),
        enabled: isEdit,
    });

    // Fetch Medications for Dropdown 
    const { data: medsData } = useQuery({
        queryKey: ['medications'],
        queryFn: () => listMedications(),
    });

    useEffect(() => {
        if (scheduleData?.data?.data) {
            const s = scheduleData.data.data;
            console.log('Populating Schedule Data:', s);

            if (s.medicationId) {
                setMedicationId(s.medicationId.toString());
            }
            setDosage(s.dosage || '');
            setFrequency(s.frequency || 'DAILY');
            setActive(s.active !== false);

            // Parse time
            if (s.timeOfDay) {
                const [hours, minutes] = s.timeOfDay.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes));
                setTime(date);
            }
        }
    }, [scheduleData]);

    const mutation = useMutation({
        mutationFn: (data) => isEdit ? updateSchedule(id, data) : createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['schedules']);
            if (isEdit) queryClient.invalidateQueries(['schedule', id]);
            navigation.goBack();
        },
        onError: (error) => {
            console.error('Save Schedule Error:', error);
            console.log('Error Response:', error.response?.data);
            const message = error.response?.data?.error || error.response?.data?.message || error.message;
            Alert.alert('Error', 'Failed to save schedule: ' + message);
        },
    });

    const validate = () => {
        let valid = true;
        let newErrors = {};

        if (!medicationId) {
            newErrors.medicationId = 'Please select a medication';
            valid = false;
        }
        if (!dosage?.trim()) {
            newErrors.dosage = 'Dosage is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = () => {
        if (validate()) {
            const timeOfDay = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

            const payload = {
                medicationId: medicationId.toString(),
                timeOfDay,
                frequency,
                dosage,
                active,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            };

            if (frequency === 'WEEKLY') {
                payload.daysOfWeek = [1, 2, 3, 4, 5, 6, 7]; // Default to all days for now
            }

            mutation.mutate(payload);
        }
    };

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentDate);
    };

    const medications = medsData?.data?.data || [];

    if (isEdit && loadingSchedule) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>

                            {/* Medication Selector (Simple List for MVP) */}
                            <Text style={styles.label}>Medication</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medSelector}>
                                {medications.map(med => (
                                    <TouchableOpacity
                                        key={med.id}
                                        style={[
                                            styles.medChip,
                                            medicationId === med.id.toString() && styles.medChipSelected
                                        ]}
                                        onPress={() => setMedicationId(med.id.toString())}
                                    >
                                        <Text style={[
                                            styles.medChipText,
                                            medicationId === med.id.toString() && styles.medChipTextSelected
                                        ]}>
                                            {med.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {errors.medicationId && <Text style={styles.errorText}>{errors.medicationId}</Text>}

                            {/* Time Picker */}
                            <Text style={styles.label}>Time</Text>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Ionicons name="time-outline" size={24} color="#00b894" />
                                <Text style={styles.timeButtonText}>
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    display="default"
                                    onChange={onTimeChange}
                                />
                            )}

                            {/* Frequency Selector */}
                            <Text style={styles.label}>Frequency</Text>
                            <View style={styles.freqContainer}>
                                {['DAILY', 'WEEKLY', 'ONCE'].map(freq => (
                                    <TouchableOpacity
                                        key={freq}
                                        style={[styles.freqChip, frequency === freq && styles.freqChipSelected]}
                                        onPress={() => setFrequency(freq)}
                                    >
                                        <Text style={[styles.freqChipText, frequency === freq && styles.freqChipTextSelected]}>
                                            {freq}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <InputField
                                label="Dosage"
                                value={dosage}
                                onChangeText={setDosage}
                                placeholder="e.g. 1 pill, 5ml"
                                error={errors.dosage}
                            />

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Active</Text>
                                <Switch
                                    value={active}
                                    onValueChange={setActive}
                                    trackColor={{ false: "#dcdde1", true: "#74b9ff" }}
                                    thumbColor={active ? "#0984e3" : "#f5f6fa"}
                                />
                            </View>

                            <ButtonPrimary
                                title={isEdit ? 'Update Schedule' : 'Create Schedule'}
                                onPress={handleSave}
                                loading={mutation.isPending}
                                style={styles.button}
                            />
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#636e72',
        marginBottom: 8,
        marginTop: 10,
    },
    medSelector: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    medChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f2f6',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    medChipSelected: {
        backgroundColor: '#e3f9e5',
        borderColor: '#00b894',
    },
    medChipText: {
        color: '#636e72',
        fontWeight: '500',
    },
    medChipTextSelected: {
        color: '#00b894',
        fontWeight: '600',
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    timeButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3436',
        marginLeft: 10,
    },
    freqContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    freqChip: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f1f2f6',
        marginRight: 5,
        borderRadius: 10,
    },
    freqChipSelected: {
        backgroundColor: '#00b894',
    },
    freqChipText: {
        color: '#636e72',
        fontWeight: '500',
    },
    freqChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
    errorText: {
        color: '#ff7675',
        fontSize: 12,
        marginBottom: 10,
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

export default ScheduleFormScreen;
