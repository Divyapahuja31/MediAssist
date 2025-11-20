import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/formatters';

const PrescriptionCard = ({ prescription, onPress, onDownload, onDelete }) => {
    const isImage = prescription.filename?.match(/\.(jpg|jpeg|png|gif)$/i);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                {isImage ? (
                    <Ionicons name="image" size={24} color="#0984e3" />
                ) : (
                    <Ionicons name="document-text" size={24} color="#e17055" />
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.filename} numberOfLines={1}>{prescription.filename}</Text>
                <Text style={styles.date}>{formatDate(prescription.uploadedAt)}</Text>
                {prescription.medication && (
                    <View style={styles.badge}>
                        <Ionicons name="link-outline" size={12} color="#636e72" />
                        <Text style={styles.badgeText} numberOfLines={1}>
                            {prescription.medication.name}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onDownload} style={styles.actionBtn}>
                    <Ionicons name="download-outline" size={20} color="#636e72" />
                </TouchableOpacity>
                {onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
                        <Ionicons name="trash-outline" size={20} color="#ff7675" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: {
        flex: 1,
        marginRight: 10,
    },
    filename: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 4,
    },
    date: {
        fontSize: 13,
        color: '#b2bec3',
        marginBottom: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        color: '#636e72',
        marginLeft: 4,
        maxWidth: 150,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        padding: 8,
        marginLeft: 5,
    },
});

export default PrescriptionCard;
