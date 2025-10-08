import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import TtsButton from '../components/TtsButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function entrar() { router.replace('/dashboard'); }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <Button title="Entrar" onPress={entrar} />
      <View style={{ marginTop: 16 }}>
        <TtsButton text="Tela de Login. Informe seu e-mail e senha e toque em entrar." />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }
});