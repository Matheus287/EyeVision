import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";
import { anunciar, useAnuncioDeTela } from "../servicos/useAcessibilidade";

const idiomas = [
    "Português (Brasil)",
    "English",
    "Español",
];

export default function IdiomaLeitura() {

    const router = useRouter();

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    useAnuncioDeTela("Idioma de leitura");

    function selecionarIdioma(idioma: string) {
        alterarConfiguracao("idiomaLeitura", idioma);
        anunciar(`Idioma de leitura definido para ${idioma}`);
    }

    return (
        <ScrollView
            style={estilos.container}
            contentContainerStyle={estilos.conteudo}
        >

            <View style={estilos.cabecalho}>

                <Pressable
                    style={estilos.botaoVoltar}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <Feather
                        name="chevron-left"
                        size={28}
                        color={cores.primariaClara}
                    />
                </Pressable>

            </View>

            <Texto style={estilos.titulo} accessibilityRole="header">
                Idioma de leitura
            </Texto>

            <View style={estilos.card} accessibilityRole="radiogroup">

                {idiomas.map((idioma, indice) => {

                    const selecionado =
                        configuracoes.idiomaLeitura === idioma;

                    return (
                        <Pressable
                            key={idioma}
                            style={[
                                estilos.item,
                                indice !== idiomas.length - 1 &&
                                    estilos.itemBorda,
                            ]}
                            onPress={() => selecionarIdioma(idioma)}
                            accessibilityRole="radio"
                            accessibilityLabel={idioma}
                            accessibilityState={{ checked: selecionado }}
                        >

                            <Texto style={estilos.texto}>
                                {idioma}
                            </Texto>

                            {selecionado && (
                                <Feather
                                    name="check"
                                    size={20}
                                    color={cores.terciaria}
                                />
                            )}

                        </Pressable>
                    );

                })}

            </View>

        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    conteudo: {
        padding: 32,
        paddingBottom: 48,
    },
    cabecalho: {
        marginBottom: 16,
    },
    botaoVoltar: {
        alignSelf: "flex-start",
        padding: 4,
    },
    titulo: {
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
        marginBottom: 32,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    item: {
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemBorda: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    texto: {
        color: cores.primariaClara,
        fontSize: 16,
    },
});
