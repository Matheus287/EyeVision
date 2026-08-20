import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";

const velocidades = [
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    2,
];

export default function VelocidadeFala() {

    const router = useRouter();

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    return (
        <ScrollView
            style={estilos.container}
            contentContainerStyle={estilos.conteudo}
        >

            <Pressable
                style={estilos.botaoVoltar}
                onPress={() => router.back()}
            >
                <Feather
                    name="chevron-left"
                    size={28}
                    color={cores.primariaClara}
                />
            </Pressable>

            <Texto style={estilos.titulo}>
                Velocidade da fala
            </Texto>

            <View style={estilos.card}>

                {velocidades.map((velocidade, indice) => {

                    const selecionada =
                        configuracoes.velocidadeFala === velocidade;

                    return (
                        <Pressable
                            key={velocidade}
                            style={[
                                estilos.item,
                                indice !== velocidades.length - 1 &&
                                    estilos.itemBorda,
                            ]}
                            onPress={() =>
                                alterarConfiguracao(
                                    "velocidadeFala",
                                    velocidade
                                )
                            }
                        >

                            <Texto>
                                {velocidade}x
                            </Texto>

                            {selecionada && (
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
    botaoVoltar: {
        alignSelf: "flex-start",
        padding: 4,
        marginBottom: 16,
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
});