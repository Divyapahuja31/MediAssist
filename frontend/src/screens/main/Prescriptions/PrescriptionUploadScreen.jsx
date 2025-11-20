import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { uploadPrescription } from '../../../api/prescriptions';
import { listMedications } from '../../../api/medications';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import InputField from '../../../components/InputField';
import ButtonPrimary from '../../../components/ButtonPrimary';
import UploadPreview from '../../../components/UploadPreview';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrescriptionUploadScreen = ({ navigation, route }) => {
    const initialMedicationId = route.params?.medicationId;
    const queryClient = useQueryClient();

    const [file, setFile] = useState(null);
    const [medicationId, setMedicationId] = useState(initialMedicationId ? initialMedicationId.toString() : '');
    const [notes, setNotes] = useState('');
    const [uploading, setUploading] = useState(false);

    // Fetch Medications
    const { data: medsData } = useQuery({
        queryKey: ['medications'],
        queryFn: () => listMedications(),
    });

    const medications = medsData?.data?.data || [];

    const pickImage = async (useCamera = false) => {
        try {
            let result;
            if (useCamera) {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (permission.status !== 'granted') {
                    Alert.alert('Permission denied', 'Camera permission is required');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                });
            }

            if (!result.canceled) {
                const asset = result.assets[0];
                setFile({
                    uri: asset.uri,
                    name: asset.fileName || `upload_${Date.now()}.jpg`,
                    type: 'image/jpeg', // Default fallback
                    mimeType: asset.mimeType || 'image/jpeg',
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                setFile({
                    uri: asset.uri,
                    name: asset.name,
                    type: asset.mimeType,
                    mimeType: asset.mimeType,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            Alert.alert('Error', 'Please select a file first');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            });

            if (medicationId) {
                formData.append('medicationId', medicationId);
            }

            if (notes) {
                formData.append('meta', JSON.stringify({ notes }));
            }

            await uploadPrescription(formData);

            queryClient.invalidateQueries(['prescriptions']);
            Alert.alert('Success', 'Prescription uploaded successfully');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to upload prescription');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Upload Prescription</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        {/* File Picker Section */}
                        <Text style={styles.label}>Choose Document</Text>

                        {!file ? (
                            <View style={styles.pickerRow}>
                                <TouchableOpacity style={styles.pickerBtn} onPress={() => pickImage(true)}>
                                    <Ionicons name="camera" size={24} color="#fff" />
                                    <Text style={styles.pickerBtnText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.pickerBtn, styles.galleryBtn]} onPress={() => pickImage(false)}>
                                    <Ionicons name="images" size={24} color="#00b894" />
                                    <Text style={[styles.pickerBtnText, { color: '#00b894' }]}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.pickerBtn, styles.docBtn]} onPress={pickDocument}>
                                    <Ionicons name="document" size={24} color="#636e72" />
                                    <Text style={[styles.pickerBtnText, { color: '#636e72' }]}>File</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <UploadPreview file={file} onRemove={() => setFile(null)} />
                        )}

                        {/* Medication Selector */}
                        <Text style={styles.label}>Link to Medication (Optional)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.medChip,
                                    medicationId === '' && styles.medChipSelected
                                ]}
                                onPress={() => setMedicationId('')}
                            >
                                <Text style={[
                                    styles.medChipText,
                                    medicationId === '' && styles.medChipTextSelected
                                ]}>
                                    None
                                </Text>
                            </TouchableOpacity>
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

                        <InputField
                            label="Notes"
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any notes..."
                            multiline
                            numberOfLines={3}
                        />

                        <ButtonPrimary
                            title={uploading ? 'Uploading...' : 'Upload Prescription'}
                            onPress={handleUpload}
                            loading={uploading}
                            disabled={!file}
                            style={styles.uploadBtn}
                        />
                    </View>
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
        fontSize: 20,
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
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#636e72',
        marginBottom: 10,
        marginTop: 10,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerBtn: {
        flex: 1,
        backgroundColor: '#00b894',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    galleryBtn: {
        backgroundColor: '#dfe6e9',
    },
    docBtn: {
        backgroundColor: '#f1f2f6',
    },
    pickerBtnText: {
        color: '#fff',
        fontWeight: '600',
        marginTop: 5,
        fontSize: 12,
    },
    medSelector: {
        flexDirection: 'row',
        marginBottom: 20,
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
    uploadBtn: {
        marginTop: 20,
        backgroundColor: '#00b894',
    },
});

export default PrescriptionUploadScreen;
