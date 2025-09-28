import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HealthJournalScreen() {
  const navigation = useNavigation();

  const todayEntries = [
    { id: "1", icon: "cloud-outline", text: "Felt tired, slight headache", emoji: "😔" },
    { id: "2", icon: "thermometer-outline", text: "Morning Temp: 99.8°F", tag: "Fever" },
  ];

  const recentEntries = [
    { id: "3", date: "Today, Oct 27, 2023", text: "Mood: Good, Energy high", emoji: "😊" },
    { id: "4", date: "Yesterday, Oct 26, 2023", text: "Drank 8 glasses of water", emoji: "💧" },
    { id: "5", date: "Sun, Oct 25, 2023", text: "Logged meds, no side effects", emoji: "💊" },
  ];

  const renderEntry = ({ item }) => (
    <View style={styles.entry}>
      <Ionicons name={item.icon || "ellipse-outline"} size={24} color="#333" />
      <View style={styles.entryText}>
        <Text style={styles.entryMainText}>{item.text}</Text>
        {item.tag && <Text style={styles.entryTag}>{item.tag}</Text>}
      </View>
      <Text style={styles.entryEmoji}>{item.emoji}</Text>
    </View>
  );

  const renderRecentEntry = ({ item }) => (
    <View style={styles.recentEntry}>
      <Text style={styles.recentDate}>{item.date}</Text>
      <Text style={styles.recentText}>
        {item.emoji} {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Health Journal</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Entries</Text>
        <FlatList
          data={todayEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        <FlatList
          data={recentEntries}
          renderItem={renderRecentEntry}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  entryText: {
    flex: 1,
    marginLeft: 10,
  },
  entryMainText: {
    fontSize: 16,
    color: "#333333",
  },
  entryTag: {
    fontSize: 14,
    color: "#007BFF",
  },
  entryEmoji: {
    fontSize: 18,
  },
  recentEntry: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  recentDate: {
    fontSize: 14,
    color: "#888888",
  },
  recentText: {
    fontSize: 16,
    color: "#333333",
    marginTop: 5,
  },
});
