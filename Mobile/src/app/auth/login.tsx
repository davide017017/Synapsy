import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/shared/Button';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) return;
    await login(parsed.data.email, parsed.data.password);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synapsy Login</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        style={styles.input}
        onChangeText={(t) => setValue('email', t)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(t) => setValue('password', t)}
      />
      <Button title="Login" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});
