import { useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../../components/Screen';
import { addMovementTx, getProductBySku } from '../../lib/repo';

export default function Movimentar() {
  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [tipo, setTipo] = useState<'ENTRADA'|'SAIDA'>('ENTRADA');

  const produto = useMemo(() => sku ? getProductBySku(sku) : undefined, [sku]);

  function registrar() {
    const qty = Number(quantidade)||0;
    if (!sku || qty <= 0 || !produto) { Alert.alert('Erro','Informe um SKU válido e quantidade > 0.'); return; }
    try { addMovementTx({ product_id: produto.id, sku: produto.sku, qty, type: tipo }); Alert.alert('OK','Movimentação registrada.'); }
    catch(e:any){ Alert.alert('Erro', e.message); }
  }

  return (
    <Screen title="Registrar Movimentação">
      <View style={styles.form}>
        <Text>SKU</Text>
        <TextInput style={styles.input} value={sku} onChangeText={setSku} autoCapitalize="characters" />
        <Text>Quantidade</Text>
        <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Entrada" onPress={() => setTipo('ENTRADA')} />
          <Button title="Saída" onPress={() => setTipo('SAIDA')} />
          <Button title="Registrar" onPress={registrar} />
        </View>
        {produto && <Text style={{ marginTop: 8 }}>Produto: {produto.name} | Estoque atual: {produto.stock}</Text>}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  form: { gap: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 }
});