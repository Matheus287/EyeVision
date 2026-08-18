import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";


const Logo = require("../assets/img/Icone Branco.png");
const Grupo = require("../assets/img/GrupoEyeVision.png");

export default function Sobre() {

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={estilos.container}>
                    <View style={estilos.cabecalho}>
                        <TouchableOpacity
                            style={estilos.botaoVoltar}
                            onPress={() => router.push("/configuracoes")}
                        >
                            <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Text style={estilos.titulo}>Sobre</Text>

                    <View style={estilos.logoContainer}>
                        <Image source={Logo} style={estilos.logo} resizeMode="contain" />
                        <Text style={estilos.nomeApp}>EyeVision</Text>
                    </View>

                    <View style={estilos.card}>
                        <Text style={estilos.resumo}>
                            O EyeVision é uma tecnologia assistiva desenvolvida para
                            auxiliar pessoas com deficiência visual por meio de visão
                            computacional, sensores inteligentes e feedback em áudio,
                            promovendo maior autonomia e acessibilidade.
                        </Text>
                    </View>

                    <Text style={estilos.subtitulo}>Objetivo</Text>

                    <View style={estilos.card}>
                        <Text style={estilos.textoCard}>
                            Democratizar a acessibilidade para pessoas com deficiência
                            visual por meio de um dispositivo que se acopla a um óculos
                            e com suas funções, auxilie essas pessoas na sua vida
                            cotidiana.
                        </Text>
                    </View>

                    <Text style={estilos.subtitulo}>Tecnologias</Text>

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
                                    <Text style={estilos.textoCard}>{tec}</Text>
                                </View>
                            )
                        )}
                    </View>

                    <Text style={estilos.subtitulo}>Equipe</Text>

                    <View style={estilos.integrantes}>
                        <Image source={Grupo} style={estilos.grupoImg} resizeMode="cover" />

                        <View style={estilos.listaIntegrantes}>
                            {[
                                "Pietro Davi Almeida Merique",
                                "Nicoli Barboza da Silva",
                                "Matheus de Sousa Oliveira",
                                "Samara Pereira da Silva",
                            ].map((nome) => (
                                <View key={nome} style={estilos.integranteItem}>
                                    <Text style={estilos.marcador}>•</Text>
                                    <Text style={estilos.textoCard}>{nome}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <Text style={estilos.versao}>EyeVision v1.0 MVP</Text>
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
        textAlign: "center",
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
        flexDirection: "row",
        alignItems: "center",
        gap: 32,
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        padding: 24,
    },
    grupoImg: {
        height: 200,
        width: 120,
        borderRadius: 20,
    },
    listaIntegrantes: {
        flex: 1,
        gap: 16,
    },
    integranteItem: {
        flexDirection: "row",
        gap: 6,
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
