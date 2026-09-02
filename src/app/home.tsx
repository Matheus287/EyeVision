import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Switch } from "../components/Switch";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Texto } from "../components/Texto"
import { useConfiguracoes } from "../contexto/ConfiguracoesContext";
import { useBluetooth } from "../contexto/bluetoothContext"
import { useAnuncioDeTela, useAnuncioDeMudanca } from "../servicos/useAcessibilidade";

const Oculos = require("../assets/img/Oculos.png");

export default function Home() {

    const {
        configuracoes,
        alterarConfiguracao,
    } = useConfiguracoes();

    const { processandoIA } = useBluetooth();

    const router = useRouter();

    useAnuncioDeTela("Tela inicial, EyeVision");

    useAnuncioDeMudanca(processandoIA, (atual) =>
        atual ? "Processando" : "Processamento concluído"
    );

    return (
        <SafeAreaProvider>
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <Texto style={estilos.logo} accessibilityRole="header">
                        EyeVision
                    </Texto>

                    <View style={estilos.icones}>
                        <TouchableOpacity
                            style={estilos.botaoIcone}
                            onPress={() => router.push("/adicionar-dispositivo")}
                            accessibilityRole="button"
                            accessibilityLabel="Adicionar dispositivo"
                        >
                            <Feather name="plus" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.botaoIcone}
                            onPress={() => router.push("/configuracoes")}
                            accessibilityRole="button"
                            accessibilityLabel="Abrir configurações"
                        >
                            <Feather name="settings" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={estilos.dispositivo}>
                    <Texto style={estilos.titulo} accessibilityRole="header">
                        Dispositivo 1
                    </Texto>

                    <Image
                        source={Oculos}
                        style={estilos.img}
                        resizeMode="contain"
                        accessible={false}
                        importantForAccessibility="no"
                    />

                    <View
                        style={estilos.card}
                        accessible
                        accessibilityLabel="Bluetooth: conectado. Bateria: 80 por cento."
                    >
                        <View style={estilos.cardItem}>
                            <Feather
                                name="bluetooth"
                                size={25}
                                color={cores.primariaClara}
                            />
                            <Texto style={estilos.cardTexto}>Conectado</Texto>
                        </View>

                        <View style={estilos.divisoria} />

                        <View style={estilos.cardItem}>
                            <Feather
                                name="battery"
                                size={25}
                                color={cores.primariaClara}
                            />
                            <Texto style={estilos.cardTexto}>80%</Texto>
                        </View>
                    </View>
                </View>

                {processandoIA ? (
                    <View
                        style={estilos.processandoContainer}
                        accessible
                        accessibilityLiveRegion="polite"
                        accessibilityLabel="Processando"
                    >
                        <ActivityIndicator
                            size="small"
                            color={cores.primariaClara}
                        />

                        <Texto style={estilos.processandoTexto}>
                            Processando...
                        </Texto>
                    </View>
                ) : (
                    <View style={estilos.processandoContainerVazio} />
                )}

                <View style={estilos.opcoes}>
                    <TouchableOpacity
                        style={estilos.submitButton}
                        onPress={() => router.push("/historico")}
                        accessibilityRole="button"
                    >
                        <Texto style={estilos.submitButtonTexto}>Histórico</Texto>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={estilos.submitButton}
                        onPress={() => router.push("/teste-ia")}
                        accessibilityRole="button"
                    >
                        <Texto style={estilos.submitButtonTexto}>Testar IA</Texto>
                    </TouchableOpacity>

                    <View style={estilos.conteinerToggle}>
                        <Texto style={estilos.toggleTexto}>Modo Navegação</Texto>
                        <Switch
                            rotulo="Modo Navegação"
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
                            rotulo="Economia de Bateria"
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
        alignItems: "center",
        backgroundColor: cores.primariaBase,
        borderRadius: 30,
        width: "100%",
        paddingVertical: 15,
    },
    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 24,
    },

    divisoria: {
        width: 1,
        height: 38,
        backgroundColor: cores.divisoria,
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
        height: 45,
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
        height: 45,
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
    processandoContainer: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    processandoContainerVazio: {
        height: 50,
    },

    processandoTexto: {
        color: cores.primariaClara,
        fontSize: 16,
        fontWeight: "600",
    },
});
