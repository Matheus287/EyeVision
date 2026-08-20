import { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Switch } from "../components/Switch";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Texto } from "../components/Texto"
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";

const Oculos = require("../assets/img/Oculos.png");

export default function Home() {

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <Texto style={estilos.logo}>EyeVision</Texto>

                    <View style={estilos.icones}>
                        <TouchableOpacity
                            style={estilos.botaoIcone}
                            onPress={() => router.push("/adicionar-dispositivo")}
                        >
                            <Feather name="plus" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.botaoIcone}
                            onPress={() => router.push("/configuracoes")}
                        >
                            <Feather name="settings" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={estilos.dispositivo}>
                    <Texto style={estilos.titulo}>Dispositivo 1</Texto>
                    <Image source={Oculos} style={estilos.img} resizeMode="contain" />

                    <View style={estilos.card}>
                        <View style={estilos.cardItem}>
                            <Feather name="bluetooth" size={20} color={cores.primariaClara} />
                            <Texto style={estilos.cardTexto}>Desconectado</Texto>
                        </View>

                        <View style={estilos.cardItem}>
                            <Feather name="battery" size={20} color={cores.primariaClara} />
                            <Texto style={estilos.cardTexto}>22%</Texto>
                        </View>
                    </View>
                </View>

                <View style={estilos.opcoes}>
                    <TouchableOpacity
                        style={estilos.submitButton}
                        onPress={() => router.push("/historico")}
                    >
                        <Texto style={estilos.submitButtonTexto}>Histórico</Texto>
                    </TouchableOpacity>

                    <View style={estilos.conteinerToggle}>
                        <Texto style={estilos.toggleTexto}>Modo Navegação</Texto>
                        <Switch
                            ligado={configuracoes.modoNavegacao}
                            aoAlternar={() =>
                                alterarConfiguracao(
                                    "modoNavegacao",
                                    !configuracoes.modoNavegacao
                                )
                            }
                        />
                    </View>

                    <View style={estilos.conteinerToggle}>
                        <Texto style={estilos.toggleTexto}>Economia de Bateria</Texto>
                        <Switch
                            ligado={configuracoes.economiaBateria}
                            aoAlternar={() =>
                                alterarConfiguracao(
                                    "economiaBateria",
                                    !configuracoes.economiaBateria
                                )
                            }
                        />
                    </View>
                </View>
            </View>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    logo: {
        fontSize: tamanhos.base1,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    icones: {
        flexDirection: "row",
        gap: 16,
    },
    botaoIcone: {
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
    },
    dispositivo: {
        alignItems: "center",
    },
    titulo: {
        margin: 16,
        fontSize: 20,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    img: {
        height: 200,
        width: "100%",
    },
    card: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 16,
        padding: 24,
        backgroundColor: cores.primariaBase,
        borderRadius: 30,
        gap: 60,
        width: "100%",
    },
    cardItem: {
        alignItems: "center",
        gap: 4,
    },
    cardTexto: {
        color: cores.primariaClara,
    },
    opcoes: {
        alignItems: "center",
        marginTop: 8,
    },
    submitButton: {
        width: "100%",
        maxWidth: 400,
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: cores.secundariaBase,
        borderRadius: 30,
        alignItems: "center",
    },
    submitButtonTexto: {
        color: cores.primariaClara,
        fontSize: tamanhos.base2,
        fontWeight: "600",
    },
    conteinerToggle: {
        width: "100%",
        maxWidth: 400,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 16,
        backgroundColor: cores.secundariaClara,
        borderRadius: 30,
    },
    toggleTexto: {
        color: cores.primariaClara,
        fontSize: tamanhos.base2,
    },
});
