import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.headerBackground}
            >
                <SafeAreaView style={styles.safeHeader}>
                    <View style={styles.appTitleContainer}>
                        <Ionicons name="medical" size={24} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.appTitle}>MediAssist</Text>
                        <Ionicons name="medical" size={24} color="#fff" style={{ marginLeft: 8 }} />
                    </View>
                    <Text style={styles.appSubtitle}>Your Health Companion</Text>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="person" size={40} color="#00b894" />
                            <View style={styles.keyIcon}>
                                <Ionicons name="key" size={16} color="#fff" />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholderTextColor="#b2bec3"
                            />
                            <Ionicons name="mail-outline" size={20} color="#b2bec3" />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor="#b2bec3"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#b2bec3" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPass}>
                            <Text style={styles.forgotPassText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.loginBtnWrapper}>
                            <LinearGradient
                                colors={['#00b894', '#00cec9']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.loginBtn}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have you account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.signupBtn}>
                                <Text style={styles.signupBtnText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dfe6e9', // Light blue-grey background
    },
    headerBackground: {
        height: '45%',
        width: '100%',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    safeHeader: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
    },
    appTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    appSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoCircle: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    keyIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#00b894',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    keyboardView: {
        flex: 1,
        marginTop: -60, // Pull card up
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        minHeight: 400,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f1f2f6',
        height: 55,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2d3436',
        height: '100%',
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPassText: {
        color: '#b2bec3',
        fontSize: 14,
    },
    loginBtnWrapper: {
        marginBottom: 20,
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#2d3436',
        fontSize: 14,
    },
    signupBtn: {
        borderWidth: 1,
        borderColor: '#00b894',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    signupBtnText: {
        color: '#00b894',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default LoginScreen;
