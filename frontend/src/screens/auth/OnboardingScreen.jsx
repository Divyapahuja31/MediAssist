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
        title: 'Simplify Your Health',
        description: 'Manage medications, appointments, and wellness for you & family in one intuitive app.',
        icon: 'heart-circle-outline',
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
        title: 'Emergency Info',
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

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.card}>
                    <View style={styles.illustrationContainer}>
                        <View style={styles.mainIconCircle}>
                            <Ionicons name={item.icon} size={80} color="#00b894" />
                        </View>
                        {/* Decorative sub-icons */}
                        <View style={[styles.subIcon, { top: -10, left: 10 }]}>
                            <Ionicons name={item.subIcons[0]} size={24} color="#00cec9" />
                        </View>
                        <View style={[styles.subIcon, { top: 30, right: -20 }]}>
                            <Ionicons name={item.subIcons[1]} size={24} color="#55efc4" />
                        </View>
                        <View style={[styles.subIcon, { bottom: -10, left: -10 }]}>
                            <Ionicons name={item.subIcons[2]} size={24} color="#81ecec" />
                        </View>
                        {/* Dashed circle effect */}
                        <View style={styles.dashedCircle} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    <TouchableOpacity style={styles.cardButton} onPress={handleNext}>
                        <LinearGradient
                            colors={['#00b894', '#00cec9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.cardButtonGradient}
                        >
                            <Text style={styles.cardButtonText}>
                                {index === slides.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
                        <Ionicons name="sparkles" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.logoText}>MediAssist</Text>
                        <Ionicons name="sparkles" size={18} color="#fff" style={{ marginLeft: 8 }} />
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
                    contentContainerStyle={{ alignItems: 'center' }}
                />

                {/* Footer (Pagination only) */}
                <View style={styles.footer}>
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
                                outputRange: [0.5, 1, 0.5],
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
        backgroundColor: '#00b894',
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
        paddingTop: 10,
        paddingBottom: 20,
        position: 'relative',
        zIndex: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    skipButton: {
        position: 'absolute',
        right: 25,
        top: 20,
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
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        height: height * 0.65, // Fixed height for consistency
        justifyContent: 'space-between', // Distribute content
    },
    illustrationContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    mainIconCircle: {
        width: 100,
        height: 100,
        backgroundColor: '#f0fdfa', // Very light teal
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    subIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 3,
    },
    dashedCircle: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1.5,
        borderColor: '#00b894',
        borderStyle: 'dashed',
        zIndex: 1,
        opacity: 0.5,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: '#636e72',
        textAlign: 'center',
        lineHeight: 22,
    },
    cardButton: {
        width: '100%',
        marginTop: 30,
        borderRadius: 25,
        overflow: 'hidden',
    },
    cardButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    pagination: {
        flexDirection: 'row',
        height: 10,
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 6,
    },
});

export default OnboardingScreen;
