import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Header({ name }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Good Afternoon, {name}!</Text>
        <Text style={styles.subtitle}>Your health is looking great today</Text>
      </View>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
