import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
            <Text style={styles.info}>Welcome to MediAssist.</Text>

            <View style={styles.placeholder}>
                <Text>Your medications will appear here.</Text>
            </View>

            <Button title="Logout" onPress={logout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        paddingTop: 50, 
        backgroundColor: '#fff' 
    },
    greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    info: { fontSize: 16, color: '#666', marginBottom: 30 },
    placeholder: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#eee', 
        borderRadius: 10, 
        marginBottom: 20 
    },
});

export default HomeScreen;
