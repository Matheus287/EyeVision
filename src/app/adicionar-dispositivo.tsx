import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cores } from "../theme/colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Texto } from "../components/Texto"

export default function AdicionarDispositivo() {

    const router = useRouter();

    return (
        <SafeAreaProvider>
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <TouchableOpacity
                        style={estilos.botaoVoltar}
                        onPress={() => router.replace("/home")}
                    >
                        <Feather name="chevron-left" size={28} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Texto style={estilos.titulo}>Adicionar Dispositivos</Texto>

                <Texto style={estilos.subtitulo}>Dispositivos conhecidos</Texto>

                <View style={estilos.card}>
                    <TouchableOpacity style={estilos.item}>
                        <Texto style={estilos.itemTexto}>Dispositivo 1</Texto>
                        <Feather name="chevron-right" size={19} color={cores.primariaClara} />
                    </TouchableOpacity>
                </View>

                <Texto style={estilos.subtitulo}>Dispositivos disponíveis</Texto>

                <View style={estilos.card}>
                    <View style={estilos.item}>
                        <Texto style={estilos.itemTexto}>Procurando por dispositivos...</Texto>
                    </View>
                </View>

                <Texto style={estilos.aviso}>
                    Verifique se o dispositivo que você deseja conectar está ligado e
                    no modo pareamento e se seu celular está com o bluetooth ligado.
                </Texto>
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
        alignItems: "center",
        marginBottom: 16,
    },
    botaoVoltar: {
        padding: 4,
    },
    titulo: {
        marginBottom: 32,
        fontSize: 24,
        color: cores.primariaClara,
        fontWeight: "600",
    },
    subtitulo: {
        marginBottom: 12,
        marginLeft: 8,
        color: cores.primariaClara,
    },
    card: {
        backgroundColor: cores.primariaBase,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 32,
    },
    item: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.divisoria,
    },
    itemTexto: {
        color: cores.primariaClara,
    },
    aviso: {
        marginTop: 32,
        textAlign: "center",
        opacity: 0.75,
        lineHeight: 21,
        color: cores.primariaClara,
    },
});
