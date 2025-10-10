import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function OnboardingScreen3({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        All your Records,{"\n"} Always with You
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/3.png")} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
       Securely store prescriptions,reports and{"\n"}
       more. Access them anytime, anywhere.
      </Text>
      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <LinearGradient
          colors={["#0ea5e9", "#2563eb"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.getStartedButton}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.dotsContainer}>
        <View style={styles.dot} /> 
        <View style={styles.dot} /> 
        <View style={[styles.dot, styles.activeDot]} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    skipButton: {
      position: "absolute",
      top: 20,
      right: 20,
    },
    skipText: {
      color: "#007AFF",
      fontSize: 16,
      fontWeight: "500",
    },
    title: {
      fontSize: 36,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 20,
      marginBottom: 20,
      color: "#000",
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },
    image: {
      width: width * 0.85, 
      height: width * 0.85,
      marginHorizontal: 12,
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      lineHeight: 22,
      marginTop: 10,
      marginBottom: 20,
    },
    getStartedButton: {
      width: width * 0.8,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
      marginTop: 10,
    },
    getStartedText: {
      color: "#fff",
      fontSize: 18, 
      fontWeight: "600",
      paddingHorizontal: 10,
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#ccc",
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: "#2563eb",
    },
  });