import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Button from "../components/shared/Button";
import EmptyState from "../components/shared/EmptyState";
import { useTransactions } from "../context/TransactionsContext";

export default function TransactionsScreen() {
    const { items } = useTransactions();
    return (
        <View style={styles.container}>
            {items.length === 0 ? (
                <EmptyState message="Nessuna transazione" />
            ) : (
                <FlatList
                    data={items} // o come si chiama nel tuo screen
                    keyExtractor={(t) => `${t.type}-${t.id}`} // <- chiave unica
                    renderItem={({ item }) => (
                        <Text>
                            {item.description} - {item.amount}
                        </Text>
                    )}
                />
            )}
            <Button title="Aggiungi" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});
