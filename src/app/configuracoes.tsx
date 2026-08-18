import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Switch } from "../components/Switch";
import { cores, tamanhos } from "../theme/colors";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Configuracoes() {

    const [alertasObstaculos, setAlertasObstaculos] = useState(false);
    const [modoLeitura, setModoLeitura] = useState(false);
    const [modoNavegacao, setModoNavegacao] = useState(false);
    const [economiaBateria, setEconomiaBateria] = useState(false);

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={estilos.container}>
                    <View style={estilos.cabecalho}>
                        <TouchableOpacity
                            style={estilos.botaoVoltar}
                            onPress={() => router.push("/")}
                        >
                            <Feather name="chevron-left" size={24} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Text style={estilos.titulo}>Configurações</Text>

                    <Text style={estilos.subtitulo}>Dispositivo</Text>

                    <View style={estilos.card}>
                        <View style={estilos.item}>
                            <Text style={estilos.itemTexto}>Alertas de obstáculos</Text>
                            <Switch ligado={alertasObstaculos} aoAlternar={() => setAlertasObstaculos(!alertasObstaculos)} />
                        </View>

                        <View style={estilos.item}>
                            <Text style={estilos.itemTexto}>Modo Leitura</Text>
                            <Switch ligado={modoLeitura} aoAlternar={() => setModoLeitura(!modoLeitura)} />
                        </View>

                        <View style={estilos.item}>
                            <Text style={estilos.itemTexto}>Modo Navegação</Text>
                            <Switch ligado={modoNavegacao} aoAlternar={() => setModoNavegacao(!modoNavegacao)} />
                        </View>

                        <View style={estilos.item}>
                            <Text style={estilos.itemTexto}>Economia de Bateria</Text>
                            <Switch ligado={economiaBateria} aoAlternar={() => setEconomiaBateria(!economiaBateria)} />
                        </View>

                        <TouchableOpacity style={estilos.itemBotao}>
                            <Text style={estilos.itemTexto}>Renomear</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[estilos.itemBotao, estilos.semBorda]}>
                            <Text style={estilos.itemTexto}>Gerenciar Dispositivos</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>
                    </View>

                    <Text style={estilos.subtitulo}>Sistema</Text>

                    <View style={estilos.card}>
                        <TouchableOpacity style={estilos.itemBotao}>
                            <Text style={estilos.itemTexto}>Saída de áudio</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.itemBotao}>
                            <Text style={estilos.itemTexto}>Velocidade da fala</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.itemBotao}>
                            <Text style={estilos.itemTexto}>Volume da reprodução</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.itemBotao}>
                            <Text style={estilos.itemTexto}>Idioma de leitura</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={estilos.itemBotao} onPress={() => router.push("/sobre")}>
                            <Text style={estilos.itemTexto}>Sobre</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[estilos.itemBotao, estilos.semBorda]} onPress={() => router.push("/")}>
                            <Text style={[estilos.itemTexto, estilos.sairTexto]}>Sair</Text>
                            <Feather name="chevron-right" size={20} color={cores.primariaClara} />
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
});
