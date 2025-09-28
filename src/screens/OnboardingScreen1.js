import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen1({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")} 
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Simplify Your{"\n"}Health Journey</Text>

      <Image
        source={require("../../assets/onboard1.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>
        Manage medicines, store records, and{"\n"}
        access emergency info—all in one place.
      </Text>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("OnboardingScreen2")} 
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#4A90E2",
  },
  title: {
    fontSize: width * 0.08, // Adjust font size based on screen width
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Helvetica",
    marginTop: height * 0.1, 
  },
  image: {
    width: width * 0.8, 
    height: height * 0.4,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: width * 0.045, 
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: width * 0.05, 
  },
  nextButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#4A90E2",
  },
});
