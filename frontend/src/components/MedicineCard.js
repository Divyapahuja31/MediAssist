import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MedicineCard({ name, dose, time, taken }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.dose}>{dose}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      {taken && <Ionicons name="checkmark-circle" size={24} color="#0ea5e9" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  dose: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
