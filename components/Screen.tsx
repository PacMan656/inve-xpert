import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Screen({ title, children, rightAction }: { title: string; children: ReactNode; rightAction?: ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {rightAction}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '700' }
});