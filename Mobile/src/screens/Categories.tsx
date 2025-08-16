import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Button from '../components/shared/Button';
import EmptyState from '../components/shared/EmptyState';
import { useCategories } from '../context/CategoriesContext';

export default function CategoriesScreen() {
  const { items } = useCategories();
  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <EmptyState message="Nessuna categoria" />
      ) : (
        <FlatList
          data={items}
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
