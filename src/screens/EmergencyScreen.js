import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";

export default function EmergencyScreen() {
  const handleEmergency = () => {
    Alert.alert("🚨 Emergency!", "Calling emergency contact...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚨 Emergency</Text>
      <Text style={styles.subText}>Quick access to call emergency services or contacts.</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Call Emergency" color="#ef4444" onPress={handleEmergency} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
