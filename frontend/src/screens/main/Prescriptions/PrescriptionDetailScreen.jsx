import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, Linking, Share } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrescriptionDownloadUrl, deletePrescription, listPrescriptions } from '../../../api/prescriptions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../../../utils/formatters';

const PrescriptionDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const queryClient = useQueryClient();
    const [imageUrl, setImageUrl] = useState(null);

    // Fetch Prescription Metadata (we might need to fetch list or single item if we don't pass full object)
    // For simplicity, let's assume we fetch the list to find the item, or we could add a getPrescription endpoint.
    // Since listPrescriptions is cached, we can use useQuery to find it from cache or fetch list.
    // But better to just pass the item via params if possible, or fetch list. 
    // Let's fetch the list and find the item to ensure fresh data.
    const { data: listData } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => listPrescriptions(),
    });

    const prescription = listData?.data?.data?.find(p => p.id === id);

    // Fetch Signed URL
    const { data: urlData, isLoading: loadingUrl } = useQuery({
        queryKey: ['prescriptionUrl', id],
        queryFn: () => getPrescriptionDownloadUrl(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (urlData?.data?.url) {
            setImageUrl(urlData.data.url);
        }
    }, [urlData]);

    const deleteMutation = useMutation({
        mutationFn: () => deletePrescription(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['prescriptions']);
            navigation.goBack();
        },
        onError: () => Alert.alert('Error', 'Failed to delete prescription'),
    });

    const handleDelete = () => {
        Alert.alert('Delete Prescription', 'Are you sure? This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
        ]);
    };

    const handleDownload = () => {
        if (imageUrl) {
            Linking.openURL(imageUrl);
        }
    };

    const handleShare = async () => {
        if (imageUrl) {
            try {
                await Share.share({
                    url: imageUrl,
                    message: `Here is my prescription document: ${prescription?.filename}`,
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to share');
            }
        }
    };

    if (!prescription) return <ActivityIndicator style={styles.center} size="large" color="#00b894" />;

    const isImage = prescription.filename?.match(/\.(jpg|jpeg|png|gif)$/i);

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
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                            <Ionicons name="share-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                            <Ionicons name="trash-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.previewContainer}>
                        {loadingUrl ? (
                            <ActivityIndicator size="large" color="#0984e3" />
                        ) : isImage && imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                        ) : (
                            <View style={styles.docPlaceholder}>
                                <Ionicons name="document-text" size={80} color="#b2bec3" />
                                <Text style={styles.docText}>Document Preview Not Available</Text>
                                <TouchableOpacity style={styles.openBtn} onPress={handleDownload}>
                                    <Text style={styles.openBtnText}>Open Document</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.filename}>{prescription.filename}</Text>
                        <Text style={styles.date}>Uploaded on {formatDate(prescription.uploadedAt)}</Text>

                        {prescription.medication && (
                            <View style={styles.medBadge}>
                                <Ionicons name="medkit" size={16} color="#00b894" />
                                <Text style={styles.medName}>{prescription.medication.name}</Text>
                            </View>
                        )}

                        {prescription.meta?.notes && (
                            <View style={styles.notesBox}>
                                <Text style={styles.notesLabel}>Notes:</Text>
                                <Text style={styles.notesText}>{prescription.meta.notes}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
                            <Ionicons name="cloud-download-outline" size={24} color="#fff" />
                            <Text style={styles.downloadText}>Download / Open</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background for viewer feel
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100, // Short header for viewer
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
        zIndex: 10,
    },
    backBtn: {
        padding: 5,
    },
    actions: {
        flexDirection: 'row',
    },
    iconBtn: {
        marginLeft: 15,
        padding: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    docPlaceholder: {
        alignItems: 'center',
    },
    docText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
    },
    openBtn: {
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    openBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40,
    },
    filename: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        color: '#b2bec3',
        marginBottom: 15,
    },
    medBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f9e5', // Light green
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    medName: {
        color: '#00b894',
        fontWeight: '600',
        marginLeft: 8,
    },
    notesBox: {
        backgroundColor: '#f1f2f6',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    notesLabel: {
        fontSize: 12,
        color: '#636e72',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notesText: {
        color: '#2d3436',
        lineHeight: 20,
    },
    downloadBtn: {
        backgroundColor: '#00b894',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 16,
    },
    downloadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PrescriptionDetailScreen;
