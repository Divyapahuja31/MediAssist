import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HealthTip({ tip }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={20} color="#16a34a" />
        <Text style={styles.title}>Health Tip</Text>
      </View>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#166534",
    marginLeft: 8,
  },
  tip: {
    fontSize: 14,
    color: "#065f46",
    lineHeight: 20,
  },
});
