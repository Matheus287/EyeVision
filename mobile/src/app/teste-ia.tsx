import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Alert, Image, ScrollView } from "react-native";
import { falarResposta } from "../servicos/tts";
import { analisarConteudo } from "../servicos/geminiService";
import { arquivoParaBase64 } from "../servicos/arquivoParaBase64";
import { Texto } from "../components/Texto"
import { useAnuncioDeTela } from "../servicos/useAcessibilidade";

const IMAGEM_TESTE = require("../assets/img/teste.jpg");
const AUDIO_TESTE = require("../assets/audio/teste.mp3");

export default function TesteIA() {

    const [resposta, setResposta] = useState("");
    const [carregando, setCarregando] = useState(false);

    useAnuncioDeTela("Teste de inteligência artificial");

    async function executarAnalise() {

        setCarregando(true);
        setResposta("");

        try {

            const IMAGEM_TESTE = require("../assets/img/teste.jpg");
            const AUDIO_TESTE = require("../assets/audio/teste.mp3");

            const imagemBase64 = await arquivoParaBase64(IMAGEM_TESTE);
            const audioBase64 = await arquivoParaBase64(AUDIO_TESTE);

            const resultado = await analisarConteudo({
                imagem: imagemBase64,
                audio: audioBase64,
                mimeTypeImagem: "image/jpeg",
                mimeTypeAudio: "audio/mpeg"
            });

            if (resultado.sucesso) {

                setResposta(resultado.resposta);

                falarResposta(resultado.resposta);

            } else {

                setResposta(resultado.erro ?? "Erro desconhecido.");

                Alert.alert(
                    "Erro",
                    resultado.erro ?? "Erro desconhecido."
                );
            }

        } catch (erro) {

            console.error("Erro ao executar análise:", erro);

            setResposta(
                "Não foi possível realizar a análise."
            );

            Alert.alert(
                "Erro",
                "Não foi possível realizar a análise."
            );

        } finally {
            setCarregando(false);
        }
    }

    return (
        <View style={styles.container}>
        <ScrollView>

            <Texto style={styles.titulo} accessibilityRole="header">
                Teste de IA
            </Texto>

            <Pressable
                style={styles.botao}
                onPress={executarAnalise}
                disabled={carregando}
                accessibilityRole="button"
                accessibilityLabel={carregando ? "Analisando" : "Analisar"}
                accessibilityState={{ busy: carregando, disabled: carregando }}
            >
                {carregando ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.textoBotao}>
                        Analisar
                    </Text>
                )}
            </Pressable>

            {resposta !== "" && (
                <Texto style={styles.resposta}>
                    {resposta}
                </Texto>
            )}
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 20
    },

    titulo: {
        fontSize: 28,
        fontWeight: "bold"
    },

    botao: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "#3A506B"
    },

    textoBotao: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold"
    },

    resposta: {
        fontSize: 18,
        lineHeight: 26
    }
});
