import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import MedicineCard from "./MedicineCard";

export default function MedicineList({ medicines }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Medicines</Text>
      <FlatList
        data={medicines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MedicineCard
            name={item.name}
            dose={item.dose}
            time={item.time}
            taken={item.taken}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginHorizontal: 20,
    color: "#000",
  },
});
