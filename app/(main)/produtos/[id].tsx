import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';



import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../../components/Screen';

// Define the Product type
type Product = {
  name: string;
  sku: string;
  stock: number;
};
// Mock implementation of getProduct function
const getProduct = (id: string): Product | null => {
  const mockProducts: Product[] = [
    { name: 'Produto A', sku: 'A001', stock: 10 },
    { name: 'Produto B', sku: 'B002', stock: 5 },
  ];
  return mockProducts.find(product => product.sku === id) || null;
};

export default function DetalhesProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Product | null>(null);

  useEffect(()=>{ if(id) setProduto(getProduct(String(id))||null); },[id]);
  if (!produto) return <Screen title="Produto"><Text>Produto não encontrado.</Text></Screen>;

  return (
    <Screen title="Detalhes do Produto">
      <View style={styles.box}>
        <Text style={styles.label}>Nome: <Text style={styles.value}>{produto.name}</Text></Text>
        <Text style={styles.label}>SKU: <Text style={styles.value}>{produto.sku}</Text></Text>
        <Text style={styles.label}>Estoque: <Text style={styles.value}>{produto.stock}</Text></Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  box: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, gap: 8 },
  label: { fontSize: 16 },
  value: { fontWeight: '700' }
});