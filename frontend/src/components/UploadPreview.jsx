import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UploadPreview = ({ file, onRemove }) => {
    if (!file) return null;

    const isImage = file.type === 'image' || file.mimeType?.startsWith('image/') || file.uri?.match(/\.(jpg|jpeg|png|gif)$/i);

    return (
        <View style={styles.container}>
            <View style={styles.previewBox}>
                {isImage ? (
                    <Image source={{ uri: file.uri }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.docIcon}>
                        <Ionicons name="document-text" size={40} color="#e17055" />
                        <Text style={styles.docName} numberOfLines={1}>{file.name || 'Document'}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
                    <Ionicons name="close-circle" size={24} color="#ff7675" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    previewBox: {
        width: '100%',
        height: 200,
        backgroundColor: '#f1f2f6',
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    docIcon: {
        alignItems: 'center',
        padding: 20,
    },
    docName: {
        marginTop: 10,
        color: '#636e72',
        fontWeight: '500',
    },
    removeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
});

export default UploadPreview;
