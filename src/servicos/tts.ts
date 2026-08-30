import * as Speech from "expo-speech";

export function falarResposta(texto: string): void {
    if (!texto.trim()) {
        return;
    }

    Speech.stop();

    Speech.speak(texto, {
        language: "pt-BR",
        rate: 0.9,
    });
}

export function pararFala(): void {
    Speech.stop();
}