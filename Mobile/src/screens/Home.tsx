import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/shared/Button';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto {user?.name || 'utente'}!</Text>
      <Button title="Vai a Transactions" onPress={() => navigation.navigate('Transactions')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});
