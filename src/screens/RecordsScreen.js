import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📋 Medical Records</Text>
      <Text style={styles.subText}>Your saved prescriptions, reports, and history will appear here.</Text>
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
