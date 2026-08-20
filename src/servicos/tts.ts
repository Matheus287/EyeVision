import * as Speech from "expo-speech";

interface OpcoesTTS {
    idioma?: string;
    velocidade?: number;
    volume?: number;
    tom?: number;
}

export function converterIdioma(idioma: string): string {

    switch (idioma) {

        case "English":
            return "en-US";

        case "Español":
            return "es-ES";

        case "Português (Brasil)":
        default:
            return "pt-BR";
    }
}

export function falar(
    texto: string,
    opcoes: OpcoesTTS = {}
) {

    if (!texto.trim()) {
        return;
    }

    Speech.stop();

    Speech.speak(texto, {
        language: opcoes.idioma ?? "pt-BR",
        rate: opcoes.velocidade ?? 1,
        volume: opcoes.volume ?? 1,
        pitch: opcoes.tom ?? 1,
    });
}

export function pararFala() {
    Speech.stop();
}