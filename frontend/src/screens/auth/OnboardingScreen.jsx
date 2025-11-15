import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
    const handleDone = async () => {
        try {
            await AsyncStorage.setItem('hasOnboarded', 'true');
            navigation.replace('Login');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Onboarding
            onSkip={handleDone}
            onDone={handleDone}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <View style={styles.placeholderImage}><Text>🖼️</Text></View>,
                    title: 'Track Your Meds',
                    subtitle: 'Never miss a dose again with our smart reminders.',
                },
                {
                    backgroundColor: '#fff',
                    image: <View style={styles.placeholderImage}><Text>📄</Text></View>,
                    title: 'Manage Prescriptions',
                    subtitle: 'Keep all your prescriptions in one safe place.',
                },
                {
                    backgroundColor: '#fff',
                    image: <View style={styles.placeholderImage}><Text>👩‍⚕️</Text></View>,
                    title: 'Stay Healthy',
                    subtitle: 'Monitor your adherence and share with your doctor.',
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    placeholderImage: {
        width: 150,
        height: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default OnboardingScreen;
