import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function UploadPrescriptionScreen() {
  const navigation = useNavigation();

  const recentDocuments = [
    { id: "1", title: "Dr. Sharma - Prescription", date: "Oct 19, 2023", type: "Prescription" },
    { id: "2", title: "Eye Exam Report", date: "Oct 26, 2023", type: "Report" },
    { id: "3", title: "Blood Test Results", date: "Sep 15, 2023", type: "Lab Report" },
  ];

  const renderDocument = ({ item }) => (
    <View style={styles.documentItem}>
      <Ionicons name="document-outline" size={24} color="#4A90E2" />
      <View style={styles.documentDetails}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentDate}>{item.date}</Text>
      </View>
      <Text style={styles.documentType}>{item.type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Upload Prescription</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="camera-outline" size={28} color="#4A90E2" />
          <Text style={styles.actionText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cloud-upload-outline" size={28} color="#4A90E2" />
          <Text style={styles.actionText}>Upload File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentDocuments}>
        <Text style={styles.sectionTitle}>Recent Documents</Text>
        <FlatList
          data={recentDocuments}
          renderItem={renderDocument}
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 120,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 140,
    height: 140,
    backgroundColor: "#EAF6FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  recentDocuments: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentDetails: {
    flex: 1,
    marginLeft: 10,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  documentDate: {
    fontSize: 14,
    color: "#888888",
  },
  documentType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
});
