import React from 'react'
import { ScrollView, View } from 'react-native'
import Header from '../components/Header'
import NextDoseCard from '../components/NextDoseCard'
import MedicineList from '../components/MedicineList'
import { medicines, nextDose } from '../data/medicines'

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Header userName="Divya" />
      <View style={{ marginTop: 10 }}>
        <NextDoseCard dose={nextDose} />
        <MedicineList items={medicines} />
      </View>
    </ScrollView>
  )
}
