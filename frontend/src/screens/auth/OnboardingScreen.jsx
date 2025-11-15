import React from 'react';
import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { setItem } from '../../services/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';

const OnboardingScreen = ({ navigation }) => {
    const onDone = async () => {
        await setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        navigation.replace('Login');
    };

    return (
        <Onboarding
            onSkip={onDone}
            onDone={onDone}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../../assets/icon.png')} style={{ width: 100, height: 100 }} />,
                    title: 'Welcome to MediAssist',
                    subtitle: 'Your personal medication assistant.',
                },
                {
                    backgroundColor: '#fe6e58',
                    image: <Image source={require('../../../assets/icon.png')} style={{ width: 100, height: 100 }} />,
                    title: 'Track Medications',
                    subtitle: 'Never miss a dose again.',
                },
                {
                    backgroundColor: '#999',
                    image: <Image source={require('../../../assets/icon.png')} style={{ width: 100, height: 100 }} />,
                    title: 'Stay Healthy',
                    subtitle: 'Keep track of your health and adherence.',
                },
            ]}
        />
    );
};

export default OnboardingScreen;
