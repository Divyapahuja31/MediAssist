import React from 'react';
import { Image, View, Text } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../../services/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';

const OnboardingScreen = () => {
    const navigation = useNavigation();

    const handleDone = async () => {
        await setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        navigation.replace('Login');
    };

    return (
        <Onboarding
            onSkip={handleDone}
            onDone={handleDone}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/onboarding1.png')} style={{ width: 300, height: 300, resizeMode: 'contain' }} />,
                    title: 'Simplify Your Health Journey',
                    subtitle: 'Manage medicines, store records, and access emergency info—all in one place.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/onboarding2.png')} style={{ width: 300, height: 300, resizeMode: 'contain' }} />,
                    title: 'Never Miss a Dose',
                    subtitle: 'Get smart medicine reminders and instant access to your emergency health card.',
                },
            ]}
        />
    );
};

export default OnboardingScreen;
