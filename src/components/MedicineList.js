import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MedicineCard from './MedicineCard'

export default function MedicineList({ items }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Medicines</Text>
      {items.map(med => (
        <MedicineCard key={med.id} item={med} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  title: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  }
})
