// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatBot from './src';

export default function App() {
  return (
    <View style={styles.container}>
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Added background color
  },
});


