import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/shared/Button';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { profile } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.name}</Text>
      <Text>{profile?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 8 },
});
