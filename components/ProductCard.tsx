import { StyleSheet, Text, View } from 'react-native';

export default function ProductCard({ produto }: { produto: { name: string; sku: string; stock: number } }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{produto.name}</Text>
      <Text>SKU: {produto.sku}</Text>
      <Text>Estoque: {produto.stock}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, gap: 4 },
  name: { fontSize: 16, fontWeight: '600' }
});