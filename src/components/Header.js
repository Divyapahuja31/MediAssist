import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

export default function Header({ userName = 'Krit' }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>Hello, {userName}!</Text>
      </View>
      <Image
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH6gP2cXHCBfE3Q4snVK7RZuquprmqEBFHkg&s' }}
        style={styles.avatar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 20
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
})
