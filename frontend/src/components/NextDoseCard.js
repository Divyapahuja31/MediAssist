import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NextDoseCard({ time, medicine, note }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Next Dose</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.medicine}>{medicine}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bae6fd",
    padding: 20,
    borderRadius: 16,
    marginVertical: 12,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#0369a1",
    fontWeight: "600",
    marginBottom: 8,
  },
  time: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  medicine: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    color: "#000",
  },
  note: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
