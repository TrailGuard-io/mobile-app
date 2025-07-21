import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

export default function App() {
  const handlePanic = () => {
    Alert.alert('🚨 Emergencia', 'Se ha enviado una solicitud de rescate');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrailGuard</Text>
      <Button title="🆘 Botón de Pánico" onPress={handlePanic} color="#c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24, marginBottom: 20
  }
});
