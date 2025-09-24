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

export default function OnboardingScreen2({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Never Miss a Dose,{"\n"}Stay Prepared
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/onboardscreen2.png")} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
        Get smart medicine reminders and instant{"\n"}
        access to your emergency health card.
      </Text>
      <TouchableOpacity onPress={() => navigation.replace("Home")}>
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
        <View style={[styles.dot, styles.activeDot]} />
         <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  skipText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 50,
    color: "#000",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: width * 0.70,
    height: width * 0.70,
    marginHorizontal: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 40,
  },
  getStartedButton: {
    width: width * 0.6,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#0ea5e9",
  },
});
