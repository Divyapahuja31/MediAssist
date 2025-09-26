import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function QuickActions({ onAction }) {
  const actions = [
    { id: 1, title: "Add Medicine", icon: "add-circle", color: "#38bdf8" },
    { id: 2, title: "Upload Prescription", icon: "cloud-upload", color: "#38bdf8" },
    { id: 3, title: "Emergency Card", icon: "shield-alert", color: "#f87171" },
    { id: 4, title: "Health Journal", icon: "book", color: "#34d399" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.color + "20" }]}
            onPress={() => onAction?.(item.title)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              {item.icon === "shield-alert" ? (
                <MaterialCommunityIcons name={item.icon} size={22} color="#fff" />
              ) : (
                <Ionicons name={item.icon} size={22} color="#fff" />
              )}
            </View>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
