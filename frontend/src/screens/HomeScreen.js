import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header";
import NextDoseCard from "../components/NextDoseCard";
import MedicineList from "../components/MedicineList";
import QuickActions from "../components/QuickActions";
import HealthTip from "../components/HealthTip";

export default function HomeScreen() {
  const medicines = [
    { name: "Lisinopril", dose: "10mg", time: "9:00 AM", taken: true },
    { name: "Amlodipine", dose: "5mg", time: "8:00 AM", taken: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Header name="Divya" />

        <NextDoseCard
          time="10:30 AM"
          medicine="Metformin 500mg"
          note="After Breakfast"
        />


        <MedicineList medicines={medicines} />

        <QuickActions onAction={(action) => console.log(action)} />


        <HealthTip tip="Taking medicines with meals can help reduce stomach irritation. Remember to drink plenty of water!" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});
