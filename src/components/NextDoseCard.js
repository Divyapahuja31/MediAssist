import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function NextDoseCard({ dose }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Next Dose</Text>
      <Text style={styles.time}>{dose.time}</Text>
      <Text style={styles.name}>{dose.name}</Text>
      <Text style={styles.note}>{dose.note}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#4fd1c5'
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5
  },
  time: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10
  },
  note: {
    color: '#e0f2f1',
    fontSize: 14,
    marginTop: 4
  }
})
