const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const GEMINI_MODEL = "gemini-3.7-flash";

const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface DadosAnalise {
    imagem?: string;
    audio?: string;

    mimeTypeImagem?: string;
    mimeTypeAudio?: string;
}

export interface ResultadoAnalise {
    sucesso: boolean;
    resposta: string;
    erro?: string;
}

const INSTRUCAO_SISTEMA = `
Você é o assistente de inteligência artificial do EyeVision,
um dispositivo assistivo destinado a auxiliar pessoas com
deficiência visual.

Você receberá:
- uma imagem capturada pelo dispositivo;
- um áudio contendo a solicitação do usuário.

Sua tarefa é compreender a solicitação presente no áudio
e utilizar a imagem para realizar essa tarefa.

Regras:
- Responda de forma clara, objetiva e natural.
- Priorize as informações relevantes para a solicitação.
- Não invente informações que não possam ser identificadas.
- Se não tiver certeza sobre alguma informação, deixe isso claro.
- A resposta será convertida em voz.
- Não utilize tabelas, emojis ou formatação desnecessária.
`;

export async function analisarConteudo(
    dados: DadosAnalise
): Promise<ResultadoAnalise> {

    if (!GEMINI_API_KEY) {
        return {
            sucesso: false,
            resposta: "",
            erro: "Chave da API do Gemini não configurada."
        };
    }

    if (!dados.imagem && !dados.audio) {
        return {
            sucesso: false,
            resposta: "",
            erro: "Nenhuma imagem ou áudio foi fornecido."
        };
    }

    const parts: Array<Record<string, unknown>> = [];

    parts.push({
        text: INSTRUCAO_SISTEMA
    });

    if (dados.imagem) {
        parts.push({
            inlineData: {
                mimeType: dados.mimeTypeImagem ?? "image/jpeg",
                data: dados.imagem
            }
        });
    }

    if (dados.audio) {
        parts.push({
            inlineData: {
                mimeType: dados.mimeTypeAudio ?? "audio/mp3",
                data: dados.audio
            }
        });
    }

    try {
        const resposta = await fetch(GEMINI_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
            },

            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts
                    }
                ]
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.text();

            console.error("Erro da API Gemini:", erro);

            return {
                sucesso: false,
                resposta: "",
                erro: `Erro da API Gemini: ${resposta.status}`
            };
        }

        const dadosResposta = await resposta.json();

        const texto =
            dadosResposta.candidates?.[0]
                ?.content?.parts
                ?.find((part: { text?: string }) => part.text)
                ?.text ?? "";

        if (!texto) {
            return {
                sucesso: false,
                resposta: "",
                erro: "O Gemini não retornou uma resposta."
            };
        }

        return {
            sucesso: true,
            resposta: texto.trim()
        };

    } catch (erro) {
        console.error("Erro ao comunicar com o Gemini:", erro);

        return {
            sucesso: false,
            resposta: "",
            erro: "Não foi possível conectar ao Gemini."
        };
    }
}