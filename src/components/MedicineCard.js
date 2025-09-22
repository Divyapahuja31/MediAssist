import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function MedicineCard({ item }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name} <Text style={styles.dose}>{item.dose}</Text></Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={item.taken ? styles.taken : styles.pending}>
        {item.taken ? '✔ Taken' : '○'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },
  name: {
    fontSize: 16,
    fontWeight: '600'
  },
  dose: {
    fontSize: 14,
    color: '#6b7280'
  },
  time: {
    fontSize: 14,
    color: '#9ca3af'
  },
  taken: {
    color: '#059669',
    fontWeight: '600'
  },
  pending: {
    color: '#9ca3af'
  }
})
