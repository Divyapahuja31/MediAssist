import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPrescription } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';

const PrescriptionUploadScreen = ({ navigation, route }) => {
    const medicationId = route.params?.medicationId;
    const [image, setImage] = useState(null);
    const queryClient = useQueryClient();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const mutation = useMutation({
        mutationFn: (formData) => uploadPrescription(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(['prescriptions']);
            Alert.alert('Success', 'Prescription uploaded!');
            navigation.goBack();
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to upload prescription');
            console.error(error);
        },
    });

    const handleUpload = () => {
        if (!image) {
            Alert.alert('Error', 'Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            name: 'prescription.jpg',
            type: 'image/jpeg',
        });
        if (medicationId) {
            formData.append('medicationId', medicationId);
        }

        mutation.mutate(formData);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.previewContainer}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="image-outline" size={60} color="#ccc" />
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={pickImage}>
                    <Ionicons name="images" size={24} color="#007AFF" />
                    <Text style={styles.btnText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={takePhoto}>
                    <Ionicons name="camera" size={24} color="#007AFF" />
                    <Text style={styles.btnText}>Camera</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.uploadBtn, !image && styles.disabledBtn]}
                onPress={handleUpload}
                disabled={!image || mutation.isPending}
            >
                {mutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.uploadBtnText}>Upload Prescription</Text>
                )}
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
    previewContainer: {
        height: 300,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden'
    },
    preview: {
        width: '100%',
        height: '100%'
    },
    placeholder: {
        alignItems: 'center'
    },
    placeholderText: {
        marginTop: 10,
        color: '#999'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30
    },
    btn: {
        alignItems: 'center',
        padding: 10
    },
    btnText: {
        marginTop: 5,
        color: '#007AFF',
        fontWeight: '600'
    },
    uploadBtn: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center'
    },
    uploadBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    disabledBtn: {
        backgroundColor: '#ccc'
    },
});

export default PrescriptionUploadScreen;
