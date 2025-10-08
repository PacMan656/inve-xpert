import { Button } from 'react-native';
import { speakText } from '../lib/tts';

export default function TtsButton({ text }: { text: string }) {
  return <Button title="Ouvir descrição" onPress={() => speakText(text)} />;
}