import { Tabs } from "expo-router";

export default function MainTabs() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="produtos/index" options={{ title: "Produtos" }} />
      <Tabs.Screen name="movimentar" options={{ title: "Movimentar" }} />
    </Tabs>
  );
}
