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
        title: 'Health Simplified',
        description: 'Manage medications, appointments, and wellness for you & family in one intuitive app.',
        icon: 'heart',
        floating: ['pulse', 'medkit']
    },
    {
        id: '2',
        title: 'Track Your Progress',
        description: 'Stay on top of your health goals with easy-to-read charts and daily reminders.',
        icon: 'stats-chart',
        floating: ['calendar', 'alarm']
    },
    {
        id: '3',
        title: 'Stay Connected',
        description: 'Keep your doctors and loved ones updated with your latest health reports instantly.',
        icon: 'people',
        floating: ['shield', 'chatbubbles']
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
                <View style={styles.illustrationContainer}>

                    <View style={[styles.ripple, { width: 200, height: 200, opacity: 0.2 }]} />
                    <View style={[styles.ripple, { width: 280, height: 280, opacity: 0.15 }]} />
                    <View style={[styles.ripple, { width: 360, height: 360, opacity: 0.1 }]} />


                    <View style={styles.mainIconContainer}>
                        <Ionicons name={item.icon} size={100} color="#00b894" />
                    </View>


                    <View style={[styles.floatingIcon, styles.floatingTopRight]}>
                        <Ionicons name={item.floating[0]} size={28} color="#00cec9" />
                    </View>
                    <View style={[styles.floatingIcon, styles.floatingBottomLeft]}>
                        <Ionicons name={item.floating[1]} size={24} color="#81ecec" />
                    </View>
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
            {/* Lighter Mint Green */}
            <LinearGradient
                colors={['#ffffff', '#D1F2EB']}
                style={styles.background}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>

                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

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

                <View style={styles.footer}>
                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {slides.map((_, index) => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [8, 20, 8],
                                extrapolate: 'clamp',
                            });
                            const dotOpacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={index.toString()}
                                    style={[
                                        styles.dot,
                                        { width: dotWidth, opacity: dotOpacity }
                                    ]}
                                />
                            );
                        })}
                    </View>

                    <TouchableOpacity onPress={handleNext} style={styles.buttonContainer}>
                        <LinearGradient
                            colors={['#00b894', '#00cec9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>
                                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                            <Ionicons name="arrow-forward" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    skipButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    skipText: {
        color: '#00b894',
        fontWeight: 'bold',
        fontSize: 16,
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    illustrationContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    ripple: {
        position: 'absolute',
        borderRadius: 200, // Large enough for the biggest circle
        borderWidth: 1,
        borderColor: '#00b894',
        zIndex: 0,
    },
    mainIconContainer: {
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: '#fff',
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingIcon: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    floatingTopRight: {
        top: 20,
        right: 40,
    },
    floatingBottomLeft: {
        bottom: 40,
        left: 40,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#636e72',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 150,
    },
    pagination: {
        flexDirection: 'row',
        height: 10,
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00b894',
        marginHorizontal: 6,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 30,
        shadowColor: '#00b894',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default OnboardingScreen;
