import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import TtsButton from '../../components/TtsButton';
import { exportDB, importDB } from '../../lib/backup';
import { exportAll, importAll, kpis } from '../../lib/repo';

export default function Dashboard() {
  const [k, setK] = useState({ produtos: 0, estoqueTotal: 0, entradas: 0, saidas: 0 });
  function refresh() { setK(kpis()); }
  useEffect(() => { refresh(); }, []);

  async function onExport() {
    try {
      const payload = exportAll();
      const { path } = await exportDB(payload as any);
      Alert.alert('Backup criado', `Arquivo: ${path}`);
    } catch (e: any) { Alert.alert('Erro', e.message); }
  }

  async function onImport() {
    try {
      const payload = await importDB();
      if (!payload) return;
      // Mapear se vier de outro formato (nome/quantidade → name/qty)
      const produtos = (payload.produtos||[]).map((p:any)=>({ id:String(p.id), name:String(p.name||p.nome), sku:String(p.sku).toUpperCase(), stock:Number(p.stock??p.estoque)||0, created_at:String(p.created_at||p.createdAt||new Date().toISOString()) }));
      const movimentos = (payload.movimentos||[]).map((m:any)=>({ id:String(m.id), product_id:String(m.product_id||m.productId||''), sku:String(m.sku).toUpperCase(), qty:Number(m.qty??m.quantidade)||0, type:(m.type||m.tipo)==='SAIDA'?'SAIDA':'ENTRADA', at:String(m.at||m.data||new Date().toISOString()) }));
      importAll({ produtos, movimentos });
      refresh();
      Alert.alert('Importação concluída');
    } catch (e: any) { Alert.alert('Erro', e.message); }
  }

  return (
    <Screen title="Dashboard" rightAction={<Button title="Backup" onPress={onExport} /> }>
      <View style={styles.card}>
        <Text style={styles.kpi}>Produtos: {k.produtos}</Text>
        <Text style={styles.kpi}>Estoque total: {k.estoqueTotal}</Text>
        <Text style={styles.kpi}>Entradas: {k.entradas} | Saídas: {k.saidas}</Text>
      </View>
      <View style={styles.row}>
        <Button title="Exportar JSON" onPress={onExport} />
        <Button title="Importar JSON" onPress={onImport} />
        <Button title="Atualizar" onPress={refresh} />
      </View>
      <TtsButton text={`Dashboard. Temos ${k.produtos} produtos e ${k.estoqueTotal} itens em estoque.`} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, borderRadius: 12, borderColor: '#ddd', gap: 8 },
  kpi: { fontSize: 16 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 }
});