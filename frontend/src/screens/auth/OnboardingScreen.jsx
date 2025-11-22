import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { setItem } from '../../services/storageHelper';
import { STORAGE_KEYS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Your Health, Simplified',
        description: 'Manage medications, appointments, and wellness for you & family in one intuitive app.',
        icon: 'phone-portrait-outline',
        subIcons: ['medkit-outline', 'calendar-outline', 'pie-chart-outline']
    },
    {
        id: '2',
        title: 'Never Miss a Dose',
        description: 'Get personalized reminders, manage schedules, and track your adherence effortlessly.',
        icon: 'alarm-outline',
        subIcons: ['checkmark-circle-outline', 'time-outline', 'notifications-outline']
    },
    {
        id: '3',
        title: 'Emergency Info, Instantly Accessible',
        description: 'Keep your vital medical data secure and accessible with a tap for first responders.',
        icon: 'qr-code-outline',
        subIcons: ['shield-checkmark-outline', 'document-text-outline', 'medical-outline']
    }
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onDone = async () => {
        await setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        navigation.replace('Login');
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            onDone();
        }
    };

    const handleSkip = () => {
        onDone();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.illustrationContainer}>
                    <View style={styles.mainIconCircle}>
                        <Ionicons name={item.icon} size={80} color="#00b894" />
                    </View>
                    {/* Decorative sub-icons */}
                    <View style={[styles.subIcon, { top: -20, left: 20 }]}>
                        <Ionicons name={item.subIcons[0]} size={30} color="#00cec9" />
                    </View>
                    <View style={[styles.subIcon, { top: 40, right: -30 }]}>
                        <Ionicons name={item.subIcons[1]} size={30} color="#55efc4" />
                    </View>
                    <View style={[styles.subIcon, { bottom: -20, left: -20 }]}>
                        <Ionicons name={item.subIcons[2]} size={30} color="#81ecec" />
                    </View>
                    {/* Dashed circle effect (simulated with border) */}
                    <View style={styles.dashedCircle} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.background}
            />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="sparkles" size={16} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.logoText}>MediAssist</Text>
                        <Ionicons name="sparkles" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </View>
                    <Text style={styles.tagline}>Your Health Companion</Text>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Slides */}
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    scrollEventThrottle={32}
                />

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <View style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>
                                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.pagination}>
                        {slides.map((_, index) => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 20, 10],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={index.toString()}
                                    style={[
                                        styles.dot,
                                        { width: dotWidth, opacity }
                                    ]}
                                />
                            );
                        })}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
        position: 'relative',
        zIndex: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 5,
    },
    skipButton: {
        position: 'absolute',
        right: 20,
        top: 25,
    },
    skipText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    illustrationContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    mainIconCircle: {
        width: 140,
        height: 140,
        backgroundColor: '#fff',
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 2,
    },
    subIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 3,
    },
    dashedCircle: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        zIndex: 1,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#f0f0f0',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 50,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#fff',
        borderRadius: 30,
    },
    buttonGradient: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        backgroundColor: '#fff', // Fallback
    },
    buttonText: {
        color: '#00b894',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        height: 10,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 5,
    },
});

export default OnboardingScreen;
