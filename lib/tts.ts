import * as Speech from 'expo-speech';

export function speakText(text: string) {
  try {
    Speech.stop();
    Speech.speak(text, { language: 'pt-BR', pitch: 1.0, rate: 1.0 });
  } catch {}
}