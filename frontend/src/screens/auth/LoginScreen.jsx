import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid credentials or network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Your Personal Health & Medicine Management</Text>

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={() => { /* Forgot Password */ }}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        padding: 20, 
        justifyContent: 'center', 
        backgroundColor: '#fff' 
    },
    logo: { 
        width: 80,
        height: 80, 
        alignSelf: 'center', 
        marginBottom: 20, 
        resizeMode: 'contain' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 14, 
        color: '#666', 
        textAlign: 'center', 
        marginBottom: 30 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15 
    },
    forgotText: { 
        textAlign: 'right', 
        color: '#666', 
        marginBottom: 20 
    },
    button: { 
        backgroundColor: '#4CD964', 
        padding: 15,
        borderRadius: 10, 
        alignItems: 'center' 
    },
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    footer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 20 
    },
    link: { 
        color: '#007AFF', 
        fontWeight: 'bold' },
});

export default LoginScreen;
