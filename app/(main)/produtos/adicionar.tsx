import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import Screen from '../../../components/Screen';
import { addProduct } from '../../../lib/repo';

export default function AdicionarProduto() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('0');

  function salvar() {
    if (!name || !sku) { Alert.alert('Aviso', 'Preencha nome e SKU.'); return; }
    try { addProduct({ name, sku, stock: Number(stock)||0 }); router.back(); }
    catch(e:any){ Alert.alert('Erro', e.message); }
  }

  return (
    <Screen title="Adicionar Produto">
      <View style={styles.form}>
        <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="SKU" style={styles.input} value={sku} onChangeText={setSku} autoCapitalize="characters" />
        <TextInput placeholder="Estoque Inicial" style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />
        <Button title="Salvar" onPress={salvar} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  form: { gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }
});