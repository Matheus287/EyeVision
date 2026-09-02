import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { cores } from "../theme/colors";
import { Texto } from "../components/Texto"
import { useAnuncioDeTela } from "../servicos/useAcessibilidade";

const Logo = require("../assets/img/Icone Branco.png");
const Pietro = require("../assets/img/Pietro.png");
const Nicoli = require("../assets/img/Nicoli.png");
const Matheus = require("../assets/img/Matheus.png");
const Samara = require("../assets/img/Samara.png");

export default function Sobre() {

    const router = useRouter();

    useAnuncioDeTela("Sobre o EyeVision");

    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={estilos.container}>
                    <View style={estilos.cabecalho}>
                        <TouchableOpacity
                            style={estilos.botaoVoltar}
                            onPress={() => router.push("/configuracoes")}
                            accessibilityRole="button"
                            accessibilityLabel="Voltar para configurações"
                        >
                            <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Texto style={estilos.titulo} accessibilityRole="header">
                        Sobre
                    </Texto>

                    <View style={estilos.logoContainer}>
                        <Image
                            source={Logo}
                            style={estilos.logo}
                            resizeMode="contain"
                            accessible={false}
                            importantForAccessibility="no"
                        />
                        <Texto style={estilos.nomeApp}>EyeVision</Texto>
                    </View>

                    <View style={estilos.card}>
                        <Texto style={estilos.resumo}>
                            O EyeVision é uma tecnologia assistiva desenvolvida para
                            auxiliar pessoas com deficiência visual por meio de visão
                            computacional, sensores inteligentes e feedback em áudio,
                            promovendo maior autonomia e acessibilidade.
                        </Texto>
                    </View>

                    <Texto style={estilos.subtitulo} accessibilityRole="header">
                        Objetivo
                    </Texto>

                    <View style={estilos.card}>
                        <Texto style={estilos.textoCard}>
                            Democratizar a acessibilidade para pessoas com deficiência
                            visual por meio de um dispositivo que se acopla a um óculos
                            e com suas funções, auxilie essas pessoas na sua vida
                            cotidiana.
                        </Texto>
                    </View>

                    <Texto style={estilos.subtitulo} accessibilityRole="header">
                        Tecnologias
                    </Texto>

                    <View style={estilos.card}>
                        {["React Native", "ESP32-S3 Sense", "Bluetooth", "OCR", "Síntese de voz"].map(
                            (tec, indice, lista) => (
                                <View
                                    key={tec}
                                    style={[
                                        estilos.itemLista,
                                        indice !== lista.length - 1 && estilos.itemListaBorda,
                                    ]}
                                >
                                    <Texto style={estilos.textoCard}>{tec}</Texto>
                                </View>
                            )
                        )}
                    </View>

                    <Texto style={estilos.subtitulo} accessibilityRole="header">
                        Equipe
                    </Texto>

                    <View style={estilos.integrantes}>

                        <View style={estilos.integranteItem}>
                            <Image
                                source={Pietro}
                                style={estilos.fotoIntegrante}
                                accessible={false}
                                importantForAccessibility="no"
                            />

                            <Texto style={estilos.nomeIntegrante}>
                                Pietro Davi Almeida Merique
                            </Texto>
                        </View>

                        <View style={estilos.integranteItem}>
                            <Image
                                source={Nicoli}
                                style={estilos.fotoIntegrante}
                                accessible={false}
                                importantForAccessibility="no"
                            />

                            <Texto style={estilos.nomeIntegrante}>
                                Nicoli Barboza da Silva
                            </Texto>
                        </View>

                        <View style={estilos.integranteItem}>
                            <Image
                                source={Matheus}
                                style={estilos.fotoIntegrante}
                                accessible={false}
                                importantForAccessibility="no"
                            />

                            <Texto style={estilos.nomeIntegrante}>
                                Matheus de Sousa Oliveira
                            </Texto>
                        </View>

                        <View style={estilos.integranteItem}>
                            <Image
                                source={Samara}
                                style={estilos.fotoIntegrante}
                                accessible={false}
                                importantForAccessibility="no"
                            />

                            <Texto style={estilos.nomeIntegrante}>
                                Samara Pereira da Silva
                            </Texto>
                        </View>

                    </View>

                    <Texto style={estilos.versao}>EyeVision v1.0 MVP</Texto>
                </View>
            </ScrollView>
        </SafeAreaProvider>
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
        marginBottom: 32,
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    logo: {
        width: 100,
        height: 100,
    },
    nomeApp: {
        fontSize: 22,
        color: cores.primariaClara,
        fontWeight: "600",
        marginTop: 8,
    },
    resumo: {
        textAlign: "left",
        lineHeight: 25,
        color: cores.primariaClara,
    },
    textoCard: {
        color: cores.primariaClara,
    },
    subtitulo: {
        marginBottom: 12,
        marginLeft: 8,
        color: cores.primariaClara,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
    },
    itemLista: {
        paddingVertical: 8,
    },
    itemListaBorda: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    integrantes: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },

    integranteItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    fotoIntegrante: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
    },

    nomeIntegrante: {
        flex: 1,
        color: cores.primariaClara,
        fontSize: 16,
    },
    marcador: {
        color: cores.primariaClara,
        opacity: 0.7,
    },
    versao: {
        marginTop: 20,
        textAlign: "center",
        color: cores.primariaClara,
    },
});
