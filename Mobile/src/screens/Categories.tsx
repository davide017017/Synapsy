import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Button from '../components/shared/Button';
import EmptyState from '../components/shared/EmptyState';

const mock = [] as any[];

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      {mock.length === 0 ? (
        <EmptyState message="Nessuna categoria" />
      ) : (
        <FlatList
          data={mock}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      )}
      <Button title="Aggiungi" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
