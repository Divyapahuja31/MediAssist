import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Linking, Button } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getPrescriptionDownloadUrl } from '../../../api/prescriptions';

const PrescriptionDetailScreen = ({ route }) => {
    const { id } = route.params;

    const { data, isLoading, error } = useQuery({
        queryKey: ['prescription-url', id],
        queryFn: () => getPrescriptionDownloadUrl(id),
    });

    const url = data?.data?.url;

    useEffect(() => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    }, [url]);

    if (isLoading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;
    if (error) return <Text style={styles.center}>Error loading prescription</Text>;

    return (
        <View style={styles.center}>
            <Text style={styles.text}>Opening prescription...</Text>
            {url && <Button title="Open Again" onPress={() => Linking.openURL(url)} />}
        </View>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    text: { marginBottom: 20, fontSize: 16, color: '#333' },
});

export default PrescriptionDetailScreen;
