import * as Speech from "expo-speech";
import { analisarConteudo } from "./geminiService";

export interface ResultadoIA {
    sucesso: boolean;
    resposta: string;
    erro?: string;
}

export async function processarCaptura(
    imagem: string | null,
    audio: string | null,
    mimeTypeImagem = "image/jpeg",
    mimeTypeAudio = "audio/mpeg"
): Promise<ResultadoIA> {

    if (!imagem && !audio) {
        return {
            sucesso: false,
            resposta: "",
            erro: "Nenhuma imagem ou áudio disponível."
        };
    }

    try {

        const resultado = await analisarConteudo({
            imagem: imagem ?? undefined,
            audio: audio ?? undefined,
            mimeTypeImagem,
            mimeTypeAudio
        });

        if (!resultado.sucesso) {
            return resultado;
        }

        const resposta = resultado.resposta.trim();

        if (!resposta) {
            return {
                sucesso: false,
                resposta: "",
                erro: "O Gemini não retornou uma resposta."
            };
        }

        Speech.speak(resposta, {
            language: "pt-BR",
            rate: 0.95
        });

        return {
            sucesso: true,
            resposta
        };

    } catch (erro) {

        console.error(
            "Erro ao processar captura:",
            erro
        );

        return {
            sucesso: false,
            resposta: "",
            erro: "Não foi possível processar a captura."
        };
    }
}