import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UploadPrescriptionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Prescription</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },
});
