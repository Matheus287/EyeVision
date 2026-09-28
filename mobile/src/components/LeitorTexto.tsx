import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { cores } from "../theme/colors";
import { Texto } from "./Texto";
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";
import { falar, pararFala, converterIdioma } from "../servicos/tts";

interface LeitorTextoProps {
    texto: string;
}

export function LeitorTexto({
    texto,
}: LeitorTextoProps) {

    const { configuracoes } =
        useConfiguracoes();

    function lerTexto() {

        if (!texto.trim()) {
            return;
        }

        falar(texto, {

            idioma: converterIdioma(
                configuracoes.idiomaLeitura
            ),

            velocidade:
                configuracoes.velocidadeFala,

            volume:
                configuracoes.volumeFala,
        });
    }

    return (
        <View style={estilos.container}>

            <Pressable
                style={estilos.botao}
                onPress={lerTexto}
                accessibilityRole="button"
                accessibilityLabel="Ler texto"
            >
                <Feather
                    name="volume-2"
                    size={22}
                    color={cores.primariaClara}
                />

                <Texto style={estilos.textoBotao}>
                    Ler texto
                </Texto>
            </Pressable>

            <Pressable
                style={estilos.botaoParar}
                onPress={pararFala}
                accessibilityRole="button"
                accessibilityLabel="Parar leitura"
            >
                <Feather
                    name="square"
                    size={18}
                    color={cores.primariaClara}
                />

                <Texto style={estilos.textoBotao}>
                    Parar
                </Texto>
            </Pressable>

        </View>
    );
}

const estilos = StyleSheet.create({

    container: {
        width: "100%",
        gap: 12,
    },
    botao: {
        width: "100%",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: cores.secundariaBase,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    botaoParar: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        backgroundColor: cores.primariaBase,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    textoBotao: {
        color: cores.primariaClara,
        fontSize: 16,
    },

});