import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function EmergencyCardScreen() {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Health Card</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.qrContainer}>
          <Image
            source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Emergency+Info" }}
            style={{ width: 150, height: 150 }}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Patient:</Text>
          <Text style={styles.infoText}>Patient Name: [Patient Name]</Text>
          <Text style={styles.infoText}>Blood Group: [B+]</Text>
          <Text style={styles.infoText}>Allergy List: None</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Current Medications:</Text>
          <Text style={styles.infoText}>Lisinopril 10mg - 50mg</Text>
          <Text style={styles.infoText}>Metemurin 500mg - 5mg</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Emergency Contacts:</Text>
          <Text style={styles.infoText}>Rajesh P. (Father) - +1 (555) 123-4567</Text>
          <Text style={styles.infoText}>Priya S. (Sister) - +1 (555) 987-443</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Emergency Info</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
    marginLeft: 10,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  qrContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: "#00AEEF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
