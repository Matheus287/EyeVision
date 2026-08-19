import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { cores } from "../theme/colors";
import { Texto } from "../components/Texto";

export default function Historico() {

    const router = useRouter();

    return (
        <SafeAreaView style={estilos.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >

                <View style={estilos.cabecalho}>

                    <TouchableOpacity
                        style={estilos.botaoVoltar}
                        onPress={() => router.back()}
                    >
                        <Feather
                            name="chevron-left"
                            size={28}
                            color={cores.primariaClara}
                        />
                    </TouchableOpacity>

                </View>

                <Texto style={estilos.titulo}>
                    Histórico
                </Texto>


                <Texto style={estilos.subtitulo}>
                    Hoje
                </Texto>

                <View style={estilos.card}>

                    <View style={estilos.item}>

                        <View style={estilos.icone}>
                            <Feather
                                name="volume-2"
                                size={22}
                                color={cores.primariaClara}
                            />
                        </View>

                        <View style={estilos.informacoes}>
                            <Texto style={estilos.tipo}>
                                Leitura de texto
                            </Texto>

                            <Texto style={estilos.descricao}>
                                Texto identificado e lido
                            </Texto>
                        </View>

                        <Texto style={estilos.horario}>
                            10:42
                        </Texto>

                    </View>


                    <View style={[estilos.item, estilos.itemBorda]}>

                        <View style={estilos.icone}>
                            <Feather
                                name="eye"
                                size={22}
                                color={cores.primariaClara}
                            />
                        </View>

                        <View style={estilos.informacoes}>
                            <Texto style={estilos.tipo}>
                                Objeto identificado
                            </Texto>

                            <Texto style={estilos.descricao}>
                                Pessoa
                            </Texto>
                        </View>

                        <Texto style={estilos.horario}>
                            10:38
                        </Texto>

                    </View>

                </View>


                <Texto style={estilos.subtitulo}>
                    Ontem
                </Texto>

                <View style={estilos.card}>

                    <View style={estilos.item}>

                        <View style={estilos.icone}>
                            <Feather
                                name="volume-2"
                                size={22}
                                color={cores.primariaClara}
                            />
                        </View>

                        <View style={estilos.informacoes}>
                            <Texto style={estilos.tipo}>
                                Leitura de texto
                            </Texto>

                            <Texto style={estilos.descricao}>
                                Texto identificado e lido
                            </Texto>
                        </View>

                        <Texto style={estilos.horario}>
                            18:21
                        </Texto>

                    </View>


                    <View style={[estilos.item, estilos.itemBorda]}>

                        <View style={estilos.icone}>
                            <Feather
                                name="alert-triangle"
                                size={22}
                                color={cores.primariaClara}
                            />
                        </View>

                        <View style={estilos.informacoes}>
                            <Texto style={estilos.tipo}>
                                Obstáculo detectado
                            </Texto>

                            <Texto style={estilos.descricao}>
                                Obstáculo próximo
                            </Texto>
                        </View>

                        <Texto style={estilos.horario}>
                            17:54
                        </Texto>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        padding: 32,
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
        marginBottom: 32,
    },

    subtitulo: {
        fontSize: 18,
        color: cores.primariaClara,
        marginBottom: 12,
        marginLeft: 8,
    },

    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        marginBottom: 32,
        overflow: "hidden",
    },

    item: {
        minHeight: 76,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
    },

    itemBorda: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: cores.divisoria,
    },

    icone: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    informacoes: {
        flex: 1,
    },

    tipo: {
        color: cores.primariaClara,
        fontSize: 16,
    },

    descricao: {
        color: cores.primariaClara,
        opacity: 0.6,
        marginTop: 4,
        fontSize: 14,
    },

    horario: {
        color: cores.primariaClara,
        opacity: 0.5,
        fontSize: 13,
        marginLeft: 8,
    },

});