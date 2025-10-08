import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const FILENAME = () => `estoque-backup-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;

export async function exportDB(payload: any) {
  const data = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...payload }, null, 2);
  const path = FileSystem.Directory! + FILENAME();
  await FileSystem.writeAsStringAsync(path, data);
  try { if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path); } catch {}
  return { path };
}

export async function importDB(): Promise<any | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: 'application/json', multiple: false, copyToCacheDirectory: true });
  if (res.canceled || !res.assets || !res.assets[0]) return null;
  const uri = res.assets[0].uri;
  const data = await FileSystem.readAsStringAsync(uri);
  return JSON.parse(data);
}