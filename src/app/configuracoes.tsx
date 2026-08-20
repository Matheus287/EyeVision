import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Switch } from "../components/Switch";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Texto } from "../components/Texto"
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";

export default function Configuracoes() {

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    const confirmarSaida = () => {
    Alert.alert(
        "Sair",
        "Tem certeza que deseja sair?",
        [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Sair",
                style: "destructive",
                onPress: () => router.replace("/"),
            },
        ]
    );
};

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={estilos.container}>
                    <View style={estilos.cabecalho}>
                        <TouchableOpacity
                            style={estilos.botaoVoltar}
                            onPress={() => router.replace("/home")}
                        >
                            <Feather name="chevron-left" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Texto style={estilos.titulo}>Configurações</Texto>

                    <Texto style={estilos.subtitulo}>Dispositivo</Texto>

                    <View style={estilos.card}>
                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>Alertas de obstáculos</Texto>
                            <Switch ligado={configuracoes.alertasObstaculos} aoAlternar={() => alterarConfiguracao("alertasObstaculos", !configuracoes.alertasObstaculos)} />
                        </View>

                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>Modo Leitura</Texto>
                            <Switch ligado={configuracoes.modoLeitura} aoAlternar={() => alterarConfiguracao("modoLeitura", !configuracoes.modoLeitura)} />
                        </View>

                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>Modo Navegação</Texto>
                            <Switch ligado={configuracoes.modoNavegacao} aoAlternar={() => alterarConfiguracao("modoNavegacao", !configuracoes.modoNavegacao)} />
                        </View>

                        <View style={estilos.item}>
                            <Texto style={estilos.itemTexto}>Economia de Bateria</Texto>
                            <Switch ligado={configuracoes.economiaBateria} aoAlternar={() => alterarConfiguracao("economiaBateria", !configuracoes.economiaBateria)} />
                        </View>

                        <TouchableOpacity style={estilos.itemBotao}>
                            <Texto style={estilos.itemTexto}>Renomear</Texto>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[estilos.itemBotao, estilos.semBorda]}>
                            <Texto style={estilos.itemTexto}>Gerenciar Dispositivos</Texto>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Texto style={estilos.subtitulo}>Sistema</Texto>

                    <View style={estilos.card}>
                        <TouchableOpacity style={estilos.itemBotao}>
                            <Texto style={estilos.itemTexto}>Saída de áudio</Texto>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.itemBotao}
                            onPress={() => router.push("/velocidade-fala")}
                        >
                            <View>
                                <Texto style={estilos.itemTexto}>
                                    Velocidade da fala
                                </Texto>

                                <Texto style={estilos.valorConfiguracao}>
                                    {configuracoes.velocidadeFala}x
                                </Texto>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={20}
                                color={cores.primariaClara}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.itemBotao}
                            onPress={() => router.push("/volume")}
                        >
                            <View>
                                <Texto style={estilos.itemTexto}>
                                    Volume da reprodução
                                </Texto>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={20}
                                color={cores.primariaClara}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.itemBotao}
                            onPress={() => router.push("/idioma-leitura")}
                        >
                            <View>
                                <Texto style={estilos.itemTexto}>
                                    Idioma de leitura
                                </Texto>

                                <Texto style={estilos.valorConfiguracao}>
                                    {configuracoes.idiomaLeitura}
                                </Texto>
                            </View>

                            <Feather
                                name="chevron-right"
                                size={20}
                                color={cores.primariaClara}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.itemBotao} onPress={() => router.push("/sobre")}>
                            <Texto style={estilos.itemTexto}>Sobre</Texto>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[estilos.itemBotao, estilos.semBorda]}
                            onPress={confirmarSaida}
                        >
                            <Texto style={[estilos.itemTexto, estilos.sairTexto]}>
                                Sair
                            </Texto>

                            <Feather
                                name="chevron-right"
                                size={20}
                                color={cores.primariaClara}
                            />
                        </TouchableOpacity>
                    </View>
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
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 32,
    },
    botaoVoltar: {
        padding: 4,
    },
    titulo: {
        paddingBottom: 16,
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    subtitulo: {
        marginBottom: 12,
        marginLeft: 8,
        fontSize: tamanhos.base2,
        color: cores.primariaClara,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 32,
    },
    item: {
        minHeight: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    itemBotao: {
        minHeight: 60,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    semBorda: {
        borderBottomWidth: 0,
    },
    itemTexto: {
        color: cores.primariaClara,
    },
    sairTexto: {
        color: cores.aviso,
    },
    valorConfiguracao: {
    color: cores.primariaClara,
    opacity: 0.55,
    fontSize: 14,
    marginTop: 2,
},
});
