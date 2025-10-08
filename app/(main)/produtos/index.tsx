import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import ProductCard from '../../../components/ProductCard';
import Screen from '../../../components/Screen';
import { listProducts, type Product } from '../../../lib/repo';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  function refresh(){ setProdutos(listProducts()); }
  useEffect(()=>{ refresh(); },[]);

  return (
    <Screen title="Produtos" rightAction={<Button title="Novo" onPress={() => router.push('/produtos/adicionar')} /> }>
      {produtos.length === 0 ? (
        <Text>Nenhum produto cadastrado.</Text>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/produtos/${item.id}`)}>
              <ProductCard produto={{ name: item.name, sku: item.sku, stock: item.stock }} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </Screen>
  );
}