import React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { setItem } from '../../services/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const OnboardingScreen = ({ navigation }) => {
    const onDone = async () => {
        await setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        navigation.replace('Login');
    };

    const DoneButton = ({ ...props }) => (
        <TouchableOpacity style={{ marginRight: 20 }} {...props}>
            <Text style={{ fontSize: 16, color: '#00b894', fontWeight: 'bold' }}>Done</Text>
        </TouchableOpacity>
    );

    const NextButton = ({ ...props }) => (
        <TouchableOpacity style={{ marginRight: 20 }} {...props}>
            <Ionicons name="arrow-forward-circle" size={40} color="#00b894" />
        </TouchableOpacity>
    );

    const SkipButton = ({ ...props }) => (
        <TouchableOpacity style={{ marginLeft: 20 }} {...props}>
            <Text style={{ fontSize: 16, color: '#636e72' }}>Skip</Text>
        </TouchableOpacity>
    );

    const Dot = ({ selected }) => {
        return (
            <View
                style={{
                    width: selected ? 20 : 6,
                    height: 6,
                    marginHorizontal: 3,
                    backgroundColor: selected ? '#00b894' : '#dfe6e9',
                    borderRadius: 3,
                }}
            />
        );
    };

    return (
        <Onboarding
            onSkip={onDone}
            onDone={onDone}
            DoneButtonComponent={DoneButton}
            NextButtonComponent={NextButton}
            SkipButtonComponent={SkipButton}
            DotComponent={Dot}
            bottomBarHighlight={false}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Ionicons name="medkit" size={100} color="#00b894" />,
                    title: 'Welcome to MediAssist',
                    subtitle: 'Your personal medication assistant.',
                    titleStyles: { color: '#2d3436', fontWeight: 'bold', fontSize: 24 },
                    subTitleStyles: { color: '#636e72', fontSize: 16, paddingHorizontal: 20 },
                },
                {
                    backgroundColor: '#fff',
                    image: <Ionicons name="alarm" size={100} color="#00b894" />,
                    title: 'Track Medications',
                    subtitle: 'Never miss a dose again with smart reminders.',
                    titleStyles: { color: '#2d3436', fontWeight: 'bold', fontSize: 24 },
                    subTitleStyles: { color: '#636e72', fontSize: 16, paddingHorizontal: 20 },
                },
                {
                    backgroundColor: '#fff',
                    image: <Ionicons name="heart" size={100} color="#00b894" />,
                    title: 'Stay Healthy',
                    subtitle: 'Keep track of your health and adherence history.',
                    titleStyles: { color: '#2d3436', fontWeight: 'bold', fontSize: 24 },
                    subTitleStyles: { color: '#636e72', fontSize: 16, paddingHorizontal: 20 },
                },
            ]}
        />
    );
};

export default OnboardingScreen;
